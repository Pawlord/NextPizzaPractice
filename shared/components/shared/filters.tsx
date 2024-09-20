'use client'

import React from 'react'
import { Title } from './title'
import { Input, RangeSlider } from '../ui'
import { CheckboxFiltersGroup } from './checkbox-filters-group'

import { useIngredients, useFilters, useQueryFilters } from '@/shared/hooks'

// --- Компонент, отвечающий как контейнер всех фильтров ---

interface Props{
    className?: string,
}

export const Filters:React.FC<Props> = ({className}) => {

  const {ingredients, loading} = useIngredients();
  const filters = useFilters();

  useQueryFilters(filters)

  const items = ingredients.map(ingredient => ({value: String(ingredient.id), text: ingredient.name}))
  
  const updatePrice = (prices: number[]) => {
    filters.setPrices('priceFrom', prices[0])
    filters.setPrices('priceTo', prices[1])
  }

  return (
    <div className={className}>
        <Title text='Фильтрация' size='sm' className='mb-5 font-bold' />

        {/* Чекбоксы типов теста */}
          <CheckboxFiltersGroup
          title="Тип теста"
          name="pizzaTypes"
          className="mb-5"
          onClickCheckbox={filters.setPizzaTypes}
          selected={filters.pizzaTypes}
          items={[
            { text: 'Тонкое', value: '1' },
            { text: 'Традиционное', value: '2' },
          ]}
        />

        {/* Чекбоксы размеров */}
        <CheckboxFiltersGroup
          title="Размеры"
          name="sizes"
          className="mb-5"
          selected={filters.sizes}
          onClickCheckbox={filters.setSizes}
          items={[
            { text: '20 см', value: '20' },
            { text: '30 см', value: '30' },
            { text: '40 см', value: '40' },
          ]}
        />

        {/* Фильтр цен */}
        <div className='mt-5 border-y border-y-neutral-100 py-6 pb-7'>
          <p className='font-bold mb-3'>Цена от и до:</p>
          <div className='flex gap-3 mb-5'>
            <Input
              onChange={(e) => filters.setPrices('priceFrom', Number(e.target.value))}
              type='number' 
              placeholder='0' 
              min={0} 
              max={1000} 
              value={String(filters.prices.priceFrom) } 
            />
            <Input
              onChange={(e) => filters.setPrices('priceTo', Number(e.target.value))}
              type='number' 
              placeholder='100' 
              min={100} 
              value={String(filters.prices.priceTo)} 
              max={1000} 
            />
          </div>

          <RangeSlider 
            min={0} 
            max={1000} 
            step={10} 
            value={[
            filters.prices.priceFrom || 0,
            filters.prices.priceTo || 1000
            ]} 
            onValueChange={updatePrice} 
          />
        </div>

        {/* Фильтр ингридиентов */}
        <div>
          <CheckboxFiltersGroup
            title='Ингредиенты'
            className='mt-5'
            limit={6}
            name='ingredient'
            defaultItems={items.slice(0,6)}
            items={items}
            loading={loading}
            onClickCheckbox={filters.setSelectedIngredients}
            selected={filters.selectedIngredients}
          />
        </div>
    </div>
  )
}