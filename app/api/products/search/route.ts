import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";


export const GET = async(req:NextRequest) => {
    const query = req.nextUrl.searchParams.get('query') || ''

    console.log(query)

    const products = await prisma.product.findMany({
        //Найти все элементы (where - где), поле name включает в себя query, и mode не чувствителен к регистру 
        where:{
            name:{
                contains: query,
                mode: 'insensitive',
            },
            
        },
        
    })
    return NextResponse.json(products)
}