# Setup Guide - Vie Desktop

## Quick Start (Windows)

### 1. Install Prerequisites
- **Node.js**: Download from https://nodejs.org/ (LTS version)
- **Git**: Download from https://git-scm.com/

### 2. Clone and Install
```bash
# Open PowerShell or Command Prompt
git clone https://github.com/struv/vie-desktop.git
cd vie-desktop
npm install
```

### 3. Configure OpenClaw Connection

**Option A: Use Environment Variables (Recommended for Windows)**

Create a file called `.env` in the project folder:
```
OPENCLAW_GATEWAY_URL=http://YOUR_ORACLE_VM_IP:18789
OPENCLAW_GATEWAY_TOKEN=your_gateway_token_here
```

Replace:
- `YOUR_ORACLE_VM_IP` with the IP of your Oracle VM
- `your_gateway_token_here` with the token from OpenClaw config

**Option B: Set in PowerShell Session**
```powershell
$env:OPENCLAW_GATEWAY_URL="http://YOUR_ORACLE_VM_IP:18789"
$env:OPENCLAW_GATEWAY_TOKEN="your_token"
npm start
```

### 4. Get Your Gateway Token

From your Oracle VM (via SSH):
```bash
# Method 1: Read from config
cat ~/.openclaw/openclaw.json | grep "token"

# Method 2: Use openclaw CLI
openclaw status
```

Look for `gateway.auth.token` value.

### 5. Network Setup

**If gateway is on Oracle VM and you're on Windows laptop:**

The gateway is currently bound to `loopback` (localhost only). You have two options:

**Option A: SSH Tunnel (Secure, Recommended)**
```bash
# From Windows PowerShell/Terminal
ssh -L 18789:localhost:18789 opc@YOUR_ORACLE_VM_IP

# Then use in .env:
OPENCLAW_GATEWAY_URL=http://localhost:18789
```

**Option B: Expose Gateway (Less Secure)**
Modify OpenClaw config to bind to 0.0.0.0 instead of loopback:
```json
{
  "gateway": {
    "bind": "0.0.0.0"
  }
}
```
Then restart: `openclaw gateway restart`

### 6. Run the App
```bash
npm start
```

## Troubleshooting

### "Cannot connect to gateway"
- Check if OpenClaw gateway is running on VM: `openclaw status`
- Verify network connectivity: `ping YOUR_ORACLE_VM_IP`
- Check if port 18789 is open (firewall/security groups)
- Verify gateway token is correct

### "ECONNREFUSED"
- Gateway might not be running
- Wrong IP/port in config
- Firewall blocking connection

### App opens but says "offline mode"
- Gateway URL or token not configured
- Check .env file exists and has correct values
- Try setting env vars in PowerShell directly

## Development Notes

**If you want to work on the code:**
- Edit files in `src/` folder
- Changes take effect after restart (`Ctrl+C` then `npm start`)
- DevTools open automatically in dev mode (F12)

**To build a Windows installer:**
```bash
npm run build
```
Installer will be in `dist/` folder.

---

## Current Features

✓ ASCII avatar with breathing animation
✓ Text chat interface
✓ OpenClaw gateway connection
✓ Auto-scrolling messages
✓ Typing indicators

## Coming Soon

- Voice input (push-to-talk)
- Text-to-speech output
- Notion panel
- System tray integration
