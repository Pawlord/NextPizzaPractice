'use server';

import { prisma } from "@/prisma/prisma-client";
import { PayOrderTemplate } from "@/shared/components/shared";
import { CheckoutFormValues } from "@/shared/components/shared/checkout/checkout-form-schema";
import { VerificationUserTemplate } from "@/shared/components/shared/email-templates/verification-user";
import { sendEmail } from "@/shared/lib";
import { getUserSession } from "@/shared/lib/get-user-session";
import {OrderStatus, Prisma} from '@prisma/client';
import { hashSync } from "bcrypt";
import { cookies } from "next/headers";

export async function createOrder(data: CheckoutFormValues){
    try{
        console.log(data, 'data')

        const cookieStore = cookies();
        const cartToken = cookieStore.get('cartToken')?.value;
        
        if(!cartToken){
            throw new Error('Cart token not found!')
        }
    
         /* Находим корзину по токену */
        const userCart = await prisma.cart.findFirst({
            include: {
            user: true,
            items: {
                include: {
                ingredients: true,
                productItem: {
                    include: {
                    product: true,
                            },
                            },
                        },
                    },
            },
            where: {
            token: cartToken,
            },
        });

        /* Если корзина не найдена возращаем ошибку */
        if (!userCart) {
            throw new Error('Cart not found');
        }
  
        /* Если корзина пустая возращаем ошибку */
        if (userCart?.totalAmount === 0) {
            throw new Error('Cart is empty');
        }

        /* Создаем заказ */
        const order = await prisma.order.create({
            data: {
            token: cartToken,
            fullName: data.firstName + ' ' + data.lastName,
            email: data.email,
            phone: data.phone,
            adress: data.adress,
            comment: data.comment,
            totalAmount: userCart.totalAmount,
            status: OrderStatus.PENDING,
            items: JSON.stringify(userCart.items),
            },
        });

        // После этого очищаем корзину(не удаляем!)
        await prisma.cart.update({
            where:{
                id: userCart.id,
            },
            data:{
                totalAmount: 0,
            }
        })

        //После анулирования нужно удалить элементы из cartItem, которые привязаны к этой корзине
        await prisma.cartItem.deleteMany({
            where:{
                cartId: userCart.id,
            },
        })

        await sendEmail(data.email, 'NextPizza / оплатите заказ #' + order.id, PayOrderTemplate({
            orderId: order.id,
            totalAmount: order.totalAmount,
            paymentUrl: 'https://resend.com/docs/send-with-nextjs',
        }) )

        return 'https://resend.com/docs/send-with-nextjs';

    }catch(err){
        console.log('[CreateOrder] Server error', err)
    }

}

export async function updateUserInfo(body: Prisma.UserUpdateInput){
    try{
        const currentUser = await getUserSession();
        if(!currentUser){
            throw new Error('Пользователь не найден')
        }

        const findUser = await prisma.user.findFirst({
            where:{
                id: Number(currentUser.id)
            }
        })

        await prisma.user.update({
            where:{
                id: Number(currentUser.id),
            },
            data:{
                fullName: body.fullName,
                email: body.email,
                password: body.password ? hashSync(body.password as string, 10) : findUser?.password,
            },
        })


    }catch(err){
        console.error('Error [UPDATE_USER]', err)
        throw err;
    }
}

export async function registerUser(body: Prisma.UserCreateInput){
    try {
        const user = await prisma.user.findFirst({
            where:{
                email: body.email,
            }
        })
        console.log('Работает экшн регистрации')

        if(user){
            if(!user.verified){
                throw new Error('Почта не подтверждена')
            }
            throw new Error('Такой пользователь уже существует!')
        }

        const createdUser = await prisma.user.create({
            data:{
                fullName: body.fullName,
                email: body.email,
                password: hashSync(body.password, 10)
            }
        })

        const code = Math.floor(100000 * Math.random() * 900000).toString();

        await prisma.verificationCode.create({
            data:{
                code,
                userId: createdUser.id,
            }
        })

        await sendEmail(
            createdUser.email, 
            'NextPizza / подтверждение регистрации', 
            VerificationUserTemplate({
                code,
            }) 
        )

    } catch (err) {
        console.log('Error [REGISTER_USER]', err);
        throw err;
    }
}