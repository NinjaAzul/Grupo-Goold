import './globals.css'
import { QueryProvider } from '../providers/QueryProvider'
import { AuthProvider } from '../contexts/AuthContext'
import { PageProvider } from '../contexts/PageContext'

export const metadata = {
  title: 'Grupo Goold',
  description: 'Projeto de estudo',
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <QueryProvider>
          <AuthProvider>
            <PageProvider>{children}</PageProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}

