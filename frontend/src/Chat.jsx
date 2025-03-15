import { useState } from "react";
import axios from "axios";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "You", text: input };
    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post("http://127.0.0.1:5000/chat", {
        message: input,
      });

      const botMessage = { sender: "Nyx", text: response.data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: "Nyx", text: "Error fetching response" }]);
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
