import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { LoopingSwiper, THEME_NAMES } from "../src";
import type { SwiperTheme } from "../src";
import "../src/styles/swiper.css";
import "../src/styles/themes/index.css";

const Card: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div
    style={{
      width: 240,
      height: 160,
      backgroundColor: color,
      borderRadius: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontSize: 16,
      fontWeight: 700,
      fontFamily: "sans-serif",
    }}
  >
    {label}
  </div>
);

const COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#a855f7", "#f97316"];
const cards = COLORS.map((c, i) => <Card key={i} color={c} label={`Card ${i + 1}`} />);

const meta: Meta = {
  title: "Themes",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

// ─── All Themes Gallery ─────────────────────────────────────────────────

const ThemeGallery = () => (
  <div style={{ padding: 24, fontFamily: "sans-serif" }}>
    <h1 style={{ marginBottom: 32, fontSize: 24, fontWeight: 700 }}>
      All 25 Themes
    </h1>
    <div style={{ display: "grid", gap: 32 }}>
      {THEME_NAMES.map((theme) => {
        const isDark = [
          "dark", "midnight", "ocean", "sunset", "forest", "ember",
          "neon", "cyberpunk", "sapphire", "copper", "aurora", "storm",
        ].includes(theme);

        return (
          <div
            key={theme}
            style={{
              background: isDark ? "#111" : "#f9fafb",
              padding: 24,
              borderRadius: 12,
            }}
          >
            <h3
              style={{
                marginBottom: 12,
                fontSize: 14,
                fontWeight: 600,
                color: isDark ? "#e5e7eb" : "#374151",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {theme}
            </h3>
            <LoopingSwiper theme={theme} gap={16} infinite showDots showNavigation>
              {cards}
            </LoopingSwiper>
          </div>
        );
      })}
    </div>
  </div>
);

export const AllThemes: StoryObj = {
  render: () => <ThemeGallery />,
};

// ─── Theme Switcher (interactive) ───────────────────────────────────────

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState<SwiperTheme>("light");

  const isDark = [
    "dark", "midnight", "ocean", "sunset", "forest", "ember",
    "neon", "cyberpunk", "sapphire", "copper", "aurora", "storm",
  ].includes(theme);

  return (
    <div
      style={{
        padding: 32,
        minHeight: "100vh",
        background: isDark ? "#0a0a0a" : "#f9fafb",
        fontFamily: "sans-serif",
        transition: "background 0.3s",
      }}
    >
      <h2 style={{ color: isDark ? "#fff" : "#111", marginBottom: 16 }}>
        Theme: <strong>{theme}</strong>
      </h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
        {THEME_NAMES.map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            style={{
              padding: "6px 14px",
              borderRadius: 6,
              border: t === theme ? "2px solid #3b82f6" : "1px solid #d1d5db",
              background: t === theme ? "#3b82f6" : "transparent",
              color: t === theme ? "#fff" : isDark ? "#d1d5db" : "#374151",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: t === theme ? 700 : 400,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <LoopingSwiper
        theme={theme}
        gap={20}
        infinite
        showDots
        showNavigation
        autoplay
        autoplayInterval={3000}
      >
        {cards}
      </LoopingSwiper>
    </div>
  );
};

export const InteractiveSwitcher: StoryObj = {
  render: () => <ThemeSwitcher />,
};
