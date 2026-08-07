import type { ConfigContext, ExpoConfig } from 'expo/config';

type AppVariant = 'development' | 'preview' | 'production';

const EAS_PROJECT_ID = '4c89d483-0cc7-4565-8c65-fe78f5637001';

const variant = (process.env.APP_VARIANT ?? process.env.EAS_BUILD_PROFILE ?? 'production') as AppVariant;

function getVariantConfig(appVariant: AppVariant) {
  if (appVariant === 'development') {
    return {
      appName: 'Kitchen Inventory Dev',
      scheme: 'inventoryapp-dev',
      bundleIdentifier: 'com.csolutions.inventoryapp.dev',
      packageName: 'com.csolutions.inventoryapp.dev',
    };
  }

  if (appVariant === 'preview') {
    return {
      appName: 'Kitchen Inventory Preview',
      scheme: 'inventoryapp-preview',
      bundleIdentifier: 'com.csolutions.inventoryapp.preview',
      packageName: 'com.csolutions.inventoryapp.preview',
    };
  }

  return {
    appName: 'Kitchen Inventory',
    scheme: 'inventoryapp',
    bundleIdentifier: 'com.csolutions.inventoryapp',
    packageName: 'com.csolutions.inventoryapp',
  };
}

export default (_: ConfigContext): ExpoConfig => {
  const variantConfig = getVariantConfig(variant);

  return {
    name: variantConfig.appName,
    slug: 'inventory-app',
    version: '0.2.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: variantConfig.scheme,
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    owner: 'crespo1301',
    ios: {
      supportsTablet: false,
      bundleIdentifier: variantConfig.bundleIdentifier,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: variantConfig.packageName,
      adaptiveIcon: {
        backgroundColor: '#15A150',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      appVariant: variant,
      router: {},
      eas: {
        projectId: EAS_PROJECT_ID,
      },
    },
  };
};
