import { ProductItem } from "@prisma/client"
import { pizzaSizes, PizzaType } from "../constants/pizza"
import { Variant } from "../components/shared/group-variants"

export const getAvailablePizzaSiza = (type: PizzaType, productItems: ProductItem[]): Variant[] => {
    const filteredPizzasByType = productItems?.filter(item => item.pizzaType === type)
    
    return pizzaSizes.map((item) => (
        {
            name: item.name,
            value: item.value,
            disabled: !filteredPizzasByType?.some((pizza) => Number(pizza.size) === Number(item.value))
        }
    ))
}