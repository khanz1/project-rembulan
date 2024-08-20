import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';

export interface GoogleLoginProviderProps {
  children: React.ReactNode;
}

export const GoogleLoginProvider = ({ children }: GoogleLoginProviderProps) => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
};
