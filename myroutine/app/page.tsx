"use client"

import { useState } from "react"
import { Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Header from "@/components/header"
import ProductGrid from "@/components/product-grid"
import Sidebar from "@/components/sidebar"

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header onCartClick={() => {}} onMyPageClick={() => {}} onLoginClick={() => {}} />

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

            {/* Search Bar */}
            <div className="flex gap-2 max-w-md">
              <Input
                placeholder="상품 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12"
              />
              <Button className="h-12 px-6 bg-primary hover:bg-primary/90">
                <Search className="w-5 h-5" />
              </Button>
            </div>
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
                <Button variant="outline" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden">
                  {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </div>

              <ProductGrid searchQuery={searchQuery} category={selectedCategory} priceRange={priceRange} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-foreground mb-4">MyRoutine</h3>
              <p className="text-muted-foreground text-sm">신선한 상품을 구독하고 편리하게 받아보세요</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">고객 지원</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    문의하기
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    배송 정보
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    반품 정책
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">회사</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    소개
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    블로그
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    채용
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">법적</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    개인정보
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    약관
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    쿠키
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 MyRoutine. 모든 권리 보유.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
