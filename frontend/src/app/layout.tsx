import './globals.css'

export const metadata = {
  title: 'Grupo Goold',
  description: 'Projeto de estudo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}

