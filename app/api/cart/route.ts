import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto'; 
import { findOrCreateCart, updateCartTotalAmount } from "@/shared/lib";
import { CreateCartItemValues } from "@/shared/services/dto/cart.dto";

export async function GET(req: NextRequest){
    try {
        const token = req.cookies.get('cartToken')?.value;

        if(!token){
            return NextResponse.json({items: []})
        }

        const userCart = await prisma.cart.findFirst({
            where:{
                // Найти корзину в которой есть либо такой userId либо такой токен
                OR:[
                    {token},
                ]
            },
            include:{
                //Также верни нам информацию о cartItem отсортированную по дате создания
                items: {
                    orderBy:{
                        createdAt: 'desc',
                    },
                    //Вместе с информацией о productItem
                    include:{
                        productItem:{
                            //Который в себе хранит информацию о самом продукте
                            include:{
                                product: true
                            }
                        },
                        //А также вместе с productItem верни информацию об ингредиентах
                        ingredients: true,
                    }
                },
            },
        })
        
        return NextResponse.json(userCart)
    } catch (error) {
        console.log('[CART_GET] Server error:', error)
        return NextResponse.json({message: 'Не удалось получить товар'}, {status: 500})
    }
}

export async function POST(req: NextRequest){
    try {
        let token = req.cookies.get('cartToken')?.value;

        if(!token){
            token = crypto.randomUUID();
        }

        const userCart = await findOrCreateCart(token);

        const data = (await req.json()) as CreateCartItemValues;

        //Если товар был найден то делаем +1 к количеству этого товара
        const findCartItem = await prisma.cartItem.findFirst({
            where: {
              cartId: userCart.id,
              productItemId: data.productItemId,
              ingredients: { every: { id: { in: data.ingredients } } },
            },
          });

        if (findCartItem) {
            await prisma.cartItem.update({
                where:{
                    id: findCartItem.id,
                },
                data:{
                    quantity: findCartItem.quantity + 1,
                },
            })
        }else{
            await prisma.cartItem.create({
                data:{
                    cartId: userCart.id,
                    productItemId: data.productItemId,
                    quantity: 1,
                    ingredients: {connect: data.ingredients?.map((id) => ({id}))}
                }
            })
        }

        const updatedCartItem = await updateCartTotalAmount(token);

        const resp = NextResponse.json(updatedCartItem);
        //при создании токена можно указать время жизни и тд
        resp.cookies.set('cartToken', token)

        return resp;


    } catch (err) {
        console.log('[CART_POST] Server error', err)
        return NextResponse.json({message: 'Не удалось создать корзину'}, {status: 500})
    }
}