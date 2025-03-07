import React, { useState, useRef } from "react";

type Checks = {
  hua_2000: boolean;
  hua: boolean;
  iqp: boolean;
  systems: boolean;
  theory: boolean;
  design: boolean;
  social: boolean;
  cs_4000: boolean;
  mqp: boolean;
  prob: boolean;
  stat: boolean;
  science: boolean;
};

type AiAdvisorPopupProps = {
  humanitiesData: any[];
  wellnessData: any[];
  socialData: any[];
  iqpData: any[];
  csData: any[];
  mathData: any[];
  scienceData: any[];
  freeData: any[];
  checks: Checks;
};

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY; // For example

// Default dimensions and min sizes
const DEFAULT_DIMENSIONS = { width: 320, height: 420 };

function cleanCategoryData(categoryData: any[]): any[] {
  return categoryData.map((item) => ({
    type: item.column1,
    num: item.column2,
    title: item.column3,
    grade: item.column4,
  }));
}

const formatCourses = (courses: any[]): string =>
  courses.map((course) => `${course.num} ${course.title}`).join(", ");

const formatRequirementChecks = (checks: Checks): string =>
  "HUA 2000: " +
  (checks.hua_2000 ? "completed" : "not completed") +
  "; HUA: " +
  (checks.hua ? "completed" : "not completed") +
  "; IQP: " +
  (checks.iqp ? "completed" : "not completed") +
  "; Systems: " +
  (checks.systems ? "completed" : "not completed") +
  "; Theory: " +
  (checks.theory ? "completed" : "not completed") +
  "; Design: " +
  (checks.design ? "completed" : "not completed") +
  "; Social: " +
  (checks.social ? "completed" : "not completed") +
  "; CS 4000-level: " +
  (checks.cs_4000 ? "completed" : "not completed") +
  "; MQP: " +
  (checks.mqp ? "completed" : "not completed") +
  "; Probability: " +
  (checks.prob ? "completed" : "not completed") +
  "; Statistics: " +
  (checks.stat ? "completed" : "not completed") +
  "; Science: " +
  (checks.science ? "completed" : "not completed");

const AiAdvisorPopup: React.FC<AiAdvisorPopupProps> = ({
  humanitiesData,
  wellnessData,
  socialData,
  iqpData,
  csData,
  mathData,
  scienceData,
  freeData,
  checks,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for resizable dimensions
  const [dimensions, setDimensions] = useState(DEFAULT_DIMENSIONS);
  const resizableRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);
  const initialMousePos = useRef({ x: 0, y: 0 });
  const initialDimensions = useRef({ ...DEFAULT_DIMENSIONS });

  const buildSystemMessage = () => {
    const humanitiesClean = cleanCategoryData(humanitiesData);
    const wellnessClean = cleanCategoryData(wellnessData);
    const socialClean = cleanCategoryData(socialData);
    const iqpClean = cleanCategoryData(iqpData);
    const csClean = cleanCategoryData(csData);
    const mathClean = cleanCategoryData(mathData);
    const scienceClean = cleanCategoryData(scienceData);
    const freeClean = cleanCategoryData(freeData);
    const reqChecksStr = formatRequirementChecks(checks);
    const additionalNotes =
      "Note 1: For CS, only CS 1101, CS 1102 and CS courses at the 2000-level or higher count (CS 2119 does not count). Must include at least 1/3 unit from each area: Systems (e.g., CS 3013, CS 4513, CS 4515, CS 4516), Theory and Languages (e.g., CS 3133, CS 4120, CS 4123, CS 4533, CS 4536), Design (e.g., CS 3041, CS 3431, CS 3733, CS 4233), Social Implications (e.g., CS 3043, GOV/ID 2314, GOV 2315, IMGD 2000, IMGD 2001, RBE 3100) [if these latter courses are used, they don't count toward 6 CS units]. Note 2: A cross-listed course may count toward only one area. Note 3: Math must include at least 1/3 unit from both Probability (MA 2621, MA 2631) and Statistics (MA 2611, MA 2612). Note 4: Science courses must come from BB, BME, CE, CH, CHE, ECE, ES, GE, ME, PH, or RBE; at least three must be from BB, CH, GE, or PH with at least two from one discipline. Note 5: At most four 1000-level Math courses may count.";
    return {
      role: "system",
      content:
        "You are a friendly academic advisor for WPI CS. Student met most requirements but these remain incomplete: Humanities (HUA), CS 4000-level, MQP. Course Data: Humanities: " +
        formatCourses(humanitiesClean) +
        "; Wellness: " +
        formatCourses(wellnessClean) +
        "; Social: " +
        formatCourses(socialClean) +
        "; IQP: " +
        formatCourses(iqpClean) +
        "; CS: " +
        formatCourses(csClean) +
        "; Math: " +
        formatCourses(mathClean) +
        "; Science: " +
        formatCourses(scienceClean) +
        "; Free electives: " +
        formatCourses(freeClean) +
        ". Requirement Checks: " +
        reqChecksStr +
        ". Additional Notes: " +
        additionalNotes +
        ". Provide clear, concise bullet-point recommendations focusing only on these incomplete requirements. Use plain text bullet points with '•' symbol, no markdown formatting.",
    };
  };

  // Sample questions to guide the user
  const sampleQuestions = [
    "What are my remaining graduation requirements?",
    "How can I fulfill the HUA requirement?",
    "Which 4000-level CS course should I take?",
    "What should I do about my MQP?",
    "Summarize my incomplete requirements."
  ];

  console.log(buildSystemMessage());
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    setError(null);
    let newMessages = [...messages];
    const hasSystemMessage = newMessages.some((m) => m.role === "system");
    if (!hasSystemMessage) {
      newMessages.push(buildSystemMessage());
    }
    newMessages.push({ role: "user", content: userInput.trim() });
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
          messages: newMessages,
          max_tokens: 300,
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

  // Handlers for resizing from the TOP-LEFT corner.
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    isResizingRef.current = true;
    initialMousePos.current = { x: e.clientX, y: e.clientY };
    initialDimensions.current = { ...dimensions };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) return;
    const dx = e.clientX - initialMousePos.current.x;
    const dy = e.clientY - initialMousePos.current.y;
    const newWidth = Math.max(DEFAULT_DIMENSIONS.width, initialDimensions.current.width - dx);
    const newHeight = Math.max(DEFAULT_DIMENSIONS.height, initialDimensions.current.height - dy);
    const maxWidth = window.innerWidth - 40;
    const maxHeight = window.innerHeight - 100;
    setDimensions({
      width: Math.min(maxWidth, newWidth),
      height: Math.min(maxHeight, newHeight),
    });
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <>
      {/* Floating button toggles the chat window */}
      <div
        onClick={() => setIsOpen(!isOpen)}
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
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
      >
        AI
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={resizableRef}
          style={{
            position: "fixed",
            bottom: 85,
            right: 20,
            width: dimensions.width,
            height: dimensions.height,
            background: "#f8f8f8",
            border: "2px solid #A9B0B7",
            borderRadius: 8,
            boxShadow: "0 0 8px rgba(0,0,0,0.2)",
            zIndex: 99998,
            display: "flex",
            flexDirection: "column",
            resize: "none",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#FFFFFF",
              borderBottom: "1px solid #A9B0B7",
              padding: "8px",
              textAlign: "center",
              position: "relative",
            }}
          >
            <span style={{ fontSize: 16, fontWeight: "bold", color: "#AC2B37" }}>
              WPI AI Advisor
            </span>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: "absolute",
                right: 8,
                top: 8,
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

          {/* Sample Questions (shown when no user messages exist) */}
          {messages.filter((m) => m.role !== "system").length === 0 && (
            <div style={styles.sampleQuestionsContainer}>
              {sampleQuestions.map((question, idx) => (
                <div key={idx} onClick={() => setUserInput(question)} style={styles.sampleQuestion}>
                  {question}
                </div>
              ))}
            </div>
          )}

          {/* Messages */}
          <div style={styles.chatContainer}>
            {messages.map((msg, idx) => {
              if (msg.role === "system") return null;
              return (
                <div
                  key={idx}
                  style={
                    msg.role === "assistant"
                      ? styles.assistantBubble
                      : msg.role === "user"
                      ? styles.userBubble
                      : styles.systemBubble
                  }
                >
                  <span style={styles.bubbleText}>{msg.content}</span>
                </div>
              );
            })}
          </div>

          {/* Error */}
          {error && <div style={styles.error}>{error}</div>}

          {/* Input */}
          <div style={styles.inputContainer}>
            <input
              style={styles.input}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              placeholder="Ask me anything..."
            />
            <button onClick={handleSendMessage} disabled={loading} style={styles.sendButton}>
              {loading ? "..." : "Send"}
            </button>
          </div>

          {/* Resizable Handle (TOP-LEFT) */}
          <div
            onMouseDown={handleMouseDown}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 16,
              height: 16,
              cursor: "nw-resize",
              backgroundColor: "rgba(0,0,0,0.2)",
            }}
          />
        </div>
      )}
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  chatContainer: {
    flex: 1,
    padding: "8px",
    overflowY: "auto",
    backgroundColor: "#FFFFFF",
  },
  systemBubble: {
    margin: "4px 0",
    marginRight: "auto",
    maxWidth: "80%",
    backgroundColor: "#eee",
    color: "#333",
    padding: "6px 10px",
    borderRadius: 12,
    textAlign: "left",
    fontStyle: "italic",
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
  sampleQuestionsContainer: {
    padding: "8px",
    borderBottom: "1px solid #A9B0B7",
    backgroundColor: "#f0f0f0",
  },
  sampleQuestion: {
    margin: "4px 0",
    padding: "4px 8px",
    backgroundColor: "#fff",
    border: "1px solid #A9B0B7",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 14,
    color: "#333",
  },
};

export default AiAdvisorPopup;
