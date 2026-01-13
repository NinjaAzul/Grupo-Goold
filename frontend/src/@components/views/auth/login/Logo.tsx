'use client';
import { LogoIcon } from '@/@components/icons';

interface LoginHeaderProps {
  title?: string;
}

export function Logo({
}: LoginHeaderProps) {
  return (
    <>
    <div className="flex justify-center mb-8">
      <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
        <LogoIcon className="w-10 h-10 text-white" />
      </div>
    </div>

 
  </>
);
}

