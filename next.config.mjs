/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: "AIzaSyBx-DNaP1bC_Dd7Y73k8yVzXqBgY9qMOKI",
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "turnero-digital-xbarber.firebaseapp.com",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: "turnero-digital-xbarber",
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "turnero-digital-xbarber.firebasestorage.app",
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "221943080873",
    NEXT_PUBLIC_FIREBASE_APP_ID: "1:221943080873:web:1bccd8167b4d6d0ee246b8",
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: "G-9CVPLWF2YF",
  },
};
export default nextConfig;

