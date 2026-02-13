export {};

declare global {
  interface Window {
    ezstandalone?: {
      define: (...ids: number[]) => void;
      enable: () => void;
      display: () => void;
      refresh: () => void;
      enabled: boolean;
    };
  }
}
