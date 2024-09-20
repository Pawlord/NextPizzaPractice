import { useRouter } from "next/navigation"
import React from "react"
import { Filters } from "./useFilters"
import qs from 'qs';
//Обязательно импорт из next/navigation - это более новый вариант

//Кастомный хук, использующийся, чтобы задавать query параметры в url, когда пользователь
//выбирает чек боксы фильтров

export const useQueryFilters = (filters: Filters) => {
    const router = useRouter()
    
    React.useEffect(() => {
        const params = {
          ...filters.prices,
          sizes: Array.from(filters.sizes),
          pizzaTypes: Array.from(filters.pizzaTypes),
          ingredients: Array.from(filters.selectedIngredients)
        }
        
        //Формируется строка с query параметрами из переданного объекта
        const query = qs.stringify(params, {
          arrayFormat: 'comma',
        })
    
        //Вшивание query строки в url
        router.push(`?${query}`, { scroll: false })
    
      }, [filters])
}