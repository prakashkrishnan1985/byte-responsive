import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of your context state
interface MyWidgetContextType {
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    description: string; 
    setDescription: React.Dispatch<React.SetStateAction<string>>;
    selectedOption: string,
    setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
    widgetId: string;
    setWidgetId: React.Dispatch<React.SetStateAction<string>>;
    uploadImgUrl:string;
    setUploadImgUrl: React.Dispatch<React.SetStateAction<string>>;
    imgConfigPayload:string;
    setImgConfigPayload: React.Dispatch<React.SetStateAction<string>>;
    scriptConfigPayload:string;
    setScriptConfigPayload: React.Dispatch<React.SetStateAction<string>>;
    uploadScriptUrl: string;
    setUploadScriptUrl: React.Dispatch<React.SetStateAction<string>>;
}

// Create the context with a default value (undefined)
const MyWidgetContext = createContext<MyWidgetContextType | undefined>(undefined);

// Define the provider props
interface MyProviderProps {
  children: ReactNode;
}

// Create the provider component
export const MyWidgetProvider: React.FC<MyProviderProps> = ({ children }) => {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [selectedOption, setSelectedOption] = useState<string>('chatWindow');
    const [widgetId, setWidgetId] = useState<string>('');
    const [uploadImgUrl, setUploadImgUrl] = useState<string>('');
    const [imgConfigPayload, setImgConfigPayload] = useState<string>('')
    const [scriptConfigPayload, setScriptConfigPayload] = useState<string>('')
    const [uploadScriptUrl, setUploadScriptUrl] = useState<string>('');

  return (
    <MyWidgetContext.Provider
      value={{
        name,
        setName,
        description,
        setDescription,
        selectedOption,
        setSelectedOption,
        widgetId,
        setWidgetId,
        uploadImgUrl,
        setUploadImgUrl,
        imgConfigPayload,
        setImgConfigPayload,
        scriptConfigPayload,
        setScriptConfigPayload,
        uploadScriptUrl,
        setUploadScriptUrl
      }}
    >
      {children}
    </MyWidgetContext.Provider>
  );
};

// Custom hook to use the context
export const useWidget = (): MyWidgetContextType => {
  const context = useContext(MyWidgetContext);

  if (!context) {
    throw new Error("useWidget must be used within a MyWidgetProvider");
  }

  return context;
};
