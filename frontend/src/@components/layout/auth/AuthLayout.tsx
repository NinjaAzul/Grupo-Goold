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
    <>
      <header className="fixed top-0 left-0 right-0 w-full h-[5.25rem] flex justify-between items-center px-4 sm:px-6 lg:px-10 bg-background z-50 border-b border-border">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <LogoIcon className="w-6 h-6 text-white" />
        </div>

        {buttonText && buttonLink && (
          <Link href={buttonLink}>
            <Button variant="primary" className="w-[157px] px-4 py-2 text-sm">
              {buttonText}
            </Button>
          </Link>
        )}
      </header>
      <div className="min-h-screen bg-background flex items-center justify-center flex-col pt-[5.25rem] p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </>
  );
}

