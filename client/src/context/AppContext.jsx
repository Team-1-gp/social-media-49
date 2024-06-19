import { createContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState("You");
  const [posts, setPosts] = useState([]);

  return (
    <AppContext.Provider value={{ user, setUser, posts, setPosts }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
