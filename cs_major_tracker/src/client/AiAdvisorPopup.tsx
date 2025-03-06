import React, { useState } from "react";

// Provide your OpenAI credentials (in production, use a secure backend):
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

const AiAdvisorPopup: React.FC = () => {
    const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
    const [isOpen, setIsOpen] = useState(false);

    // Chat states
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Sends the user's message to OpenAI, gets a response, and updates the chat.
     */
    const handleSendMessage = async () => {
        if (!userInput.trim()) return;
        setError(null);

        const newMessages = [...messages, { role: "user", content: userInput.trim() }];
        setMessages(newMessages);
        setUserInput("");

        try {
            setLoading(true);

            const response = await fetch(OPENAI_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: newMessages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                    max_tokens: 100,
                    temperature: 0.7,
                }),
            });

            if (!response.ok) {
                throw new Error(`OpenAI API returned error: ${response.statusText}`);
            }

            const data = await response.json();
            const assistantReply = data.choices?.[0]?.message?.content;
            if (!assistantReply) {
                throw new Error("No response from OpenAI");
            }

            setMessages((prev) => [...prev, { role: "assistant", content: assistantReply }]);
        } catch (err: any) {
            console.error("Error calling OpenAI API:", err);
            setError(err?.message || "Error calling OpenAI API");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Bottom-Right Circle */}
            <div
                onClick={() => setIsOpen(true)}
                style={{
                    position: "fixed",
                    right: 20,
                    bottom: 20,
                    width: 55,
                    height: 55,
                    borderRadius: "50%",
                    background: "#AC2B37",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 99999,
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "14px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    transition: "transform 0.2s",
                }}
                // Hover effect
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
            >
                AI
            </div>

            {/* Chat Window in bottom-right corner */}
            {isOpen && (
                <div
                    style={{
                        position: "fixed",
                        bottom: 85, // just above the circle
                        right: 20,
                        width: 320,
                        height: 420,
                        background: "#f8f8f8",
                        border: "2px solid #A9B0B7",
                        borderRadius: 8,
                        boxShadow: "0 0 8px rgba(0,0,0,0.2)",
                        zIndex: 99998,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {/* Header / Title Bar */}
                    <div
                        style={{
                            background: "#FFFFFF",
                            borderBottom: "1px solid #A9B0B7",
                            padding: "8px",
                            textAlign: "center",
                        }}
                    >
                        <span style={{ fontSize: 16, fontWeight: "bold", color: "#AC2B37" }}>
                            WPI AI Advisor
                        </span>
                        {/* Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                float: "right",
                                background: "transparent",
                                color: "#AC2B37",
                                border: `1px solid #AC2B37`,
                                borderRadius: 4,
                                padding: "2px 8px",
                                cursor: "pointer",
                                fontSize: 12,
                                fontWeight: "bold",
                            }}
                        >
                            X
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div style={styles.chatContainer}>
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                style={msg.role === "user" ? styles.userBubble : styles.assistantBubble}
                            >
                                <span style={styles.bubbleText}>{msg.content}</span>
                            </div>
                        ))}
                    </div>

                    {/* Error Display */}
                    {error && <div style={styles.error}>{error}</div>}

                    {/* Input and Send */}
                    <div style={styles.inputContainer}>
                        <input
                            style={styles.input}
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Ask me anything..."
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSendMessage();
                            }}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={loading}
                            style={styles.sendButton}
                        >
                            {loading ? "..." : "Send"}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

/** Inline styles for chat messages, etc. */
const styles: { [key: string]: React.CSSProperties } = {
    chatContainer: {
        flex: 1,
        padding: "8px",
        overflowY: "auto",
        backgroundColor: "#FFFFFF",
    },
    userBubble: {
        margin: "4px 0",
        marginLeft: "auto",
        maxWidth: "80%",
        backgroundColor: "#AC2B37",
        color: "#fff",
        padding: "6px 10px",
        borderRadius: 12,
        textAlign: "left",
    },
    assistantBubble: {
        margin: "4px 0",
        marginRight: "auto",
        maxWidth: "80%",
        backgroundColor: "#A9B0B7",
        color: "#000",
        padding: "6px 10px",
        borderRadius: 12,
        textAlign: "left",
    },
    bubbleText: {
        whiteSpace: "pre-wrap",
        fontSize: 14,
        lineHeight: 1.4,
    },
    error: {
        color: "#AC2B37",
        padding: "4px 8px",
        fontWeight: "bold",
        textAlign: "center",
    },
    inputContainer: {
        display: "flex",
        borderTop: "1px solid #A9B0B7",
        padding: 8,
    },
    input: {
        flex: 1,
        padding: 6,
        border: "1px solid #A9B0B7",
        borderRadius: 4,
        fontSize: 14,
        outline: "none",
    },
    sendButton: {
        marginLeft: 6,
        padding: "6px 12px",
        border: "none",
        borderRadius: 4,
        background: "#AC2B37",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: 14,
    },
};

export default AiAdvisorPopup;
