'use client';

import Link from 'next/link';
import { LogoIcon } from '@/components/icons';
import { Button } from '@/components/ui/Button';

interface LoginHeaderProps {
  title?: string;
  showRegisterButton?: boolean;
}

export function LoginHeader({
  title = 'Login',
  showRegisterButton = false,
}: LoginHeaderProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <LogoIcon className="w-8 h-8 text-primary" />
        {showRegisterButton && (
          <Link href="/user/cadastro">
            <Button variant="primary" className="px-4 py-2 text-sm">
              Cadastre-se
            </Button>
          </Link>
        )}
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-primary text-center mb-6 sm:mb-8">
        {title}
      </h1>
    </>
  );
}

