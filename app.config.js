export default ({ config }) => ({
  ...config,
  expo: {
    name: "CivicFix",
    slug: "CivicFix",
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
        projectId: "37f1598b-798b-4b2c-bfff-021b36391fc9",
      },
      API_URL: process.env.API_URL,
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY, // for geocoding/reverse geocoding
    },
  },
});
