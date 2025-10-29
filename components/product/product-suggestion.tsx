"use client"

import Link from 'next/link'
import { ProductDetail } from '@/types/product'
import React from 'react'

interface Props {
  product: ProductDetail
}

export function ProductSuggestion({ product }: Props) {
  const image = product.images?.[0]?.url || '/images/placeholder.jpg'
  const price = product.variants?.[0]?.price ?? 0
  const compare = product.variants?.[0]?.compare_at_price ?? 0

  const fmt = (v: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v)

  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center bg-white overflow-hidden rounded">
        <img src={image} alt={product.name} className="object-cover w-full h-full" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 line-clamp-2">{product.name}</div>
        <div className="mt-1 flex items-baseline gap-2">
          <div className="text-sm font-semibold text-red-600">{fmt(price)}</div>
          {typeof compare === 'number' && compare > price && (
            <div className="text-xs text-gray-400 line-through">{fmt(compare)}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductSuggestion
