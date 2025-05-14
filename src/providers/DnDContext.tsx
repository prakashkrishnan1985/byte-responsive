import { createContext, useContext, useState, ReactNode } from 'react';

interface DnDContextType {
  type: string | null;
  setType: React.Dispatch<React.SetStateAction<string | null>>;
  nodeData: Record<string, any>;
  setNodeData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  allNodeData: any;
  setAllNodeData: React.Dispatch<React.SetStateAction<Record<any, any>>>;
}

const DnDContext = createContext<DnDContextType | undefined>(undefined);

interface DnDProviderProps {
  children: ReactNode;
}

export const DnDProvider = ({ children }: DnDProviderProps) => {
  const [type, setType] = useState<string | null>(null);
  const [nodeData, setNodeData] = useState<Record<string, any>>({});
  const [allNodeData, setAllNodeData] = useState<Record<string, any>>([]);
  return (
    <DnDContext.Provider value={{ type, setType, nodeData, setNodeData, allNodeData, setAllNodeData}}>
      {children}
    </DnDContext.Provider>
  );
};

export default DnDContext;

export const useDnD = (): DnDContextType => {
  const context = useContext(DnDContext);
  if (!context) {
    throw new Error('useDnD must be used within a DnDProvider');
  }
  return context;
};
