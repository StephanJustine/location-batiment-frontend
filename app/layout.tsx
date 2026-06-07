// 'use client';
// import { ThemeProvider } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import { AuthProvider } from '@/contexts/AuthContext';
// import { theme } from './theme';
// import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="fr">
//       <body>
//         <AppRouterCacheProvider>
//           <ThemeProvider theme={theme}>
//             <CssBaseline />
//             <AuthProvider>{children}</AuthProvider>
//           </ThemeProvider>
//         </AppRouterCacheProvider>
//       </body>
//     </html>
//   );
// }

'use client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from '@/contexts/AuthContext';
import { theme } from './theme';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('access_token');
    const isPublicPage = pathname === '/login' || pathname === '/forgot-password';
    
    if (!token && !isPublicPage) {
      router.push('/login');
    }
    
    if (token && isPublicPage) {
      router.push('/');
    }
  }, [pathname, router]);
  
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