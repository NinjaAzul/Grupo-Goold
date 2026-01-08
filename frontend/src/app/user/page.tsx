'use client';

import { useAuth } from '@/contexts/AuthContext';
import { withUserAuth } from '@/hocs/withUserAuth';
import { Button } from '@/components/ui/Button';

function UserPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Área do Usuário</h1>
          <Button variant="secondary" onClick={logout}>
            Sair
          </Button>
        </div>
        <div className="bg-background-white p-6 rounded-lg shadow-lg">
          {user && (
            <div>
              <h2 className="text-xl font-semibold text-primary mb-4">
                Bem-vindo, {user.firstName} {user.lastName}!
              </h2>
              <p className="text-primary">E-mail: {user.email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withUserAuth(UserPage);
