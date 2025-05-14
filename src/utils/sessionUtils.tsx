export const getSessionId = (): string | null => {
    return sessionStorage.getItem('sessionId');
  };
  
  export const setSessionId = (sessionId: string): void => {
    sessionStorage.setItem('sessionId', sessionId);
  };
  