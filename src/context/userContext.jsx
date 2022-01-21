import React, { createContext, useCallback, useContext, useState } from "react";

const DEFAULT_USER_STATE = {
  user: {
    addressHex: "",
    publicKeyHex: "",
    ppk: "",
  },
  updateUser: () => null,
  removeUser: () => null,
};

const UserContext = createContext(DEFAULT_USER_STATE);

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser cannot be used without declaring the provider");
  }

  return context;
}

export function UserContextProvider({ children }) {
  const [user, setUser] = useState({
    addressHex: "",
    publicKeyHex: "",
    ppk: "",
  });

  const updateUser = useCallback((addressHex, publicKeyHex, ppk) => {
    setUser({
      addressHex,
      publicKeyHex,
      ppk,
    });
  }, []);

  const removeUser = useCallback(() => {
    setUser(DEFAULT_USER_STATE);
  }, []);

  return (
    <UserContext.Provider value={{ user, updateUser, removeUser }}>
      {children}
    </UserContext.Provider>
  );
}
