# REFLEX

A browser-based aim trainer with four game modes, built with React and Vite.

## Modes

| Mode | Icon | Description | Score |
|------|------|-------------|-------|
| **Flick** | ⚡ | Single target spawns instantly after each hit — snap to it as fast as you can | Targets hit |
| **Pop** | 🎯 | Up to 3 targets active at once, each disappearing after 1.5s — click before they vanish | Targets hit |
| **Grid Shot** | ⊞ | Targets appear on a fixed 6×4 grid — classic rapid-fire aim training | Targets hit |
| **Track** | 🔄 | Follow a smoothly moving target with your cursor — score is time-on-target | % on target |

## Features

- **Session history** — last 5 runs displayed on the home screen with scores and accuracy
- **Personal bests** — best score per mode shown on each mode card
- **Hit/miss markers** — visual feedback on every click
- **Durations** — 15s, 30s, or 60s per session
- **Accuracy tracking** — per-session accuracy shown in the HUD and results screen
- **Avg reaction time** — tracked for Flick and Grid Shot modes

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Build

```bash
npm run build    # output to dist/
npm run preview  # preview the production build
```

[UI Preview](https://i.ibb.co/cSkh9Tmd/image.png)

## Tech Stack

- [React 19](https://react.dev/)
- [Vite 7](https://vitejs.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
