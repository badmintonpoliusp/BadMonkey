import {createContext, use, useContext, useState,useEffect} from "react";

import {Models, ID} from "react-native-appwrite";
import {account} from "./appwrite";

type AuthContextType = {
    user: Models.User<Models.Preferences> | null;
    isloadingUser: boolean;
    signUp: (email: string, password: string) => Promise<string | null>;
    signIn: (email: string, password: string) => Promise<string | null>;
    signOut?: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({children} :{children: React.ReactNode}) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  
  const [isloadingUser, setIsLoadingUser] = useState<boolean>(true);

  useEffect(() => {
    getUser();
  },[]);

  const getUser = async () => {
    try {
      const session = await account.get();
      setUser(session);
      } catch (error) {
      setUser(null);
      }finally {
      setIsLoadingUser(false);
    }
    }



  const signUp = async (email: string, password: string) => {
    try {
      await account.create(ID.unique(), email, password);
      await signIn(email, password);
      return null;
    }catch (error) {
      if (error instanceof Error) {
        return error.message;
    }
    return "Erro ao cadastrar usuário.";
  }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const session = await account.get();
      setUser(session);
      return null;
    }catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
    return "Erro ao entrar.";
    }
  };

  const signOut = async () => {
    try{
      await account.deleteSession("current");
      setUser(null);
    }catch (error) {
      console.error("Erro ao sair:", error);

    }
  };

  return (
    <AuthContext.Provider value={{user, isloadingUser, signUp, signIn, signOut}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth precisa ser usado dentro de AuthProvider");
  }
  return context;
}