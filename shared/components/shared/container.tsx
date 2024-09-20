import { cn } from '@/shared/lib/utils';
import React from 'react';

// --- Компонент обертка для остальных элементов, чтобы они оцентровывались ---

interface Props {
  className?: string;
}

export const Container: React.FC<React.PropsWithChildren<Props>> = ({ className, children }) => {
  return <div className={cn('mx-auto max-w-[1280px]', className)}>{children}</div>;
};