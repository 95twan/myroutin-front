"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductGrid from "@/components/product-grid"
import Sidebar from "@/components/sidebar"

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])

  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            매일 신선한 상품을 구독하세요
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
            식품부터 의류까지, 당신이 원하는 상품을 정기적으로 배송받으세요
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className={`${isSidebarOpen ? "block" : "hidden"} lg:block`}>
            <Sidebar
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
            />
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">상품 목록</h2>
              <Button
                variant="outline"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden"
              >
                {isSidebarOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>

            <ProductGrid
              searchQuery=""
              category={selectedCategory}
              priceRange={priceRange}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
