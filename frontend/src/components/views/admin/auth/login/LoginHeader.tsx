'use client';

import { LogoIcon } from '@/components/icons';

interface LoginHeaderProps {
  title?: string;
}

export function LoginHeader({ title = 'Login' }: LoginHeaderProps) {
  return (
    <>
      <div className="flex justify-center mb-8">
        <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
          <LogoIcon className="w-10 h-10 text-white" />
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-primary text-center mb-6 sm:mb-8">
        {title}
      </h1>
    </>
  );
}

