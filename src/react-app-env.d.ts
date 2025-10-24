/// <reference types="react-scripts" />

declare namespace React {
  interface ReactNode {
    children?: React.ReactNode;
  }
  
  interface FunctionComponent<P = {}> {
    children?: React.ReactNode;
  }
  
  interface Component<P = {}, S = {}> {
    children?: React.ReactNode;
  }
}
