import { createContext, useContext, useRef } from "react";

type NavHistoryContextType = {
  push: (path: string) => void;
  pop: () => string | null;
  hasBack: () => boolean;
};

const NavHistoryContext = createContext<NavHistoryContextType | null>(null);

export const NavHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const stackRef = useRef<string[]>([]);

  const push = (path: string) => {
    const stack = stackRef.current;
    if (stack[stack.length - 1] !== path) {
      stack.push(path);
    }
  };

  const pop = () => {
    const stack = stackRef.current;
    if (stack.length > 1) {
      stack.pop(); // Remove current page
      return stack[stack.length - 1]; // Return previous page
    }
    return null;
  };

  const hasBack = () => stackRef.current.length > 1;

  return (
    <NavHistoryContext.Provider value={{ push, pop, hasBack }}>
      {children}
    </NavHistoryContext.Provider>
  );
};

export const useNavHistory = () => {
  const ctx = useContext(NavHistoryContext);
  if (!ctx) throw new Error("useNavHistory must be used inside NavHistoryProvider");
  return ctx;
};
