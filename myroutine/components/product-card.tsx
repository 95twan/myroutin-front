"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

interface ProductCardProps {
  product: {
    id: string
    name: string
    category: string
    price: number
    image: string
    status: string
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        {/* Image */}
        <div className="relative w-full h-64 bg-muted overflow-hidden">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col">
          <span className="text-xs font-semibold text-primary uppercase mb-2">{product.category}</span>
          <h3 className="font-bold text-foreground mb-2 line-clamp-2">{product.name}</h3>
          <p className="text-lg font-bold text-primary mb-4 mt-auto">₩{product.price.toLocaleString()}</p>

          {/* Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-transparent"
              onClick={(e) => {
                e.preventDefault()
                // TODO: Add to cart
              }}
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              담기
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={(e) => {
                e.preventDefault()
                // Navigate to product detail
              }}
            >
              구독하기
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  )
}
