//Компонент отрисовывающий развернутую информацию о продукте с вариантом выбора размеров и тд.
import { Container, ProductForm, } from "@/shared/components/shared"
import { prisma } from "@/prisma/prisma-client"
import { notFound } from "next/navigation"

//Здесь в пропсах метод двухуровневой деструктуризации
export default async function ProductPage({ params: { id } }: { params: { id: string } }) {
    const product = await prisma.product.findFirst({
        where: {
          id: Number(id),
        },
        include: {
          ingredients: true,
          category:{
            include:{
              products:{
                include:{
                  productItems: true,
                }
              }
            }
          },
          productItems: true,
        },
      }
    );

    if (!product) {
        return notFound()
    }

    return (
    <Container className="flex flex-col my-10">
        <ProductForm product={product} />
    </Container>)
}