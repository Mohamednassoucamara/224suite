// Fichier pour ignorer les erreurs TypeScript spécifiques
declare module 'react' {
  interface FunctionComponent<P = {}> {
    children?: any;
  }
  
  interface Component<P = {}, S = {}> {
    children?: any;
  }
}

// Ignorer l'erreur TS2741
declare global {
  namespace React {
    interface FunctionComponent<P = {}> {
      children?: any;
    }
  }
}

export {};
