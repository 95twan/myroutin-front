"use client"

import { useState, useEffect } from "react"
import ProductCard from "@/components/product-card"
import { Card } from "@/components/ui/card"

interface ProductGridProps {
  searchQuery: string
  category: string | null
  priceRange: [number, number]
}

// Mock data - TODO: Replace with actual API calls
const mockProducts = [
  {
    id: "1",
    name: "프리미엄 샐러드 구독",
    category: "FOOD",
    price: 8900,
    image: "/salad-subscription.jpg",
    status: "ON_SALE",
  },
  {
    id: "2",
    name: "유기농 요거트 세트",
    category: "FOOD",
    price: 12900,
    image: "/organic-yogurt.jpg",
    status: "ON_SALE",
  },
  {
    id: "3",
    name: "프리미엄 커피 원두",
    category: "BEVERAGE",
    price: 15000,
    image: "/premium-coffee-beans.jpg",
    status: "ON_SALE",
  },
  {
    id: "4",
    name: "스포츠 티셔츠 월간",
    category: "CLOTHES",
    price: 25000,
    image: "/sports-t-shirt.png",
    status: "ON_SALE",
  },
  {
    id: "5",
    name: "비타민 구독 패키지",
    category: "HEALTH",
    price: 29900,
    image: "/vitamin-package.jpg",
    status: "ON_SALE",
  },
  {
    id: "6",
    name: "홈 스킨케어 세트",
    category: "HEALTH",
    price: 35000,
    image: "/skincare-set.png",
    status: "ON_SALE",
  },
  {
    id: "7",
    name: "프리미엄 침구류",
    category: "HOME",
    price: 45000,
    image: "/premium-bedding.jpg",
    status: "ON_SALE",
  },
  {
    id: "8",
    name: "친환경 세제 구독",
    category: "HOME",
    price: 18900,
    image: "/eco-detergent.jpg",
    status: "ON_SALE",
  },
]

export default function ProductGrid({ searchQuery, category, priceRange }: ProductGridProps) {
  const [filteredProducts, setFilteredProducts] = useState(mockProducts)

  useEffect(() => {
    let filtered = mockProducts

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Category filter
    if (category) {
      filtered = filtered.filter((p) => p.category === category)
    }

    // Price filter
    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])

    setFilteredProducts(filtered)
  }, [searchQuery, category, priceRange])

  if (filteredProducts.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">검색 결과가 없습니다.</p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
