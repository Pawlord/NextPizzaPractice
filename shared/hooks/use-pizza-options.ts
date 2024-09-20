import React from "react";
import { PizzaSize, PizzaType } from "../constants/pizza";
import { useSet } from "react-use";
import { getAvailablePizzaSiza } from "../lib";
import { ProductItem } from "@prisma/client";
import { Variant } from "../components/shared/group-variants";

interface ReturnProps{
    type: PizzaType;
    size: PizzaSize;
    selectedIngredients: Set<number>;
    availablePizzaSize: Variant[];
    currentProductItemId?: number;
    setType: (type: PizzaType) => void;
    setSize: (size: PizzaSize) => void;
    addIngredient: (id: number) => void;
}

export const usePizzaOptions = (productItems: ProductItem[]): ReturnProps => {
    
    const [selectedIngredients, {toggle: addIngredient}] = useSet(new Set<number>([]))
    const [size, setSize] = React.useState<PizzaSize>(20)
    const [type, setType] = React.useState<PizzaType>(1)

    const availablePizzaSize = getAvailablePizzaSiza(type, productItems)
    
    const currentProductItemId = productItems.find((item) => item.pizzaType === type && item.size === size)?.id

    React.useEffect(() => {
        const isAvailableSize = availablePizzaSize?.find(
            (item) => Number(item.value) === size && !item.disabled
        )

        const availableSize = availablePizzaSize?.find((item) => !item.disabled)

        if(!isAvailableSize && availableSize){
            setSize(Number(availableSize.value)  as PizzaSize);
        }
    }, [type])

    return{
        size,
        type,
        selectedIngredients,
        availablePizzaSize,
        currentProductItemId,
        setSize,
        setType,
        addIngredient,
    }
}