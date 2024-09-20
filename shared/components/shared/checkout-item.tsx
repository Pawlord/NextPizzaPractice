'use client';

import { cn } from "@/shared/lib/utils";
import { CartItemProps } from "./cart-item-details/cart-item-details.types";
import * as CartItemsDetails from "./cart-item-details";
import { X } from "lucide-react";

interface Props extends CartItemProps{
    onClickCountButton?: (type: 'plus' | 'minus') => void;
    onClickRemove?: () => void;
    className?: string;
}


export const CheckoutItem: React.FC<Props> = ({
    name,
    price,
    imageUrl,
    quantity,
    details,
    className,
    disabled,
    onClickCountButton,
    onClickRemove,
}) => {
    return(
        <div className={cn('flex items-center justify-between', {'opacity-50 pointer-events-none' : disabled}, className)}>
            <div className="flex items-center gap-5 flex-1">
                <CartItemsDetails.Image src={imageUrl} />
                <CartItemsDetails.Info className="" details={details} name={name} />
            </div>

            <CartItemsDetails.Price value={price} />

            <div className="flex items-center gap-5 ml-20">
                <CartItemsDetails.CountButton onClick={onClickCountButton} value={quantity} />
                <button onClick={onClickRemove}>
                    <X className="text-gray-400 cursor-pointer hover: text-gray-600" size={20} />
                </button>
            </div>
        </div>
    )
}