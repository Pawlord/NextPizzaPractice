import { Ingredient, ProductItem } from "@prisma/client"
import { PizzaSize, PizzaType } from "../constants/pizza"

/**
 * Функция для подсчета итоговой стоимости пиццы с учетом ингредиентов, типа теста и размеров
 * @param type - тип теста выбранной пиццы
 * @param size - размер выбранной пиццы
 * @param productItems - вариации для выбранной пиццы
 * @param ingredients - все доступные ингредиенты пиццы
 * @param selectedIngredients - выбранные ингредиентвы
 * @returns number - общая стоимость пиццы
 */
export const calcTotalPizzaPrice = (
    type: PizzaType,
    size: PizzaSize,
    productItems: ProductItem[],
    ingredients: Ingredient[],
    selectedIngredients: Set<number>
) => {
    const pizzaPrice = productItems?.find((item) => item.pizzaType === type && item.size === size)?.price || 0
    
    const totalIngredientPrice = ingredients
        .filter(ingredients => selectedIngredients
        .has(ingredients.id))
        .reduce((acc, ingredient) => acc + ingredient.price, 0)

    return pizzaPrice + totalIngredientPrice
}