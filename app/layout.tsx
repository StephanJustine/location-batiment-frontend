// src/app/layout.tsx
'use client';

import React, { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { theme } from './theme';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { useRouter, usePathname } from 'next/navigation';

// Pages accessibles sans authentification
const PUBLIC_PAGES = [
  '/login',
  '/forgot-password',
  '/reset-password',
  '/register',
];

// function AuthGuard({ children }: { children: React.ReactNode }) {
//   const { isAuthenticated, isLoading } = useAuth();
//   const router = useRouter();
//   const pathname = usePathname();

//   useEffect(() => {
//     if (isLoading) return;

//     const isPublicPage = PUBLIC_PAGES.some(page => pathname.startsWith(page));
//     const isResetPasswordPage = pathname.startsWith('/reset-password/');

//     if (!isAuthenticated && !isPublicPage && !isResetPasswordPage) {
//       router.push('/login');
//     }

//     if (isAuthenticated && (isPublicPage || isResetPasswordPage)) {
//       router.push('/');
//     }
//   }, [isAuthenticated, isLoading, pathname, router]);

//   // Afficher un indicateur de chargement
//   if (isLoading) {
//     return (
//       <div style={{ 
//         display: 'flex', 
//         justifyContent: 'center', 
//         alignItems: 'center', 
//         height: '100vh',
//         fontFamily: 'Arial, sans-serif'
//       }}>
//         <div style={{ textAlign: 'center' }}>
//           <div style={{ 
//             width: 40, 
//             height: 40, 
//             border: '4px solid #f3f3f3',
//             borderTop: '4px solid #1976d2',
//             borderRadius: '50%',
//             animation: 'spin 1s linear infinite',
//             margin: '0 auto 16px'
//           }} />
//           <p>Chargement...</p>
//         </div>
//         <style jsx>{`
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         `}</style>
//       </div>
//     );
//   }

//   const isPublicPage = PUBLIC_PAGES.some(page => pathname.startsWith(page));
//   const isResetPasswordPage = pathname.startsWith('/reset-password/');

//   if (!isAuthenticated && !isPublicPage && !isResetPasswordPage) {
//     return null;
//   }

//   return <>{children}</>;
// }

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    const isPublicPage = PUBLIC_PAGES.some(page => pathname.startsWith(page));
    const isResetPasswordPage = pathname.startsWith('/reset-password/');

    if (!isAuthenticated && !isPublicPage && !isResetPasswordPage) {
      router.push('/login');
    }

    if (isAuthenticated && (isPublicPage || isResetPasswordPage)) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // 🔥 Pas de chargement, retourne directement les enfants
  if (isLoading) return null;

  const isPublicPage = PUBLIC_PAGES.some(page => pathname.startsWith(page));
  const isResetPasswordPage = pathname.startsWith('/reset-password/');

  if (!isAuthenticated && !isPublicPage && !isResetPasswordPage) {
    return null;
  }

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
              <AuthGuard>
                {children}
              </AuthGuard>
            </AuthProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}