'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-buynestt-gradient flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-buynestt-gold"></div>
    </div>
  );
}