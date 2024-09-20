import { prisma } from "@/prisma/prisma-client";
import { updateCartTotalAmount } from "@/shared/lib";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, {params}: {params: {id: string}}){
    try{
        const id = Number(params.id);
        const data = (await req.json()) as {quantity: number}
        console.log(id)
        console.log(data)
        const token = req.cookies.get('cartToken')?.value

        if(!token){
            return NextResponse.json({error: 'cartToken not found'})
        }

        const cartItem = await prisma.cartItem.findFirst({
            where:{
                id,
            }
        })

        if(!cartItem){
            return NextResponse.json({error: 'cart item not found'})
        }

        await prisma.cartItem.update({
            where:{
                id,
            },

            data:{
                quantity: data.quantity
            }
        })

        const updateUserCart = await updateCartTotalAmount(token);

        return NextResponse.json(updateUserCart)

    }catch(err){
        console.log('server error', err)
        return NextResponse.json({ message: 'Не удалось обновить корзину' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try{
        const id = Number(params.id)
        const token = req.cookies.get('cartToken')?.value

        if(!token){
            return NextResponse.json({error: 'Не удалось получить токен!'})
        }

        const cartItem = await prisma.cartItem.findFirst({
            where:{
                id,
            }
        })

        if(!cartItem){
            return NextResponse.json({error: 'Не удалось найти товар!'})
        }

        await prisma.cartItem.delete({
            where:{
                id,
            },
        })

        const updatedUserCart = await updateCartTotalAmount(token || '')
        return NextResponse.json(updatedUserCart)

    }catch(err){
        console.log(err)
        return NextResponse.json({message: 'Не удалось удалить корзину'}, {status: 500})
    }
}