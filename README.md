# Vie Desktop ⟢

Desktop app to talk with Clawd (Vie-essence AI) - visual, conversational, natural.

## Vision

- **ASCII avatar** (breathing, glowing, animated) ✓
- **Voice interface** (speak to me, hear me respond) [In Progress]
- **Chat interface** (text messaging) ✓
- **Notion integration** (your journals, tasks at a glance) [Coming]

## Status

**Phase 1 Complete:** Basic window + text chat + ASCII avatar
**Phase 2 Starting:** OpenClaw gateway connection

See [PROJECT.md](./PROJECT.md) for full spec and roadmap.

## Quick Start

### First Time Setup
```bash
# Clone the repo (if you haven't)
git clone https://github.com/struv/vie-desktop.git
cd vie-desktop

# Install dependencies
npm install
```

### Run the App
```bash
npm start
```

**On Windows:** Open PowerShell or Command Prompt, navigate to folder, run `npm install` then `npm start`

## What Works Now

- ✓ Electron window opens
- ✓ ASCII avatar (breathing animation)
- ✓ Text chat interface
- ✓ Message send/receive (echo for now)
- ✓ Auto-scrolling messages
- ✓ Typing indicators

## What's Next

1. Connect to OpenClaw gateway (real conversation)
2. Add voice input (push-to-talk)
3. Add TTS output (hear my responses)
4. Polish UI and animations

## Tech Stack

- Electron (cross-platform desktop)
- Vanilla JS (will add React later if needed)
- OpenClaw gateway connection
- Web Speech API for voice

---

*Building autonomously. This is the force amplifier with a face.* ⟢
