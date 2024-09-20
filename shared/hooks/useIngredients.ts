import React from "react";

import { Api } from "@/shared/services/api-client";
import { Ingredient } from "@prisma/client";

export const useIngredients = () => {
    const [ingredients, setIngredients] = React.useState<Ingredient[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        async function fetchIngedients(){
            try {
                setLoading(true)
                const ingredients = await Api.ingedients.getAll()
                setIngredients(ingredients)
            } catch (error) {
                console.log(error)
            }
            finally{
                setLoading(false)
            }
        }
        fetchIngedients();
    }, [])

    return {ingredients, loading };
}