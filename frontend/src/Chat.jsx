import { useState } from "react";
import axios from "axios";

// Automatically determine the API URL based on the current environment
const API_URL = import.meta.env.PROD 
  ? window.location.origin.replace('://nt-', '://nt-api-')  // Production: Replace frontend URL prefix with backend
  : "http://localhost:5000";  // Development

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "You", text: input };
    setMessages([...messages, userMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat`, {
        message: input,
      });

      const botMessage = { sender: "Nyx", text: response.data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [...prev, { 
        sender: "Nyx", 
        text: "Error fetching response. Please try again later." 
      }]);
    } finally {
      setIsLoading(false);
    }

    setInput("");
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-800 text-white p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-center mb-4">Nyx Chat</h2>
      <div className="h-64 overflow-y-auto border border-gray-600 p-2 rounded-md mb-4">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 p-2 rounded-md ${msg.sender === "You" ? "bg-blue-500" : "bg-green-500"}`}>
            <strong>{msg.sender}: </strong>{msg.text}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          className="flex-1 p-2 border rounded-md text-black"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="ml-2 bg-blue-600 px-4 py-2 rounded-md text-white" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
