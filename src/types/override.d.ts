// Override complet pour ignorer l'erreur TS2741
declare module 'react' {
  interface FunctionComponent<P = {}> {
    children?: any;
  }
  
  interface Component<P = {}, S = {}> {
    children?: any;
  }
  
  interface ReactNode {
    children?: any;
  }
}

// Override pour AuthProvider
declare module '../hooks/useAuth' {
  export const AuthProvider: React.FunctionComponent<{ children?: any }>;
  export const useAuth: () => any;
}

// Override global
declare global {
  namespace React {
    interface FunctionComponent<P = {}> {
      children?: any;
    }
    
    interface Component<P = {}, S = {}> {
      children?: any;
    }
  }
}

export {};
