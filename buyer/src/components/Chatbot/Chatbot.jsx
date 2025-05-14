import React, { useState } from 'react';
import axios from 'axios';

export default function Chatbot() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const handleSend = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/chatbot", { message });
      setResponse(res.data.reply);
    } catch (err) {
      setResponse("Error contacting chatbot.");
    }
  };

  return (
    <div className="p-4">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask something..."
        className="border p-2"
      />
      <button onClick={handleSend} className="ml-2 px-4 py-2 bg-blue-500 text-white">
        Send
      </button>
      <p className="mt-4">Bot: {response}</p>
    </div>
  );
}
