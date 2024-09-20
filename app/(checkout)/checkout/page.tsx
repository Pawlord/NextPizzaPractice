'use client'

import {useForm, SubmitHandler, FormProvider} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

import { CheckoutSidebar, Container, Title } from "@/shared/components/shared";
import { useCart } from "@/shared/hooks";
import { CheckoutAdressForm, CheckoutCart, CheckoutPersonalForm } from '@/shared/components/shared/checkout';
import { checkoutFormSchema, CheckoutFormValues } from '@/shared/components/shared/checkout/checkout-form-schema';
import { cn } from '@/shared/lib/utils';
import { createOrder } from '@/app/actions';
import toast from 'react-hot-toast';
import React from 'react';


export default function Checkout(){
    const [submiting, setSubmiting] = React.useState(false)
    const {totalAmount, items, updateItemQuantity, removeCartItem, loading} = useCart();


    const onClickCountButton = (id: number, quantity: number, type: 'plus' | 'minus') => {
        const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;
        updateItemQuantity(id, newQuantity);
    }

    const onSubmit = async (data: CheckoutFormValues) => {
        try {
            setSubmiting(true)
            const url = await createOrder(data);

            toast.error('Заказ успешно оформлен! 📝 Переход на оплату... ', {
                icon: '✅',
            });

            if(url){
                location.href = url
            }

        } catch (error) {
            setSubmiting(false)
            console.log(error)
            toast.error('Не удалось создать заказ', {
                icon: '❌',
              });
        }
    }
    
    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutFormSchema),
        defaultValues:{
            email: '',
            firstName: '',
            lastName: '',
            phone: '',
            adress: '',
            comment: '',
        }
    });

    return <Container className="mt-10">
        <Title text="Оформление заказа" className="font-extrabold mb-8 text-[36px]" />
        
        <FormProvider {...form}>
            {/* Для обработки формы используется встроенный в хук провайдер, после чего проверяется валидация формы */}
            {/* С помощью handleSubmit, если валидация прошла успешно, то вызывается уже наша функция onSubmit */}
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex gap-10">
                    {/* Левая сторона */}
                    <div className="flex flex-col gap-10 flex-1 mb-20">
                        <CheckoutCart
                            onClickCountButton={onClickCountButton} 
                            removeCartItem={removeCartItem} 
                            items={items}
                            loading={loading} 
                        />

                        <CheckoutPersonalForm className={cn({'opacity-40 pointer-events-none' : loading})} />

                        <CheckoutAdressForm className={cn({'opacity-40 pointer-events-none' : loading})} />
                    </div>

                    {/* Правая сторона */}
                    <div className="w-[450px]">
                        <CheckoutSidebar loading={loading || submiting}  totalAmount={totalAmount} />
                    </div>
                </div>  
            </form>
        </FormProvider>
    </Container>
}