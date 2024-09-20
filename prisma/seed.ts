//Данный файл нужен для генерации данных
import { Prisma } from "@prisma/client";
import { categories, ingredients, products } from "./constants";
import { prisma } from "./prisma-client";
import { hashSync } from "bcrypt";

const randomDecimalNumber = (min:number, max:number) => {
    return Math.floor(Math.random() * (max - min) * 10 + min * 10) / 10
}

const generateProductItem = ({productId, pizzaType, size}: {productId:number, pizzaType?: 1 | 2 , size?: 20| 30 | 40 }) => {
    return {
      productId,
      price: randomDecimalNumber(190, 600),
      pizzaType,
      size,
    } as Prisma.ProductItemUncheckedCreateInput;
  };


//Данная функция генерирует данные
async function up(){
    await prisma.user.createMany({
        data:[
            {
                fullName: 'User',
                email: 'user@test.ru',
                password: hashSync('11111', 10),
                verified: new Date(),
                role: 'USER',
            },
            {
                fullName: 'Admin',
                email: 'admin@test.ru',
                password: hashSync('11111', 10),
                verified: new Date(),
                role: 'ADMIN',
            },
        ]
    })

    await prisma.category.createMany({
        data: categories,
    })

    await prisma.ingredient.createMany({
        data: ingredients,
    })

    await prisma.product.createMany({
        data: products,
    })

    const pizza1 = await prisma.product.create({
        data: {
            name: 'Пепперони фреш',
            imageUrl: 'https://media.dodostatic.net/image/r:292x292/11EE7D612FC7B7FCA5BE822752BEE1E5.avif',
            categoryId: 1,
            //С помощью созданной связи, берутся первые 5 ингридиентов из таблицы Ingredient
            ingredients: {
                connect: ingredients.slice(0, 5)
            }
        }
    })

    const pizza2 = await prisma.product.create({
        data: {
            name: 'Сырная',
            imageUrl: 'https://media.dodostatic.net/image/r:292x292/11EE7D610D2925109AB2E1C92CC5383C.avif',
            categoryId: 1,
            
            ingredients: {
                connect: ingredients.slice(5, 10)
            }
        }
    })

    const pizza3 = await prisma.product.create({
        data: {
            name: 'Ветчина и грибы',
            imageUrl: 'https://media.dodostatic.net/image/r:292x292/11EF5B10B39BBBBDA9F8C4E4FF1B067C.avif',
            categoryId: 1,
            
            ingredients: {
                connect: ingredients.slice(10, 20)
            }
        }
    })

    await prisma.productItem.createMany({
        data: [
            //Пицца "Пепперони фреш"
            generateProductItem({productId: pizza1.id, pizzaType: 1, size: 20}),
            generateProductItem({productId: pizza1.id, pizzaType: 2, size: 30}),
            generateProductItem({productId: pizza1.id, pizzaType: 2, size: 40}),

            //Пицца "Сырная"
            generateProductItem({productId: pizza2.id, pizzaType: 1, size: 20}),
            generateProductItem({productId: pizza2.id, pizzaType: 1, size: 30}),
            generateProductItem({productId: pizza2.id, pizzaType: 1, size: 40}),
            generateProductItem({productId: pizza2.id, pizzaType: 2, size: 20}),
            generateProductItem({productId: pizza2.id, pizzaType: 2, size: 30}),
            generateProductItem({productId: pizza2.id, pizzaType: 2, size: 40}),

            //Пицца "Ветчина и грибы"
            generateProductItem({productId: pizza3.id, pizzaType: 1, size: 20}),
            generateProductItem({productId: pizza3.id, pizzaType: 2, size: 30}),
            generateProductItem({productId: pizza3.id, pizzaType: 2, size: 40}),

            //Остальные продукты
            generateProductItem({productId: 1}),
            generateProductItem({productId: 2}),
            generateProductItem({productId: 3}),
            generateProductItem({productId: 4}),
            generateProductItem({productId: 5}),
            generateProductItem({productId: 6}),
            generateProductItem({productId: 7}),
            generateProductItem({productId: 8}),
            generateProductItem({productId: 9}),
            generateProductItem({productId: 10}),
            generateProductItem({productId: 11}),
            generateProductItem({productId: 12}),
            generateProductItem({productId: 13}),
            generateProductItem({productId: 14}),
            generateProductItem({productId: 15}),
            generateProductItem({productId: 16}),
            generateProductItem({productId: 17}),
            generateProductItem({productId: 18}),

        ]
    })

    await prisma.cart.createMany({
        data:[
            {
                userId: 1,
                totalAmount: 0,
                token: '111',
            },
            {
                userId: 2,
                totalAmount: 0,
                token: '222',
            }
        ]
    })

    await prisma.cartItem.create({
        data: 
            {
                productItemId: 1,
                cartId: 2,
                quantity: 2,
                ingredients:{
                    connect: [{id: 1},{id: 2},{id: 3},{id: 4},]
                }
            }
        
    })
}

//Данная функция очищает данные перед генерацией
async function down(){
    await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Ingredient" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "ProductItem" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Cart" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "CartItem" RESTART IDENTITY CASCADE`;
    //TRUNCATE TABLE "название таблицы" - очищает таблицу
    //RESTART IDENTITY - удаляет айдишники, чтобы инкремент работал корректно
    //CASCADE - если есть связанные с этой таблицей записи, удалить их тоже, во избежание конфликтов
}


//Основная функция которая будет запускать две вспомогательные
async function main(){
    try {
        await down()
        await up()
    } catch (err) {
        console.error(err)
    }
}

main().then(async () => await prisma.$disconnect())