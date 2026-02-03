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
    this.openclaw = null;
    
    this.init();
  }

  async init() {
    // Get config from main process
    this.config = await window.electronAPI.getConfig();
    
    // Initialize OpenClaw service
    this.openclaw = new OpenClawService(this.config);
    
    // Render initial UI
    this.render();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Test connection to OpenClaw gateway
    const connected = await this.openclaw.testConnection();
    
    if (connected) {
      this.updateStatus('⟢ Connected to OpenClaw ⟢');
    } else if (!this.config.gatewayToken) {
      this.updateStatus('⚠️ Gateway not configured');
    } else {
      this.updateStatus('⟢ Ready (offline mode) ⟢');
    }
    
    // Focus input
    document.getElementById('message-input').focus();
    
    console.log('Vie Desktop initialized');
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
      // Send to OpenClaw via service
      const result = await this.openclaw.sendMessage(message);
      
      if (result.success) {
        this.addMessage('assistant', result.reply);
      } else {
        this.addMessage('assistant', `⚠️ ${result.reply}`);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      this.addMessage('assistant', `⚠️ Unexpected error: ${error.message}`);
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
