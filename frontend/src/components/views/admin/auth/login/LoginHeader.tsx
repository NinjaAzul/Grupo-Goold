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
  if (showRegisterButton) {
    // Layout para usuário comum: logo à esquerda, botão à direita
    return (
      <>
        <div className="flex justify-between items-center mb-8">
          <LogoIcon className="w-8 h-8 text-primary" />
          <Link href="/user/cadastro">
            <Button variant="primary" className="px-4 py-2 text-sm">
              Cadastre-se
            </Button>
          </Link>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-primary text-center mb-6 sm:mb-8">
          {title}
        </h1>
      </>
    );
  }

  // Layout original para admin: logo centralizado
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

