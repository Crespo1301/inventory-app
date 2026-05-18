const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

declare const Deno: {
  env: {
    get(name: string): string | undefined;
  };
  serve(handler: (req: Request) => Response | Promise<Response>): void;
};

type InvitationRole = 'manager' | 'member';

type InvitationPayload = {
  companyName: string;
  invitedByName: string;
  invitedByEmail?: string;
  inviteeEmail: string;
  code: string;
  role: InvitationRole;
  locationNames?: string[];
};

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

function isInvitationPayload(value: unknown): value is InvitationPayload {
  if (!value || typeof value !== 'object') return false;
  const payload = value as Record<string, unknown>;
  return (
    typeof payload.companyName === 'string' &&
    typeof payload.invitedByName === 'string' &&
    typeof payload.inviteeEmail === 'string' &&
    typeof payload.code === 'string' &&
    (payload.role === 'manager' || payload.role === 'member') &&
    (payload.locationNames === undefined ||
      (Array.isArray(payload.locationNames) && payload.locationNames.every((name) => typeof name === 'string'))) &&
    (payload.invitedByEmail === undefined || typeof payload.invitedByEmail === 'string')
  );
}

function roleLabel(role: InvitationRole): string {
  return role === 'manager' ? 'Manager' : 'Team Member';
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json(405, { error: 'Method not allowed.' });
  }

  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  const fromEmail = Deno.env.get('INVITE_EMAIL_FROM');
  const replyTo = Deno.env.get('INVITE_EMAIL_REPLY_TO');
  const appName = Deno.env.get('INVITE_EMAIL_APP_NAME') ?? 'Inventory App';

  if (!resendApiKey || !fromEmail) {
    return json(500, {
      error: 'Invite email delivery is not configured. Set RESEND_API_KEY and INVITE_EMAIL_FROM.',
    });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return json(400, { error: 'Invalid JSON body.' });
  }

  if (!isInvitationPayload(payload)) {
    return json(400, { error: 'Missing or invalid invitation payload.' });
  }

  const companyName = payload.companyName.trim();
  const invitedByName = payload.invitedByName.trim();
  const inviteeEmail = payload.inviteeEmail.trim().toLowerCase();
  const code = payload.code.trim().toUpperCase();
  const locations = (payload.locationNames ?? []).map((name) => name.trim()).filter(Boolean);
  const senderEmail = payload.invitedByEmail?.trim();

  const subject = `You're invited to join ${companyName} on ${appName}`;
  const invitationLine = `${invitedByName} invited you to join ${companyName} on ${appName} as a ${roleLabel(payload.role)}.`;
  const locationLine =
    locations.length > 0 ? `Assigned location${locations.length === 1 ? '' : 's'}: ${locations.join(', ')}.` : '';
  const replyLine = senderEmail ? `Reply to ${senderEmail} if you have any questions.` : '';

  const text = [
    invitationLine,
    locationLine,
    '',
    `Invitation code: ${code}`,
    '',
    `Open ${appName}, choose "Join a company", and sign up with ${inviteeEmail}.`,
    `Enter the invitation code above when prompted.`,
    '',
    replyLine,
  ]
    .filter(Boolean)
    .join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.5;">
      <p>${invitationLine}</p>
      ${locationLine ? `<p>${locationLine}</p>` : ''}
      <div style="margin: 24px 0; padding: 16px; background: #f3f4f6; border-radius: 12px;">
        <p style="margin: 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; color: #6b7280;">Invitation code</p>
        <p style="margin: 8px 0 0; font-size: 28px; font-weight: 700; letter-spacing: 0.12em;">${code}</p>
      </div>
      <p>Open ${appName}, choose <strong>Join a company</strong>, and sign up with <strong>${inviteeEmail}</strong>.</p>
      <p>Enter the invitation code above when prompted.</p>
      ${replyLine ? `<p>${replyLine}</p>` : ''}
    </div>
  `;

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [inviteeEmail],
      subject,
      html,
      text,
      ...(replyTo ? { reply_to: [replyTo] } : {}),
    }),
  });

  if (!resendResponse.ok) {
    const errorText = await resendResponse.text();
    return json(502, { error: `Resend request failed: ${errorText}` });
  }

  const result = await resendResponse.json();
  return json(200, { ok: true, id: result.id ?? null });
});
