'use client';

import { LogoIcon } from '@/@components/icons';
import { Button } from '@/@components/ui/Button';
import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
  buttonText?: string;
  buttonLink?: string;
}

export function AuthLayout({
  children,
  buttonText,
  buttonLink,
}: AuthLayoutProps) {
  return (
    <div className="h-screen bg-background flex flex-col">
      <header className="w-full h-[5.25rem] flex justify-between items-center px-4 sm:px-6 lg:px-10 bg-background border-b border-border shadow-sm flex-shrink-0">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
          <LogoIcon className="w-6 h-6 text-white" />
        </div>

        {buttonText && buttonLink && (
          <Link href={buttonLink} className="flex-shrink-0">
            <Button variant="primary" className="w-auto min-w-[100px] sm:min-w-[120px] sm:w-[157px] px-3 sm:px-4 py-4 text-xs sm:text-sm whitespace-nowrap">
              {buttonText}
            </Button>
          </Link>
        )}
      </header>
      <div className="flex-1 bg-background overflow-y-auto" style={{ minHeight: 0 }}>
        <div className="flex items-start justify-center min-h-full pb-8 p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-lg mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

