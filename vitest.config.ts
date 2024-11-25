import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    name: "react",
    browser: {
      headless: true,
      enabled: true,
      name: "chromium",
      provider: "playwright",
    },
  },
});
