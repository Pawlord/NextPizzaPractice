import { prisma } from "@/prisma/prisma-client"
import { calcCartItemTotalPrice } from "./calc-cart-item-total-price"

export const updateCartTotalAmount = async (token: string) => {
  const userCart = await prisma.cart.findFirst({
    where: {
      token,
    },
    include: {
      //Также верни нам информацию о cartItem отсортированную по дате создания
      items: {
        orderBy: {
          createdAt: 'desc',
        },
        //Вместе с информацией о productItem
        include: {
          productItem: {
            //Который в себе хранит информацию о самом продукте
            include: {
              product: true
            }
          },
          //А также вместе с productItem верни информацию об ингредиентах
          ingredients: true,
        }
      },
    },
  })

  if (!userCart) {
    return;
  }

  const totalAmount = userCart?.items.reduce((acc: any, item: any) => acc + calcCartItemTotalPrice(item), 0)

  return await prisma.cart.update({
    where: {
      id: userCart.id,
    },
    data: {
      totalAmount,
    },
    include: {
      items: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          productItem: {
            include: {
              product: true,
            },
          },
          ingredients: true,
        },
      },
    },
  });
} 