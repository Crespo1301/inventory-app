/**
 * Connectivity hook.
 *
 * Wraps @react-native-community/netinfo and exposes a simple boolean.
 * When connectivity transitions from false → true, fires an optional callback
 * so the store can trigger an outbox flush immediately.
 *
 * Starts by assuming online so the first render never shows a false "offline"
 * flash — netinfo delivers the real state within a frame.
 */

import { useEffect, useRef, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

type Options = {
  /** Called once each time connectivity returns (false → true transition). */
  onReconnect?: () => void;
};

export function useConnectivity({ onReconnect }: Options = {}): boolean {
  // Assume online initially; netinfo updates within the first render cycle.
  const [isOnline, setIsOnline] = useState(true);
  const prevOnline = useRef(true);
  const onReconnectRef = useRef(onReconnect);

  // Keep the callback ref fresh without causing the effect to re-run.
  useEffect(() => {
    onReconnectRef.current = onReconnect;
  });

  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      const connected = !!(state.isConnected && state.isInternetReachable !== false);

      if (!prevOnline.current && connected) {
        // Device just came back online — replay the outbox.
        onReconnectRef.current?.();
      }

      prevOnline.current = connected;
      setIsOnline(connected);
    });

    return unsub;
  }, []);

  return isOnline;
}
