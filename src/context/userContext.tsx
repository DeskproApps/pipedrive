import { createContext, useContext, useState } from "react";

import { useDeskproAppEvents, Context } from "@deskpro/app-sdk";

import IDeskproUser from "../types/deskproUser";

const UserContext = createContext<IDeskproUser | null>(null);

export const useUser = () => useContext(UserContext);

export const UserContextProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<IDeskproUser | null>(null);
  useDeskproAppEvents({
    onChange: (c: Context) => {
      const data = c?.data;

      if (data?.user) {
        setUser(data.user);
      }
    },
  });

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
