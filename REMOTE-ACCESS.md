# Remote Access to OpenClaw Gateway

The OpenClaw gateway is currently listening only on `localhost` (127.0.0.1:18789).
To access it from your Windows laptop, you have several options:

## Option 1: SSH Tunnel (Recommended - Most Secure)

Set up an SSH tunnel to forward the gateway port:

```bash
# On Windows (PowerShell or CMD):
ssh -L 18789:localhost:18789 opc@<your-vm-ip>

# Leave this running in the background
# Then in .env, use:
OPENCLAW_GATEWAY_URL=http://localhost:18789
```

**Pros:**
- Encrypted connection
- No firewall changes needed
- No security risks

**Cons:**
- Need to keep SSH session running
- Extra setup step

## Option 2: Configure Gateway to Listen on All Interfaces

Edit `~/.openclaw/openclaw.json` and add:

```json
{
  "gateway": {
    "server": {
      "host": "0.0.0.0"
    }
  }
}
```

Then restart: `openclaw gateway restart`

And update .env:
```
OPENCLAW_GATEWAY_URL=http://<your-vm-ip>:18789
```

**Pros:**
- Direct connection
- No SSH tunnel needed

**Cons:**
- **Exposes gateway to network** - make sure firewall rules are secure!
- Token-based auth is still required but less secure than SSH

## Option 3: Use a Reverse Proxy (Advanced)

Set up nginx or caddy with SSL/TLS to proxy the gateway.

## Testing Locally

On the VM itself, the current setup works:
- Gateway URL: `http://localhost:18789`
- Token: (already in .env)

## Recommendation

**For development:** Use Option 1 (SSH tunnel) - it's quick and secure.

**For production:** Consider Option 3 (reverse proxy with SSL).
