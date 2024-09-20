import { Ingredient, Product, ProductItem } from '@prisma/client';

export type ProductWithRelations = Product & { productItems: ProductItem[]; ingredients: Ingredient[] };