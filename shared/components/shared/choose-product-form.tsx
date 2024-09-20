'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import { Title } from './title';
import { Button } from '../ui';

interface Props {
  imageUrl: string;
  name: string;
  items?: any;
  price: number;
  loading?: boolean;
  //(itemId: number, ingredients: number[]) => void;
  onSubmit?: VoidFunction;nSubmit?: VoidFunction;
  className?: string;
}

//Форма выбора ПРОДУКТА

export const ChooseProductForm: React.FC<Props> = ({
    name,
    items,
    imageUrl,
    price,
    loading,
    onSubmit,
    className,
  }) => {

    const textDetails = '30 см, традиционное тесто, 590 г';
    const totalPrice = 350;

    return (
        <div className={cn(className, 'flex flex-1')}>
            <div className={cn('flex items-center justify-center flex-1 relative w-full')}>
                <img
                src={imageUrl}
                alt={name}
                className={cn('relative left-2 top-2 transition-all z-10 duration-300 w-[350px] h-[350px]')}
                />
            </div>

            <div className="w-[490px] bg-[#f7f6f5] p-7">
                <Title text={name} size="md" className="font-extrabold mb-1" />

                <Button
                    loading={loading}
                    onClick={() => onSubmit?.()}
                    className="h-[55px] px-10 text-base rounded-[18px] w-full mt-10">
                    Добавить в корзину за {price} ₽
                </Button>
            </div>
        </div>
    );
};