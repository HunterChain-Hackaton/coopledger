import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import { ThemeProvider } from '@/hooks/useTheme';

export const metadata: Metadata = {
  title: 'CoopLedger — Gouvernance Financière Transparente',
  description: 'Plateforme de gouvernance financière pour les coopératives agricoles togolaises, sécurisée par la blockchain Polygon.',
  keywords: ['coopérative', 'agriculture', 'togo', 'blockchain', 'transparence'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
