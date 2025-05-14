import { useRef } from "react";

const Chatform = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;
    inputRef.current.value = "";

    // update chat-history with user message
    setChatHistory((history) => [
      ...history,
      { role: "user", text: userMessage },
    ]);
    
    // Thinking placeholder for bot response
   setTimeout(() =>  setChatHistory((history) => [
    ...history,
    { role: "model", text: "Thinking..." }]), 600);

    // call the function to generate bot's response
    // generateBotResponse([...chatHistory,  { role: "user", text: `Using the details provided above, please address this query: ${userMessage}` }]);
    generateBotResponse([...chatHistory,  { role: "user", text: userMessage }]);
  };

  return (
    <form action="" className="chat-form" onSubmit={handleFormSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Message......"
        className="message-input"
        required
      />
      <button className="material-symbols-rounded">arrow_upward</button>
    </form>
  );
};

export default Chatform;
