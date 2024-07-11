import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  admin: string | null;
  token: string | null;
  selectedCorrector: string | null;
  setAuth: Dispatch<
    SetStateAction<{
      isAuthenticated: boolean;
      admin: string | null;
      token: string | null;
    }>
  >;
  setSelectedCorrector: Dispatch<SetStateAction<string | null>>;
  logout: () => void;
}

const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  admin: null,
  token: null,
  selectedCorrector: null,
  setAuth: () => {},
  setSelectedCorrector: () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [auth, setAuth] = useState<{
    isAuthenticated: boolean;
    admin: string | null;
    token: string | null;
  }>({
    isAuthenticated: false,
    admin: null,
    token: null,
  });

  const [selectedCorrector, setSelectedCorrector] = useState<string | null>(
    null
  );

  const logout = () => {
    setAuth({ isAuthenticated: false, admin: null, token: null });
    setSelectedCorrector(null);
  };

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        selectedCorrector,
        setAuth,
        setSelectedCorrector,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
