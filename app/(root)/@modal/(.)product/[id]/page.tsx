//Компонент отрисовывающий развернутую информацию о продукте с вариантом выбора размеров и тд.

import { ChooseProductModal } from "@/shared/components/shared"
import { GroupVariants } from "@/shared/components/shared/group-variants"
import { prisma } from "@/prisma/prisma-client"
import { notFound } from "next/navigation"


//Здесь в пропсах метод двухуровневой деструктуризации
export default async function ProductModalPage({ params: { id } }: { params: { id: string } }) {
    const product = await prisma.product.findFirst({
        where: {
          id: Number(id),
        },
        include: {
          ingredients: true,
          productItems: true,
        },
      });

      if (!product) {
        return notFound();
      }

    return (
        <ChooseProductModal product={product} />
    )
}

{/* <Container className="flex flex-col my-10">
        <div className="flex flex-1">
            <ProductImage imageUrl={product.imageUrl} size={40} className='' />

            <div className="w-[490px] bg-[#FCFCFC] p-7">
                <Title text={product.name} size="md" className="font-extrabold mb-1" />
                
                <p className="text-gray-400">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolor, libero. Dolores eum dicta saepe sequi suscipit rerum eveniet nesciunt amet vel pariatur, magni totam nisi cupiditate soluta quis cum. Quia!</p>
                
                <GroupVariants 
                    selectedValue='2'
                    items={[{
                        name: 'Маленькая',
                        value: '1',
                    },
                    {
                        name: 'Средняя',
                        value: '2',
                    },{
                        name: 'Большая',
                        value: '3',
                        disabled: true,
                    }]}/>
            </div>
        </div>
        
    </Container> */}