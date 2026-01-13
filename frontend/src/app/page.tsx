'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DEFAULT_REDIRECT_PATH } from '@/constants';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace(DEFAULT_REDIRECT_PATH);
  }, [router]); 

  return null;
}

