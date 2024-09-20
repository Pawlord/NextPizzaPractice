import { useSearchParams } from "next/navigation";
import { useSet } from "react-use";
import React from "react";

//Интерфейс для фильтра цены
interface PriceProps{
    priceFrom?: number;
    priceTo?: number;
}
  
  //Интерфейс для query строки
interface QueryFilters extends PriceProps{
    sizes: string,
    pizzaTypes: string,
    ingredients: string
}

export interface Filters{
    sizes: Set<string>,
    pizzaTypes: Set<string>,
    selectedIngredients: Set<string>,
    prices: PriceProps
}

interface ReturnProps extends Filters{
    setPrices: (name: keyof PriceProps, value: number) => void,
    setPizzaTypes: (key: string) => void,
    setSizes: (key: string) => void,
    setSelectedIngredients: (key: string) => void,
}

//Данный хук отвечает за хранение состояния фильтрации через searchParams

export const useFilters = (): ReturnProps => {
   
    const searchParams = useSearchParams() as unknown as Map<keyof QueryFilters, string>

    // Фильтр выбранных ингредиентов
    const [selectedIngredients, {toggle: toggleIngredients}] = useSet(new Set<string>(searchParams.get('ingredients')?.split(',')));

    // Фильтр выбранных размеров
    const [sizes, {toggle: toggleSizes}] = useSet(new Set<string>(searchParams.get('sizes') ? searchParams.get('sizes')?.split(',') : []));
    
    // Фильтр выбранных типов пицц
    const [pizzaTypes, {toggle: togglePizzaTypes}] = useSet(new Set<string>(searchParams.get('pizzaTypes') ? searchParams.get('pizzaTypes')?.split(',') : []));
    
    //Используется searchParams чтобы сохранять выбранные параметры в url и чтобы при перезагрузке
    //страницы сохранялись выбранные чекбоксы или цена, относительно этих параметров
    // Фильтр указанной стоимости
    const [prices, setPrices] = React.useState<PriceProps>({
        priceFrom: Number(searchParams.get('priceFrom')) || undefined,
        priceTo: Number(searchParams.get('priceTo')) || undefined
    })

    const updatePrice = (name: keyof PriceProps, value: number) => {
        setPrices(prev =>({
          ...prev,
          [name]: value,
        }))
    }

    // const filters = {
    //     ...prices,
    //     sizes: Array.from(sizes),
    //     pizzaTypes: Array.from(pizzaTypes),
    //     ingredients: Array.from(selectedIngredients)
    // }

    return React.useMemo(() => ({
        selectedIngredients,
        sizes,
        pizzaTypes,
        prices,
        setPrices: updatePrice,
        setPizzaTypes: togglePizzaTypes,
        setSizes: toggleSizes,
        setSelectedIngredients: toggleIngredients,
    }), [selectedIngredients, sizes, pizzaTypes, prices])

}