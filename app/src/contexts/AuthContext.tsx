import { Auth } from "aws-amplify";
import { createContext, useContext, useEffect, useState } from "react";

interface IContextValue {
  user: any;
  isAuthenticated: boolean;
  auth: any;
}

const initValue = {
  user: null,
  isAuthenticated: false,
  auth: {},
};

const AuthContext = createContext<IContextValue>(initValue);

const Context = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const fetchUser = async () => {
    const user = await Auth.currentUserInfo();
    if (user) {
      setIsAuthenticated(true);
      setUser(user);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const values = {
    user,
    isAuthenticated,
    auth: {
      fetchUser,
    },
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default Context;
