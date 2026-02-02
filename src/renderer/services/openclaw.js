// OpenClaw Gateway Connection Service

class OpenClawService {
  constructor(config) {
    this.gatewayUrl = config.gatewayUrl || 'http://localhost:18789';
    this.gatewayToken = config.gatewayToken || '';
    this.sessionKey = null;
    this.connected = false;
  }

  /**
   * Test connection to gateway
   */
  async testConnection() {
    try {
      const response = await fetch(`${this.gatewayUrl}/api/status`, {
        headers: {
          'Authorization': `Bearer ${this.gatewayToken}`
        }
      });
      
      if (response.ok) {
        this.connected = true;
        console.log('✓ Connected to OpenClaw gateway');
        return true;
      }
      
      throw new Error(`Gateway returned ${response.status}`);
    } catch (error) {
      console.error('✗ Failed to connect to OpenClaw gateway:', error);
      this.connected = false;
      return false;
    }
  }

  /**
   * Send a message to Clawd and get response
   */
  async sendMessage(message) {
    if (!this.connected) {
      await this.testConnection();
    }

    try {
      // OpenClaw gateway API endpoint for sending messages
      // This will need to match the actual OpenClaw API structure
      const response = await fetch(`${this.gatewayUrl}/api/sessions/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.gatewayToken}`
        },
        body: JSON.stringify({
          message: message,
          sessionKey: this.sessionKey || 'main', // Use main session
          agentId: 'main'
        })
      });

      if (!response.ok) {
        throw new Error(`Gateway error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        reply: data.message || data.response || data.text || 'No response',
        sessionKey: data.sessionKey
      };

    } catch (error) {
      console.error('Error sending message to gateway:', error);
      return {
        success: false,
        error: error.message,
        reply: `Connection error: ${error.message}`
      };
    }
  }

  /**
   * Get session history (for loading previous conversation)
   */
  async getHistory(limit = 50) {
    try {
      const response = await fetch(
        `${this.gatewayUrl}/api/sessions/history?` + 
        `sessionKey=${this.sessionKey || 'main'}&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${this.gatewayToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get history: ${response.status}`);
      }

      const data = await response.json();
      return data.messages || [];

    } catch (error) {
      console.error('Error getting history:', error);
      return [];
    }
  }
}

// Export for use in app
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OpenClawService;
}
