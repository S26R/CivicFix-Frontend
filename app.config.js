export default ({ config }) => ({
  ...config,
  expo: {
    name: "CivicFix",
    slug: "civicfix",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/CivicFix.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/AppIconbg.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      permissions: [
        "android.permission.RECORD_AUDIO",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
      ],
      package: "com.nikaman69420.CivicFix",
    },
    web: {
      favicon: "./assets/appIcon.png",
      bundler: "metro",
    },
    plugins: [
      "expo-router",
      [
        "expo-image-picker",
        {
          photosPermission:
            "The app accesses your photos to register your issue.",
        },
      ],
      [
        "expo-location",
        {
          locationWhenInUsePermission: "Show current location on map",
        },
      ],
    ],
    scheme: "your-app-scheme",
    extra: {
      router: {},
      eas: {
        projectId: "c19a1748-89b7-4a2e-a7c8-acc79addf547",
      },
      API_URL: process.env.API_URL,
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY, // for geocoding/reverse geocoding
    },
  },
});
