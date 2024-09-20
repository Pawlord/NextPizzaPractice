'use client';

import { cn } from '@/shared/lib/utils';
import React from 'react'

// --- Ну тут все понятно я думаю --- 

//Импорт компонентов
import { Container } from './container';
import Image from 'next/image';
import { SearchInput } from './search-input';
import Link from 'next/link';
import { CartButton } from './cart-button';
import { ProfileButton } from './profile-button';
import { AuthModal } from './modals';

interface Props {
    hasCart?: boolean;
    hasSearch?: boolean;
    className?: string;
}

export const Header: React.FC<Props> = ({className, hasSearch=true, hasCart=true}) => {
  const [open, setOpen] = React.useState(false)

  return (
    <header className={cn(' border-b', className)}>
      <Container className='flex items-center justify-between py-8'>
      
        {/* Левая часть */}
        <Link href={'/'}>
          <div className='flex items-center gap-4'>
            <Image src={'/logo.png'} alt={'main-logo'} width={35} height={35} />
            <div>
              <h1 className='text-2xl uppercase font-black'>Next Pizza</h1>
              <p className='text-sm text-gray-400 leading-3'>вкуснее уже некуда</p>
            </div>
          </div>
        </Link>

        {/* Поиск */}
        {
          hasSearch && (
            <div className='mx-10 flex-1'>
              <SearchInput />
            </div>
          )
        }

        {/* Правая часть */}
        <div className="flex items-center gap-3">

            <AuthModal open={open} onClose={() => setOpen(false)} />

            <ProfileButton onClickSignIn={() => setOpen(true)} />

            {/* Корзина */}
            { hasCart && (
              <div>
                <CartButton />
              </div>)
            }

        </div>

      </Container>
    </header>
  )
}