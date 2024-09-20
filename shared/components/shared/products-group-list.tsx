'use client'

// --- Компонент, отвечающий за вывод всей группы продуктов вместе с карточками --- 

import React from 'react';
import { Title } from './title';
import { ProductCard } from './product-card';
import { useIntersection } from 'react-use';
import { useCategoryStore } from '@/shared/store/category';
import { cn } from '@/shared/lib/utils';
import { ProductWithRelations } from '@/@types/prisma';

interface Props {
    title: string;
    items: ProductWithRelations[];
    categoryId: number;
    className?: string;
    listClassName?: string;
}

export const ProductsGroupList: React.FC<Props> = ({
    title,
    items,
    categoryId,
    className,
    listClassName,
}) => {

    const setCategoryId = useCategoryStore(state => state.setActiveId)
    const intesectionRef = React.useRef(null)
    const intersection = useIntersection(intesectionRef, {
        threshold: 0.4,
    })

    React.useEffect(() => {
        if (intersection?.isIntersecting) {
            setCategoryId(categoryId)
        }
    }, [title, categoryId, intersection?.isIntersecting])

  return (
      <div className={className} id={title} ref={intesectionRef}>
        <Title text={title} size="lg" className="font-extrabold mb-5" />

        <div className={cn('grid grid-cols-3 gap-[50px]', listClassName)}>
            {items.map((product, i) => (
                <ProductCard
                    id={product.id}
                    key={product.id}
                    name={product.name}
                    imageUrl={product.imageUrl}
                    price={product.productItems[0].price}
                    ingredients={product.ingredients}
                />
            ))}
        </div>
      </div>
  )
}