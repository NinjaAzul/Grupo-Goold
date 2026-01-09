'use client';

import { Toaster } from 'react-hot-toast';

export function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#000000',
          color: '#FFFFFF',
          fontFamily: 'Montserrat, sans-serif',
        },
        success: {
          iconTheme: {
            primary: '#FFFFFF',
            secondary: '#000000',
          },
        },
        error: {
          iconTheme: {
            primary: '#FFFFFF',
            secondary: '#000000',
          },
        },
      }}
    />
  );
}

