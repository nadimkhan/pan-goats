import React, { createContext, useReducer } from "react";

interface State {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

interface User {
  email: string;
  role: string;
}

interface Action {
  type: "LOGIN" | "LOGOUT";
  payload?: any;
}

const initialState: State = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const AuthContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

const authReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    default:
      return state;
  }
};

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
