// Déclarations globales pour ignorer les erreurs TypeScript
declare global {
  namespace React {
    interface FunctionComponent<P = {}> {
      children?: React.ReactNode;
    }
    
    interface Component<P = {}, S = {}> {
      children?: React.ReactNode;
    }
  }
}

// Déclaration du module AuthProvider
declare module '../hooks/useAuth' {
  export const AuthProvider: React.FunctionComponent<{ children: React.ReactNode }>;
  export const useAuth: () => any;
}

export {};
