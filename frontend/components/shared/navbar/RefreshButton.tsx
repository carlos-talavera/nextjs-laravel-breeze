"use client"

import { revalidate } from '@/lib/actions/revalidate.action';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const RefreshButton = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const pathname = usePathname();

  return (
    <ArrowPathIcon
      className={`text-slate600_light900 size-[18px] cursor-pointer ${isRefreshing && "animate-spin"}`}
      onClick={async () => {
        setIsRefreshing(true);
        await revalidate(pathname);
        setTimeout(() => setIsRefreshing(false), 1000);
      }}
    />
  );
}

export default RefreshButton