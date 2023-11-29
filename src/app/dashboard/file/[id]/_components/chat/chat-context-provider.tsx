import { ChangeEvent, ReactNode, useState, createContext } from "react";
import { useMutation } from "@tanstack/react-query";

type StreamResponse = {
  handleSendMessage: () => void;
  handleInputChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
  message: string;
};

export const ChatContext = createContext<StreamResponse>({
  handleSendMessage: () => {},
  handleInputChange: () => {},
  isLoading: false,
  message: "",
});

interface ChatContextProviderProps {
  fileId: string;
  children: ReactNode;
}

export function ChatContextProvider({
  fileId,
  children,
}: ChatContextProviderProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Why i dont use here tRPC ?
  // I want to stream back data from the api
  // and in tRPC there is no way to do it in a good way (accept JSON)
  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch("http://localhost:3000/api/messages", {
        method: "POST",
        body: JSON.stringify({
          fileId,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      return response.body;
    },
  });

  const handleSendMessage = () => sendMessage({ message });
  const handleInputChange = ({ target }: ChangeEvent<HTMLTextAreaElement>) =>
    setMessage(target.value);

  return (
    <ChatContext.Provider
      value={{ message, handleSendMessage, isLoading, handleInputChange }}
    >
      {children}
    </ChatContext.Provider>
  );
}
