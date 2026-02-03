// OpenClaw Gateway Connection Service
// Uses the OpenResponses API: POST /v1/responses

class OpenClawService {
  constructor(config) {
    this.gatewayUrl = config.gatewayUrl || 'http://localhost:18789';
    this.gatewayToken = config.gatewayToken || '';
    this.connected = false;
  }

  /**
   * Test connection to gateway
   */
  async testConnection() {
    if (!this.gatewayToken) {
      console.log('⚠ No gateway token configured');
      return false;
    }

    try {
      // Simple ping with minimal input
      const response = await fetch(`${this.gatewayUrl}/v1/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.gatewayToken}`,
          'x-openclaw-agent-id': 'main'
        },
        body: JSON.stringify({
          model: 'openclaw',
          input: 'ping'
        })
      });
      
      if (response.ok) {
        this.connected = true;
        console.log('✓ Connected to OpenClaw gateway');
        return true;
      }
      
      const errorText = await response.text();
      throw new Error(`Gateway returned ${response.status}: ${errorText}`);
    } catch (error) {
      console.error('✗ Failed to connect to OpenClaw gateway:', error);
      this.connected = false;
      return false;
    }
  }

  /**
   * Send a message to Clawd and get response
   * Uses OpenResponses API format
   */
  async sendMessage(message) {
    try {
      const response = await fetch(`${this.gatewayUrl}/v1/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.gatewayToken}`,
          'x-openclaw-agent-id': 'main'
        },
        body: JSON.stringify({
          model: 'openclaw',
          input: message
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gateway error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      
      // Parse OpenResponses format
      // Response shape: { output: [{ type: "message", content: [{ type: "output_text", text: "..." }] }] }
      let replyText = 'No response';
      
      if (data.output && data.output.length > 0) {
        const outputItem = data.output[0];
        if (outputItem.content && outputItem.content.length > 0) {
          // Find the first text content part
          const textPart = outputItem.content.find(part => part.type === 'output_text');
          if (textPart && textPart.text) {
            replyText = textPart.text;
          }
        }
      }

      return {
        success: true,
        reply: replyText,
        raw: data
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
   * Send a message with streaming (SSE)
   * Not implemented yet - will add in Phase 3
   */
  async streamMessage(message, onChunk) {
    // TODO: Implement SSE streaming for real-time responses
    throw new Error('Streaming not yet implemented');
  }
}

// Export for use in app
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OpenClawService;
}
