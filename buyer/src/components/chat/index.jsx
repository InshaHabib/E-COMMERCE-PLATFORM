import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send } from "lucide-react";
import { IoCloseSharp } from "react-icons/io5";
import { io } from "socket.io-client"
const socket = io("http://localhost:8000")
export default function Chat() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [inputValue, setInputValue] = useState("")
    const messagesEndRef = useRef(null)
    const id = typeof window !== "undefined" ? localStorage.getItem("id") : null
    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, isOpen])
    useEffect(() => {
        if (!id) return

        socket.emit("join_room", id)

        socket.on("chat_history", (history) => {
            setMessages(history)
        })

        socket.on("receive_message", (data) => {
            setMessages((prevChat) => [...prevChat, data])
        })

        return () => {
            socket.off("chat_history")
            socket.off("receive_message")
        }
    }, [id])
    const handleSendMessage = (e) => {
        e.preventDefault()
        if (inputValue.trim() !== "" && id) {
            socket.emit("send_message", { room: id, user: id, message: inputValue })
            setInputValue("")
        }
    }

    return (
        <div className="fixed bottom-20 right-9 z-[9999999]">
            {/* Chat toggle button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                >
                    <MessageCircle size={24} />
                </button>
            )}

            {/* Chat interface */}
            {isOpen && (
                <div className="bg-white rounded-lg shadow-xl w-80 md:w-96 overflow-hidden flex flex-col">

                    {/* close button */}
                 <div className="flex justify-end  py-3 px-3 gap-3 border-b border-[rgba(0,0,0,0.1)] overflow-hidden">
                    <IoCloseSharp className="text-[20px] cursor-pointer" 
                    onClick={() => setIsOpen(false)}
                    />
                    </div>

                    {/* <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-[-10px] right-[-5px] text-gray-500 hover:text-red-500"
                    >
                        <X size={20} />
                    </button> */}
                    
                    {/* Messages container */}
                    <div className="h-96 overflow-y-auto p-4 bg-white">
                        {messages.map((message, index) => (
                            <div key={index} className={`mb-4 flex ${message.user !== id ? "justify-start" : "justify-end"}`}>
                                {message.isBot && (
                                    <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2 flex-shrink-0">
                                        <MessageCircle size={16} />
                                    </div>
                                )}
                                <div
                                    className={`rounded-lg p-3 max-w-[80%] whitespace-pre-wrap ${message.user !== id ? "bg-[#f1eeff] text-[#333]" : "bg-blue-500 text-white"
                                        }`}
                                >
                                    {message.message}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input form */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                        <div className="relative">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Message....."
                                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}
