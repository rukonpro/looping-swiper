# looping-swiper

A lightweight, themeable, infinite-looping swiper/carousel for **React**. 25 built-in themes, CSS Variables, zero dependencies.

## Features

- 25 built-in themes (dark, neon, glass, cyberpunk, brutalist, and more)
- Infinite / circular looping
- Mouse drag & touch swipe
- Mouse wheel scrolling
- Navigation arrows (prev / next)
- Pagination dots
- Autoplay with pause-on-hover
- Keyboard navigation (arrow keys)
- Fully accessible (ARIA roles & labels)
- Responsive — adapts to container width
- Custom navigation button rendering
- Custom themes via CSS Variables
- Compound components for advanced usage
- Custom hooks for headless usage
- Tree-shakeable (ESM + CJS)
- Works with Next.js, Remix, Vite, CRA, etc.

## Installation

```bash
npm install looping-swiper
```

## Quick Start

```tsx
import { LoopingSwiper } from "looping-swiper";
import "looping-swiper/styles.css";
import "looping-swiper/themes/dark.css";

export default function Demo() {
  return (
    <LoopingSwiper theme="dark" gap={20} infinite showDots>
      <div style={{ width: 320, height: 220, background: "#ef4444", borderRadius: 12 }}>
        Card 1
      </div>
      <div style={{ width: 320, height: 220, background: "#3b82f6", borderRadius: 12 }}>
        Card 2
      </div>
      <div style={{ width: 320, height: 220, background: "#22c55e", borderRadius: 12 }}>
        Card 3
      </div>
    </LoopingSwiper>
  );
}
```

## Themes

25 built-in themes. Import only what you need, or import all at once:

```tsx
// Single theme
import "looping-swiper/styles.css";
import "looping-swiper/themes/neon.css";

// All themes (for runtime switching)
import "looping-swiper/styles.css";
import "looping-swiper/themes.css";
```

| Theme | Style |
| --- | --- |
| `light` | Default — dark buttons on transparent bg |
| `dark` | White translucent on near-black |
| `midnight` | Deep navy, soft blue accents |
| `ocean` | Teal/cyan palette |
| `sunset` | Warm orange-to-pink |
| `forest` | Deep green, emerald accents |
| `lavender` | Soft purple, lilac bg |
| `rose` | Pink accents, romantic |
| `slate` | Cool gray, corporate |
| `ember` | Dark bg, bright orange glow |
| `arctic` | Near-white, ice-blue accents |
| `neon` | Black bg, electric green glow |
| `pastel` | Soft muted pastels |
| `monochrome` | Pure black/white, square dots |
| `cyberpunk` | Dark purple, magenta + cyan |
| `retro` | Cream bg, brown/amber, vintage |
| `minimal` | Near-invisible, whisper-quiet |
| `glass` | Backdrop blur, frosted glass |
| `brutalist` | Thick borders, square, no transitions |
| `candy` | Bright pink + yellow, bubbly |
| `earth` | Terracotta + sand |
| `sapphire` | Deep blue, regal |
| `copper` | Bronze accents, metallic |
| `aurora` | Dark bg, green/purple glow |
| `storm` | Dark slate, silver, moody |

### Custom Theme

Override CSS Variables in your own CSS:

```css
[data-swiper-theme="my-brand"] {
  --ls-nav-bg: #1a73e8;
  --ls-nav-bg-hover: #1557b0;
  --ls-dot-bg-active: #1a73e8;
  --ls-bg: #f0f4ff;
  --ls-border-radius: 16px;
}
```

```tsx
<LoopingSwiper theme="my-brand" infinite showDots>
  {cards}
</LoopingSwiper>
```

Or override inline:

```tsx
<LoopingSwiper
  style={{ "--ls-nav-bg": "red", "--ls-dot-bg-active": "blue" } as React.CSSProperties}
>
  {cards}
</LoopingSwiper>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode[]` | — | Cards/components to render |
| `theme` | `SwiperTheme \| string` | `"light"` | Visual theme name |
| `gap` | `number` | `20` | Gap between cards (px) |
| `infinite` | `boolean` | `false` | Enable infinite circular looping |
| `showNavigation` | `boolean` | `true` | Show prev/next arrows |
| `showDots` | `boolean` | `false` | Show pagination dots |
| `autoplay` | `boolean` | `false` | Enable autoplay |
| `autoplayInterval` | `number` | `3000` | Autoplay interval (ms) |
| `pauseOnHover` | `boolean` | `true` | Pause autoplay on hover |
| `keyboardNavigation` | `boolean` | `true` | Arrow key navigation |
| `dragThreshold` | `number` | `50` | Min drag distance to trigger slide |
| `transitionDuration` | `number` | `300` | Transition duration (ms) |
| `onSlideChange` | `(index: number) => void` | — | Slide change callback |
| `className` | `string` | — | Custom container class |
| `style` | `CSSProperties` | — | Custom container styles |
| `renderPrevButton` | `(onClick, disabled) => ReactNode` | — | Custom prev button |
| `renderNextButton` | `(onClick, disabled) => ReactNode` | — | Custom next button |

## CSS Variables

All visual properties can be overridden via CSS Variables:

| Variable | Description | Default |
| --- | --- | --- |
| `--ls-bg` | Container background | `transparent` |
| `--ls-border-radius` | Container border radius | `0` |
| `--ls-padding` | Container padding | `0` |
| `--ls-shadow` | Container box shadow | `none` |
| `--ls-border` | Container border | `none` |
| `--ls-nav-size` | Nav button size | `36px` |
| `--ls-nav-bg` | Nav button background | `rgba(0,0,0,0.45)` |
| `--ls-nav-bg-hover` | Nav button hover bg | `rgba(0,0,0,0.7)` |
| `--ls-nav-color` | Nav button color | `#ffffff` |
| `--ls-nav-border-radius` | Nav button radius | `50%` |
| `--ls-dot-size` | Dot size | `8px` |
| `--ls-dot-active-width` | Active dot width | `24px` |
| `--ls-dot-bg` | Dot background | `rgba(0,0,0,0.25)` |
| `--ls-dot-bg-active` | Active dot bg | `rgba(0,0,0,0.8)` |

## Examples

### Autoplay Carousel

```tsx
<LoopingSwiper theme="sunset" infinite autoplay autoplayInterval={2000} showDots>
  {cards}
</LoopingSwiper>
```

### Custom Navigation Buttons

```tsx
<LoopingSwiper
  infinite
  renderPrevButton={(onClick, disabled) => (
    <button onClick={onClick} disabled={disabled}>← Back</button>
  )}
  renderNextButton={(onClick, disabled) => (
    <button onClick={onClick} disabled={disabled}>Next →</button>
  )}
>
  {cards}
</LoopingSwiper>
```

### Hooks (Headless Usage)

```tsx
import { useSwiper, useDrag, useResponsiveLayout } from "looping-swiper";

// Build your own UI using only the logic hooks
```

## Controls

| Input | Action |
| --- | --- |
| Drag / Touch | Slide left or right |
| Mouse Wheel | Scroll through slides |
| Arrow Keys | Navigate when focused |
| Nav Buttons | Click prev / next |
| Dots | Jump to specific slide |

## Development

```bash
git clone https://github.com/rukonpro/looping-swiper.git
cd looping-swiper
npm install
npm run build          # Build the package
npm run storybook      # Launch Storybook dev server
```

## License

MIT
