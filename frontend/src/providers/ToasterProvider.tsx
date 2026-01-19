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
          style: {
            background: '#DC2626',
            color: '#FFFFFF',
            fontFamily: 'Montserrat, sans-serif',
            border: '1px solid #B91C1C',
          },
          iconTheme: {
            primary: '#FFFFFF',
            secondary: '#DC2626',
          },
        },
      }}
    />
  );
}

