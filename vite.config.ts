import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";
import { defineConfig } from "vite";

/**
 * Vite plugin that forwards browser console.error / console.warn to the terminal.
 * Injects a snippet into the app entry so import.meta.hot is available via Vite's HMR.
 */
function browserLogsPlugin(): Plugin {
  return {
    name: "browser-logs",
    enforce: "post",
    transform(code, id) {
      // Inject into the app entry point only
      if (!id.includes("src/main.tsx")) {
        return;
      }
      const snippet = `
;(function __browserLogs__() {
  if (import.meta.hot) {
    for (const level of ["error", "warn"]) {
      const orig = console[level].bind(console);
      console[level] = function (...args) {
        orig(...args);
        try {
          const safe = args.map(a => {
            if (a instanceof Error) return a.stack || a.message;
            if (typeof a === "object") try { return JSON.stringify(a, null, 2); } catch { return String(a); }
            return String(a);
          });
          import.meta.hot.send("browser:log", { level, args: safe });
        } catch {}
      };
    }
  }
})();
`;
      return { code: snippet + code, map: null };
    },
    configureServer(server) {
      const colors: Record<string, string> = {
        error: "\x1b[31m",
        warn: "\x1b[33m",
        info: "\x1b[36m",
        log: "\x1b[37m",
      };
      const reset = "\x1b[0m";

      server.ws.on("browser:log", (data: { level: string; args: string[] }) => {
        const color = colors[data.level] || colors.log;
        const label = `[browser:${data.level}]`;
        console.log(`${color}${label}${reset}`, ...data.args);
      });
    },
  };
}

// Resolve figma:asset imports (Figma Make protocol) to a placeholder for local Vite dev
function figmaAssetPlugin() {
  const placeholder = path.resolve(
    import.meta.dirname,
    "src/figma-placeholder.svg"
  );
  return {
    name: "figma-asset-resolver",
    resolveId(id: string) {
      if (id.startsWith("figma:asset/")) {
        return placeholder;
      }
    },
  };
}

export default defineConfig({
  plugins: [
    browserLogsPlugin(),
    figmaAssetPlugin(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      "@": path.resolve(import.meta.dirname, "./src"),
    },
    dedupe: [
      "react",
      "react-dom",
      "react-router",
      "motion",
      "sonner",
      "react-hook-form",
      "recharts",
      "react-dnd",
      "react-dnd-html5-backend",
      "lucide-react",
      "react-leaflet",
      "@emotion/react",
      "@emotion/styled",
      "@mui/material",
      "@mui/icons-material",
      "@radix-ui/react-accordion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-context-menu",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-hover-card",
      "@radix-ui/react-label",
      "@radix-ui/react-menubar",
      "@radix-ui/react-navigation-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-progress",
      "@radix-ui/react-radio-group",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slider",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toggle",
      "@radix-ui/react-toggle-group",
      "@radix-ui/react-tooltip",
      "cmdk",
      "embla-carousel-react",
      "react-day-picker",
      "react-resizable-panels",
      "vaul",
    ],
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router",
      "motion",
      "motion/react",
      "sonner",
      "react-hook-form",
      "recharts",
      "react-dnd",
      "react-dnd-html5-backend",
      "lucide-react",
      "react-leaflet",
      "@emotion/react",
      "@emotion/styled",
      "@mui/material",
      "@mui/icons-material",
    ],
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ["**/*.svg", "**/*.csv"],
});
