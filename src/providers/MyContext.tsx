import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of your context state
interface MyContextType {
  isTakeInput: boolean;
  setIsTakeInput: React.Dispatch<React.SetStateAction<boolean>>;
  isDescriptionMode: boolean;
  setIsDescriptionMode: React.Dispatch<React.SetStateAction<boolean>>;
  isGoButtonEnable: boolean;
  setIsGoButtonEnable: React.Dispatch<React.SetStateAction<boolean>>;
  messages: any;
  setMessages: React.Dispatch<React.SetStateAction<any>>;
  previewData:any;
  setPreviewData:any;
}

// Create the context with a default value (undefined)
const MyContext = createContext<MyContextType | undefined>(undefined);

// Define the provider props
interface MyProviderProps {
  children: ReactNode;
}

// Create the provider component
export const MyProvider: React.FC<MyProviderProps> = ({ children }) => {
  const [isTakeInput, setIsTakeInput] = useState(false);
  const [isDescriptionMode, setIsDescriptionMode] = useState(false);
  const [isGoButtonEnable, setIsGoButtonEnable] = useState<boolean>(false);
  const [messages, setMessages] = useState<
  { text: string; sender: "user" | "system" }[]
>([]);

const [previewData, setPreviewData] = useState<any>([]);

  return (
    <MyContext.Provider
      value={{
        isTakeInput,
        setIsTakeInput,
        isDescriptionMode,
        setIsDescriptionMode,
        isGoButtonEnable,
        setIsGoButtonEnable,
        messages,
        setMessages,
        previewData,
        setPreviewData
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

// Custom hook to use the context
export const useMyContext = (): MyContextType => {
  const context = useContext(MyContext);

  if (!context) {
    throw new Error("useMyContext must be used within a MyProvider");
  }

  return context;
};
