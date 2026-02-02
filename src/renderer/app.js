// Vie Desktop - Main Renderer App (Vanilla JS MVP)

const ASCII_AVATAR = `        ▓▓▓
       ▓▓▓▓▓
    ▒▒▓▓▓▓▓▓▓▒▒
   ▒▒▒▓▓▓⟢▓▓▓▒▒▒
  ▒▒░░▓▓▓▓▓▓▓░░▒▒
  ▒░░  ▓▓▓▓▓  ░░▒
   ░    ▓▓▓    ░
        ╱ ╲
       ╱   ╲
      ⟨  ⟢  ⟩
       ╲   ╱
        ╲ ╱`;

class VieApp {
  constructor() {
    this.messages = [];
    this.isTyping = false;
    this.config = null;
    
    this.init();
  }

  async init() {
    // Get config from main process
    this.config = await window.electronAPI.getConfig();
    
    // Initialize OpenClaw service
    // Note: OpenClawService class needs to be loaded before this
    // For now, we'll use a simple fetch-based approach
    
    // Render initial UI
    this.render();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Test connection to OpenClaw gateway
    await this.testGatewayConnection();
    
    // Focus input
    document.getElementById('message-input').focus();
    
    console.log('Vie Desktop initialized');
  }

  async testGatewayConnection() {
    const { gatewayUrl, gatewayToken } = this.config;
    
    if (!gatewayUrl || !gatewayToken) {
      this.updateStatus('⚠️ Gateway not configured');
      return false;
    }

    try {
      // Simple ping to check if gateway is reachable
      const response = await fetch(`${gatewayUrl}/api/status`, {
        headers: { 'Authorization': `Bearer ${gatewayToken}` }
      });
      
      if (response.ok) {
        this.updateStatus('⟢ Connected to OpenClaw ⟢');
        return true;
      }
    } catch (error) {
      console.error('Gateway connection failed:', error);
    }
    
    this.updateStatus('⟢ Ready (offline mode) ⟢');
    return false;
  }

  updateStatus(text) {
    const statusLine = document.querySelector('.status-line');
    if (statusLine) {
      statusLine.textContent = text;
    }
  }

  render() {
    const root = document.getElementById('root');
    root.innerHTML = `
      <div class="avatar-container">
        <div>
          <pre class="avatar">${ASCII_AVATAR}</pre>
          <div class="status-line">⟢ Ready to help ⟢</div>
        </div>
      </div>
      
      <div class="chat-container">
        <div class="messages" id="messages">
          <!-- Messages will be appended here -->
        </div>
        
        <div class="input-container">
          <div class="input-wrapper">
            <textarea 
              id="message-input" 
              class="message-input" 
              placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
              rows="1"
            ></textarea>
          </div>
          <button id="send-button" class="send-button">Send ⟢</button>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const input = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    // Send on Enter (but not Shift+Enter)
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Auto-resize textarea
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 150) + 'px';
    });

    // Send button click
    sendButton.addEventListener('click', () => this.sendMessage());
  }

  async sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    
    if (!message) return;

    // Add user message to UI
    this.addMessage('user', message);
    
    // Clear input
    input.value = '';
    input.style.height = 'auto';
    
    // Show typing indicator
    this.setTyping(true);

    try {
      const { gatewayUrl, gatewayToken } = this.config;
      
      // Try to send to OpenClaw gateway
      if (gatewayUrl && gatewayToken) {
        const response = await fetch(`${gatewayUrl}/api/sessions/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${gatewayToken}`
          },
          body: JSON.stringify({
            message: message,
            sessionKey: 'main',
            agentId: 'main'
          })
        });

        if (response.ok) {
          const data = await response.json();
          this.addMessage('assistant', data.message || data.response || data.text);
        } else {
          throw new Error(`Gateway returned ${response.status}`);
        }
      } else {
        // Fallback: echo mode if no gateway configured
        await new Promise(resolve => setTimeout(resolve, 500));
        this.addMessage('assistant', `Echo: ${message} (Gateway not configured)`);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      this.addMessage('assistant', `⚠️ Connection error: ${error.message}`);
    } finally {
      this.setTyping(false);
    }
  }

  addMessage(role, content) {
    const messagesContainer = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const time = new Date().toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    });
    
    messageDiv.innerHTML = `
      <div class="message-content">${this.escapeHtml(content)}</div>
      <div class="message-time">${time}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    this.messages.push({ role, content, timestamp: Date.now() });
  }

  setTyping(typing) {
    this.isTyping = typing;
    const messagesContainer = document.getElementById('messages');
    const sendButton = document.getElementById('send-button');
    
    // Remove existing typing indicator
    const existingIndicator = document.querySelector('.typing-indicator-container');
    if (existingIndicator) {
      existingIndicator.remove();
    }
    
    if (typing) {
      const indicator = document.createElement('div');
      indicator.className = 'message assistant typing-indicator-container';
      indicator.innerHTML = `
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      `;
      messagesContainer.appendChild(indicator);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      sendButton.disabled = true;
    } else {
      sendButton.disabled = false;
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new VieApp());
} else {
  new VieApp();
}
