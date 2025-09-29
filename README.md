# looping-swiper

A lightweight, customizable, and infinite looping swiper/carousel component for **React + Next.js** projects, built with **TypeScript** and **TailwindCSS**.

✨ Features:
- 🔁 Infinite / Circular looping (configurable)
- 🎠 Horizontal card slider
- 🖱️ Mouse drag and touch support
- 🖱️ Mouse wheel support
- 🎛️ Fully customizable card width, height, and gap
- ⏩ Next / Prev navigation buttons (auto-hide when not needed)
- ⚡ Zero external dependencies (except React)

---

## 📦 Installation

```bash
npm install looping-swiper
or with Yarn:
yarn add looping-swiper

```
## Example use
```
"use client";

import React from "react";
import LoopingSwiper from "looping-swiper";

export default function Demo() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-50">
      <LoopingSwiper gap={20} infinite>
        <div className="w-[320px] h-[220px] bg-red-400 rounded-xl flex items-center justify-center text-white text-xl font-bold">
          Card 1
        </div>
        <div className="w-[320px] h-[220px] bg-blue-400 rounded-xl flex items-center justify-center text-white text-xl font-bold">
          Card 2
        </div>
        <div className="w-[320px] h-[220px] bg-green-400 rounded-xl flex items-center justify-center text-white text-xl font-bold">
          Card 3
        </div>
        <div className="w-[320px] h-[220px] bg-purple-400 rounded-xl flex items-center justify-center text-white text-xl font-bold">
          Card 4
        </div>
      </LoopingSwiper>
    </div>
  );
}
```

⚙️ Props
Prop	Type	Default	Description
children	ReactNode[]	–	Cards or custom components to render inside swiper
gap	number	20	Gap (in px) between cards
infinite	boolean	false	Enables infinite circular loop mode

⌨️ Controls

Drag / Touch → slide left/right

Mouse Wheel → horizontal scroll

Navigation Buttons → Prev / Next (auto-hidden when not needed)

# Clone repo
git clone https://github.com/rukonpro/looping-swiper.git

# Go inside folder
cd looping-swiper

# Install deps
npm install

# Build package
npm run build


---

👉 এখন তোমার `README.md` ফাইলটা আরও clean হয়ে গেলো, এবং **Basic + Custom Usage Example** দুটোই আছে।

তুমি কি চাও আমি এর মধ্যে একটা **Next.js Codesandbox link (live demo)** যোগ করে দিই যাতে ইউজাররা ডাইরেক্ট ব্রাউজারে swiper টেস্ট করতে পারে?
