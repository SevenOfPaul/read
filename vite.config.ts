import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
   optimizeDeps: {
    exclude: ["virtual:react-router/server-build"],
  },
  plugins: [
    reactRouter(),
     tailwindcss(),
    tsconfigPaths(),
  ],
});
