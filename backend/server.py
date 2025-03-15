from flask import Flask, request, jsonify
from flask_cors import CORS
from nyx_chat_engine import NyxChatEngine

app = Flask(__name__)
CORS(app)  # Allow frontend to connect

engine = NyxChatEngine()

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_input = data.get("message", "")
    
    if not user_input:
        return jsonify({"error": "Message cannot be empty"}), 400
    
    response = engine.chat(user_input)
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)
