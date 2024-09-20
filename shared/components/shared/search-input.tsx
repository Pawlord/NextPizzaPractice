'use client'
//т.к. в этом компоненте будет стейт, нужно обозначить, что этот компонент use client

import { cn } from '@/shared/lib/utils';
import { Search } from 'lucide-react';
import { useClickAway, useDebounce } from 'react-use'
import React from 'react'
import Link from 'next/link';

import { Api } from '@/shared/services/api-client';
import { Product } from '@prisma/client';

interface Props{
    className?: string;
}

export const SearchInput:React.FC<Props> = ({className}) => {

    const [searchQuery, setSearchQuery] = React.useState('')
    const [products, setProducts] = React.useState<Product[]>([])
    const [focused, setFocused] = React.useState(false)

    const ref = React.useRef(null)

    useClickAway(ref, () => {
        setFocused(false)
    })

    const onClickItem = () => {
        setFocused(false)
        setSearchQuery('')
        setProducts([])
    }

    useDebounce(async ()=> {
        try {
            const response = await Api.products.search(searchQuery)
            
            setProducts(response)
        } catch (err) {
            console.error(err)
        }
    }, 
    300,
    [searchQuery])

  return (
    <>
        { focused && (<div className='fixed top-0 left-0 bottom-0 right-0 bg-black/50 z-30' />)}
        <div ref={ref} className={cn('flex rounded-2xl flex-1 justify-between relative h-11', className)}>
            <Search className="absolute top-1/2 translate-y-[-50%] left-3 h-5 text-gray-400" />
            <input
            className="rounded-2xl outline-none w-full bg-gray-100 pl-11 z-30"
            type="text"
            placeholder="Найти пиццу..."
            onFocus={() => setFocused(true)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />

           { products.length > 0 && (<div className={cn('absolute w-full bg-white rounded-xl py-2 top-14 shadow-md transition-all duration-200 invisible opacity-0 z-30', focused && 'visible opacity-100 top-12')}>
                {
                    products.map(product => (
                        <Link
                            onClick={onClickItem}
                            key={product.id} 
                            className='flex items-center gap-2' 
                            href={`/product/${product.id}`}>
                                <img className='rounded-sm' width={50} height={50} src={product.imageUrl} alt={product.name}/>
                
                                <div className='px-3 py-2 hover:bg-primary/10 cursor-pointer'>{product.name}</div>
                        </Link>
                    ))
                }
                
            </div>)}
        </div>

        
    </>
  )
}