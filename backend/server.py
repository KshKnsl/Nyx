from flask import Flask, request, jsonify
from flask_cors import CORS
from nyx_chat_engine import NyxChatEngine
import os

app = Flask(__name__)

# Configure CORS to allow requests from any origin for Railway deployment
CORS(app, resources={
    r"/*": {
        "origins": ["*"],  # Allow all origins for now, we'll update this after deployment
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Range", "X-Content-Range"]
    }
})

engine = NyxChatEngine()

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_input = data.get("message", "")
        
        if not user_input:
            return jsonify({"error": "Message cannot be empty"}), 400
        
        response = engine.chat(user_input)
        return jsonify({"response": response})
    except Exception as e:
        print(f"Error processing chat request: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/clear-memory', methods=['POST'])
def clear_memory():
    try:
        engine.clear_memory()
        return jsonify({"status": "success", "message": "Conversation memory cleared"})
    except Exception as e:
        print(f"Error clearing memory: {str(e)}")
        return jsonify({"error": "Failed to clear memory"}), 500

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Nyx Chat API is running"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
