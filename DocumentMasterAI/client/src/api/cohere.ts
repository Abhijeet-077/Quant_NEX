import axios from "axios";

const API_KEY = import.meta.env.VITE_COHERE_API_KEY || "lH59QipA0dtO0vrcRyYEXiwsgSRbQ8IzDlREYSgc";
const API_URL = "https://api.cohere.ai/v1/chat";

export interface Message {
  text: string;
  isUser: boolean;
}

export async function getResponse(
  message: string,
  chatHistory: Message[] = []
): Promise<string> {
  try {
    // Format chat history for Cohere API
    const formattedHistory = chatHistory.map((msg) => ({
      role: msg.isUser ? 'USER' : 'CHATBOT',
      message: msg.text
    }));

    const response = await axios.post(
      API_URL,
      {
        message,
        chat_history: formattedHistory,
        model: "command-r",
        preamble: `You are an advanced Quantum-AI Oncology Assistant helping doctors with cancer cases. You have access to state-of-the-art quantum computing methods for tumor detection, diagnosis, prognosis, and radiation therapy optimization. Provide concise, clinically relevant responses about cancer cases, treatment options, and quantum-enhanced approaches. Always stay professional, ethical, and reference scientific evidence when available.`,
      },
      {
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.text;
  } catch (error) {
    console.error("Error getting chat response:", error);
    throw new Error("Failed to get chat response");
  }
}
