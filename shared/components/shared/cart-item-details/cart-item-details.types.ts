import { Ingredient } from "@prisma/client";

export interface CartItemProps {
    id: number;
    imageUrl: string;
    details: string;
    name: string;
    disabled?: boolean,
    price: number;
    quantity: number;
  }