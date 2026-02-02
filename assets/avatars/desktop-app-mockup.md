# Desktop App UI Concept - Clawd Chat

## Layout Concept (ASCII Mockup)

```
╔════════════════════════════════════════════════════════════════════╗
║  CLAWD ⟢                                    🔲  ▢  ⨯             ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║         ┌───────────────────────────────────────┐                 ║
║         │                                       │                 ║
║         │           ░▒▓█ AVATAR ⟢ █▓▒░         │                 ║
║         │                                       │                 ║
║         │         [Animated presence]           │                 ║
║         │     (breathing, gentle glow)          │                 ║
║         │                                       │                 ║
║         └───────────────────────────────────────┘                 ║
║                                                                    ║
║                        ⟢ Ready to help ⟢                          ║
║                                                                    ║
╠════════════════════════════════════════════════════════════════════╣
║  You: What should I work on today?                                ║
║                                                                    ║
║  Clawd: *Your journal shows 3 open tasks from last week.*         ║
║         Want to knock out the ralph loop setup, or dive into      ║
║         the ASCII art converter? Both would be wins. ⟢            ║
║                                                                    ║
║  ─────────────────────────────────────────────────────────────     ║
║  [Type your message here...]                          [Send] ⟢    ║
╚════════════════════════════════════════════════════════════════════╝
```

## UI Elements

### 1. Avatar Panel (Top Center)
- **Size:** 300x300px
- **Animation states:**
  - Idle: Gentle breathing pulse, subtle glow
  - Listening: Slight brightening, particles gather
  - Thinking: Swirling patterns, increased glow
  - Speaking: Light ripples outward with each word
- **Interaction:** Click to expand full screen, double-click to minimize

### 2. Status Line (Below Avatar)
- One-line status messages:
  - "⟢ Ready to help ⟢"
  - "⟢ Reading your journal..."
  - "⟢ Checking tasks..."
  - "⟢ The force amplifier is online ⟢"

### 3. Chat Area
- Clean, readable font (SF Pro, Inter, or similar)
- Your messages: Right-aligned, subtle background
- My messages: Left-aligned, warm glow on keywords
- Markdown support
- Code syntax highlighting

### 4. Input Bar
- Auto-resize as you type
- Send on Enter, Shift+Enter for new line
- Voice input button (if we add TTS/STT)
- Attach files button

### 5. Sidebar (Optional, toggleable)
- Quick access to:
  - Today's journal
  - Open tasks
  - Recent memories
  - Session history

## Color Scheme

**Dark Mode (Primary):**
- Background: Deep purple-black (#1a0f2e)
- Text: Warm white (#f5f1e8)
- Accent: Soft gold (#ffd700)
- Borders: Subtle purple (#4a2f6b)
- Avatar glow: Gold → Purple gradient

**Light Mode (Alternative):**
- Background: Soft cream (#f9f6f0)
- Text: Deep purple-gray (#2a1f3d)
- Accent: Rich gold (#d4af37)
- Borders: Gentle purple (#b8a8c8)
- Avatar glow: Gold → Cyan gradient

## Animations & Effects

1. **Window Open:** Avatar fades in with expanding glow
2. **Message Receive:** Subtle bounce, glow pulse
3. **Typing Indicator:** Floating particles near avatar
4. **Background:** Very subtle animated starfield or code rain
5. **Transitions:** Smooth, warm, no harsh cuts

## Technical Stack Suggestions

- **Framework:** Electron or Tauri (for desktop)
- **UI:** React + Tailwind CSS
- **Animations:** Framer Motion or Lottie
- **Avatar:** Canvas or Three.js for 3D, or animated SVG
- **Backend:** OpenClaw API integration

## Features

- [x] Real-time chat with Clawd
- [x] Notion journal integration display
- [x] Task quick-view
- [ ] Voice mode (TTS/STT)
- [ ] Proactive notifications (heartbeat alerts)
- [ ] Session summaries
- [ ] Dark/light mode toggle
- [ ] Minimize to system tray
- [ ] Keyboard shortcuts

---

## Next Steps to Build

1. Create basic Electron app shell
2. Integrate OpenClaw API
3. Design and implement avatar (choose from generated images)
4. Build chat interface
5. Add Notion integration
6. Implement animations
7. Polish and deploy

*This would give you a warm, encouraging presence on your desktop - like having a wise, optimistic friend who's always ready to help you crystallize your best self.* ⟢
