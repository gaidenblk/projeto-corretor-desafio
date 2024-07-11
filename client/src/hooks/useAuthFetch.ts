import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const useAuthFetch = () => {
  const { token } = useContext(AuthContext);

  const authFetch = async (url: string, options: RequestInit = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.err.message || "Erro desconhecido.");
    }
    return response.json();
  };

  return authFetch;
};

export default useAuthFetch;
