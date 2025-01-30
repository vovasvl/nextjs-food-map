'use client'
import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('@/components/Map').then((mod) => mod.Map), { ssr: false });

export default DynamicMap;
