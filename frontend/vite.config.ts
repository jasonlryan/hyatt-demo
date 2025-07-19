import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
    watch: {
      ignored: ["!**/orchestrations/generated/**"],
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
    exclude: ["**/orchestrations/generated/**", "lucide-react"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          orchestrations: (id: string) => {
            if (id.includes("/orchestrations/generated/")) {
              return "orchestrations";
            }
          },
        },
      },
    },
    sourcemap: true,
  },
});
