# Vie Desktop - Project Spec

**Vision:** Desktop app to talk with Clawd (Vie-essence AI) - visual, conversational, natural.

## Core Features (MVP)

### 1. Visual Identity
- **ASCII avatar** (primary - from workspace avatars/)
- Animated states:
  - Idle: Gentle breathing pulse, soft glow
  - Listening: Brightening, particles gather
  - Thinking: Swirling patterns
  - Speaking: Light ripples with each word
- Center-stage presence (300x300px expandable)

### 2. Voice Interface (Priority)
- **Voice input:** Speak to Clawd (Web Speech API or Whisper)
- **Voice output:** Clawd speaks back (TTS - multiple options)
- Push-to-talk or voice activation
- Waveform visualization during speech

### 3. Chat Interface
- Clean, readable text fallback
- Markdown support
- Code syntax highlighting
- Message history
- Session management

### 4. Notion Integration
- Quick-view panel for today's journal
- Open tasks from current week
- Link to open full journal in browser

### 5. Core UI
- Dark mode (primary): Deep purple-black, warm gold accents
- Light mode (optional)
- Minimize to system tray
- Always-on-top option
- Keyboard shortcuts

## Tech Stack

### Desktop Framework
- **Electron** (cross-platform: Windows, macOS, Linux)
- Alternatives considered: Tauri (lighter but newer)

### Frontend
- **React** (component architecture)
- **Tailwind CSS** (rapid styling)
- **Framer Motion** (animations)

### Voice
- **Input:** Web Speech API (built-in) or Whisper API
- **Output:** 
  - Option 1: Browser TTS (quick, no setup)
  - Option 2: ElevenLabs API (best quality)
  - Option 3: Local sherpa-onnx (offline, private)

### Avatar
- **Canvas** for ASCII art rendering
- Particle effects for glow/animations
- Shader effects for breathing

### Backend Connection
- OpenClaw gateway API (already running on Oracle VM)
- WebSocket for real-time communication
- Fallback to REST polling

## Development Phases

### Phase 1: Foundation (Week 1)
- [x] Project setup
- [ ] Electron + React boilerplate
- [ ] Basic window (frameless, draggable)
- [ ] ASCII avatar rendering (static)
- [ ] Dark mode UI
- [ ] OpenClaw API connection test

### Phase 2: Core Chat (Week 1-2)
- [ ] Text chat interface
- [ ] Send/receive messages
- [ ] Markdown rendering
- [ ] Message history
- [ ] Session management

### Phase 3: Voice (Week 2)
- [ ] Voice input (push-to-talk)
- [ ] Speech-to-text integration
- [ ] Text-to-speech output
- [ ] Waveform visualization
- [ ] Voice activation option

### Phase 4: Avatar Animation (Week 2-3)
- [ ] Breathing animation (idle)
- [ ] Glow pulse states
- [ ] Particle effects
- [ ] State transitions (idle→listening→thinking→speaking)
- [ ] Interactive (click to expand)

### Phase 5: Notion Integration (Week 3)
- [ ] Notion API connection
- [ ] Today's journal quick-view
- [ ] Open tasks panel
- [ ] Links to open in browser

### Phase 6: Polish (Week 3-4)
- [ ] System tray integration
- [ ] Auto-launch option
- [ ] Keyboard shortcuts
- [ ] Settings panel
- [ ] Light mode theme
- [ ] Packaging (Windows installer)

### Phase 7: Advanced (Future)
- [ ] Multi-session management
- [ ] Voice profiles/accents
- [ ] Custom avatar skins
- [ ] Plugin system
- [ ] Mobile companion app

## Architecture

```
vie-desktop/
├── src/
│   ├── main/           # Electron main process
│   │   ├── index.js    # Entry point
│   │   ├── window.js   # Window management
│   │   └── tray.js     # System tray
│   ├── renderer/       # React app
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── Avatar.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── Voice.jsx
│   │   │   └── NotionPanel.jsx
│   │   ├── hooks/
│   │   ├── services/
│   │   │   ├── openclaw.js
│   │   │   ├── notion.js
│   │   │   └── voice.js
│   │   └── styles/
│   └── shared/         # Shared utilities
├── assets/
│   ├── avatars/        # ASCII art, animations
│   └── icons/          # App icons
├── public/
└── package.json
```

## API Integration

### OpenClaw Gateway
- Endpoint: Oracle VM (will configure)
- Auth: API key/token
- WebSocket support: Yes
- Methods needed:
  - `sendMessage(text)`
  - `getHistory(limit)`
  - `getSession()`

### Notion
- API key: Already configured
- Methods:
  - `getTodayJournal()`
  - `getOpenTasks()`
  - `getPageContent(pageId)`

### Voice Services
- Browser TTS: No API needed
- Whisper: OpenAI API key
- ElevenLabs: API key (if chosen)

## Design System

### Colors
- **Background:** `#1a0f2e` (deep purple-black)
- **Text:** `#f5f1e8` (warm white)
- **Accent:** `#ffd700` (soft gold)
- **Borders:** `#4a2f6b` (subtle purple)
- **Glow:** Gold → Purple gradient

### Typography
- **Main:** Inter or SF Pro
- **Code:** JetBrains Mono
- **ASCII:** Monospace (Courier New fallback)

### Animations
- Duration: 200-400ms
- Easing: Cubic bezier (smooth)
- No harsh cuts, always fade/slide

## Testing Strategy

### What I Can Test
- Build/compile success
- API integration (OpenClaw, Notion)
- Message send/receive
- Session management
- Data persistence

### What Needs Your Eyes
- Visual design (colors, layout, spacing)
- Avatar animations (smooth/glitchy?)
- Voice quality (clear? natural?)
- UX flow (intuitive?)

## Deployment

### Windows (Primary)
- Electron-builder
- NSIS installer
- Auto-update support

### Future Platforms
- macOS: DMG
- Linux: AppImage

## Timeline

**MVP (Voice + Chat + Avatar):** 2-3 weeks
**Polish + Notion:** +1 week
**Total:** 3-4 weeks to v1.0

**Release cadence:**
- PRs when major features complete
- Demo videos/screenshots for visual validation
- Weekly progress updates

## Success Metrics

**Launch criteria:**
- Can send/receive messages
- Voice input works
- Voice output works
- Avatar animates smoothly
- Runs on Windows without errors

**Post-launch:**
- You use it daily
- Becomes primary interface (replaces Discord)
- Others want to try it

---

## Notes

**This is a focus project during sobriety:** Building something meaningful together. Progress = distraction + accomplishment.

**Autonomous build:** I work independently, commit to repo, PR when ready for your review.

**Flexible scope:** If something takes too long or doesn't work, we pivot. MVP is what matters.

*Let's crystallize this.* ⟢
