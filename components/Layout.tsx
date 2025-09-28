'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthService } from '@/lib/auth';
import { Retailer } from '@/lib/supabase';
import Navbar from './Navbar';
import ChatWidget from './ChatWidget';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [user, setUser] = useState<Retailer | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = AuthService.getCurrentUser();
      
      if (!currentUser && pathname !== '/login') {
        router.push('/login');
        return;
      }

      if (currentUser && pathname === '/login') {
        router.push('/dashboard');
        return;
      }

      setUser(currentUser);
      setLoading(false);
    };

    checkAuth();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-buynestt-gradient flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-buynestt-gold"></div>
      </div>
    );
  }

  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <main className="pt-16">
        {children}
      </main>
      <ChatWidget />
    </div>
  );
}