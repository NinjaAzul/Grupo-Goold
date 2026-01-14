'use client';

import { RegisterForm } from './RegisterForm';

export function RegisterView() {
  return (
    <div className="w-full max-w-lg">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary text-center mb-6 sm:mb-8">
        Cadastre-se
      </h1>
      <RegisterForm />
    </div>
  );
}

