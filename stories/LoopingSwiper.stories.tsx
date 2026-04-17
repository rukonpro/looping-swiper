import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { LoopingSwiper } from "../src";
import "../src/styles/swiper.css";
import "../src/styles/themes/index.css";

const Card: React.FC<{
  color: string;
  label: string;
  width?: number;
  height?: number;
}> = ({ color, label, width = 320, height = 220 }) => (
  <div
    style={{
      width,
      height,
      backgroundColor: color,
      borderRadius: 12,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontSize: 20,
      fontWeight: 700,
      fontFamily: "sans-serif",
    }}
  >
    {label}
  </div>
);

const COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#a855f7", "#f97316", "#06b6d4"];
const defaultCards = COLORS.map((c, i) => <Card key={i} color={c} label={`Card ${i + 1}`} />);

const meta: Meta<typeof LoopingSwiper> = {
  title: "LoopingSwiper",
  component: LoopingSwiper,
  parameters: { layout: "padded" },
  argTypes: {
    theme: {
      control: "select",
      options: [
        "light", "dark", "midnight", "ocean", "sunset", "forest", "lavender",
        "rose", "slate", "ember", "arctic", "neon", "pastel", "monochrome",
        "cyberpunk", "retro", "minimal", "glass", "brutalist", "candy",
        "earth", "sapphire", "copper", "aurora", "storm",
      ],
    },
    effect: { control: "select", options: ["slide", "fade"] },
    gap: { control: { type: "range", min: 0, max: 60, step: 4 } },
    infinite: { control: "boolean" },
    showNavigation: { control: "boolean" },
    showDots: { control: "boolean" },
    showProgressBar: { control: "boolean" },
    freeScroll: { control: "boolean" },
    autoplay: { control: "boolean" },
    autoplayInterval: { control: { type: "range", min: 1000, max: 8000, step: 500 } },
    transitionDuration: { control: { type: "range", min: 100, max: 1000, step: 50 } },
  },
};

export default meta;
type Story = StoryObj<typeof LoopingSwiper>;

export const Default: Story = {
  args: { gap: 20, infinite: false, showNavigation: true, showDots: true },
  render: (args) => <LoopingSwiper {...args}>{defaultCards}</LoopingSwiper>,
};

export const InfiniteLoop: Story = {
  args: { theme: "dark", gap: 20, infinite: true, showDots: true },
  render: (args) => (
    <div style={{ background: "#111", padding: 24, borderRadius: 12 }}>
      <LoopingSwiper {...args}>{defaultCards}</LoopingSwiper>
    </div>
  ),
};

export const Autoplay: Story = {
  args: { theme: "neon", infinite: true, showDots: true, autoplay: true, autoplayInterval: 2000 },
  render: (args) => (
    <div style={{ background: "#000", padding: 24 }}>
      <LoopingSwiper {...args}>{defaultCards}</LoopingSwiper>
    </div>
  ),
};

export const ProgressBar: Story = {
  args: { theme: "sapphire", infinite: true, showProgressBar: true, showNavigation: true },
  render: (args) => (
    <div style={{ background: "#1e3a8a", padding: 24, borderRadius: 12 }}>
      <LoopingSwiper {...args}>{defaultCards}</LoopingSwiper>
    </div>
  ),
};

export const FadeEffect: Story = {
  args: { theme: "midnight", effect: "fade", infinite: true, showDots: true, showNavigation: true },
  render: (args) => (
    <div style={{ background: "#0f172a", padding: 24, borderRadius: 12 }}>
      <LoopingSwiper {...args}>
        {COLORS.map((c, i) => (
          <div
            key={i}
            style={{
              width: "100%",
              height: 300,
              backgroundColor: c,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 32,
              fontWeight: 700,
              fontFamily: "sans-serif",
            }}
          >
            Slide {i + 1}
          </div>
        ))}
      </LoopingSwiper>
    </div>
  ),
};

export const FreeScroll: Story = {
  args: { theme: "glass", gap: 16, infinite: true, freeScroll: true, showDots: true },
  render: (args) => (
    <div style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: 24, borderRadius: 12 }}>
      <LoopingSwiper {...args}>{defaultCards}</LoopingSwiper>
    </div>
  ),
};

export const SlidesPerView: Story = {
  args: { theme: "slate", gap: 16, infinite: true, showDots: true, slidesPerView: 3 },
  render: (args) => (
    <LoopingSwiper {...args}>
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          style={{
            height: 200,
            backgroundColor: COLORS[i % COLORS.length],
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 20,
            fontWeight: 700,
            fontFamily: "sans-serif",
          }}
        >
          Card {i + 1}
        </div>
      ))}
    </LoopingSwiper>
  ),
};

export const ResponsiveSlidesPerView: Story = {
  args: {
    theme: "earth",
    gap: 16,
    infinite: true,
    showDots: true,
    showProgressBar: true,
    slidesPerView: { base: 1, sm: 2, md: 3, lg: 4 },
  },
  render: (args) => (
    <LoopingSwiper {...args}>
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          style={{
            height: 180,
            backgroundColor: COLORS[i % COLORS.length],
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 18,
            fontWeight: 700,
            fontFamily: "sans-serif",
          }}
        >
          Item {i + 1}
        </div>
      ))}
    </LoopingSwiper>
  ),
};

export const CustomButtons: Story = {
  args: { theme: "candy", infinite: true, showDots: true },
  render: (args) => (
    <LoopingSwiper
      {...args}
      renderPrevButton={(onClick, disabled) => (
        <button
          onClick={onClick}
          disabled={disabled}
          style={{
            position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)",
            zIndex: 10, padding: "8px 16px", background: "#ec4899", color: "#fff",
            border: "none", borderRadius: 20, cursor: disabled ? "default" : "pointer",
            opacity: disabled ? 0.3 : 1, fontWeight: 700,
          }}
        >
          ←
        </button>
      )}
      renderNextButton={(onClick, disabled) => (
        <button
          onClick={onClick}
          disabled={disabled}
          style={{
            position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
            zIndex: 10, padding: "8px 16px", background: "#ec4899", color: "#fff",
            border: "none", borderRadius: 20, cursor: disabled ? "default" : "pointer",
            opacity: disabled ? 0.3 : 1, fontWeight: 700,
          }}
        >
          →
        </button>
      )}
    >
      {defaultCards}
    </LoopingSwiper>
  ),
};
