import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: process.env.NODE_ENV === "development" ? "/" : process.env.VITE_BASE_PATH || "/",
    optimizeDeps: {
      entries: ["src/main.tsx", "src/tempobook/**/*"],
    },
    plugins: [
      react(),
    ],
    resolve: {
      preserveSymlinks: true,
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      // @ts-ignore
      allowedHosts: true,
      proxy: {
        '/admin/api': {
          target: `https://${env.VITE_SHOPIFY_STORE_DOMAIN}`,
          changeOrigin: true,
        }
      }
    }
  };
});
