import { defineConfig } from "tsup";

const themeNames = [
  "light", "dark", "midnight", "ocean", "sunset",
  "forest", "lavender", "rose", "slate", "ember",
  "arctic", "neon", "pastel", "monochrome", "cyberpunk",
  "retro", "minimal", "glass", "brutalist", "candy",
  "earth", "sapphire", "copper", "aurora", "storm",
];

export default defineConfig([
  // JS bundle (components + hooks)
  {
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    sourcemap: true,
    clean: true,
    external: ["react", "react-dom"],
    minify: true,
    treeshake: true,
  },
  // Base CSS
  {
    entry: { styles: "src/styles/swiper.css" },
    outDir: "dist",
  },
  // All themes bundled (convenience import)
  {
    entry: { themes: "src/styles/themes/index.css" },
    outDir: "dist",
  },
  // Individual theme files
  {
    entry: Object.fromEntries(
      themeNames.map((name) => [`themes/${name}`, `src/styles/themes/${name}.css`]),
    ),
    outDir: "dist",
  },
]);
