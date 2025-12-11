"use client"

import { useState } from "react"
import { ShoppingCart, Heart, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SubscriptionForm from "@/components/subscription-form"
import Link from "next/link"

// Mock product data
const mockProduct = {
  id: "1",
  name: "프리미엄 샐러드 구독",
  category: "FOOD",
  price: 8900,
  image: "/placeholder.svg?key=gqzfh",
  description:
    "매일 아침 신선하게 배달되는 샐러드입니다. 시즌에 맞는 신선한 야채와 드레싱을 매번 다르게 구성하여 제공합니다.",
  stock: 50,
  rating: 4.8,
  reviews: 234,
  details: ["신선한 야채만 사용", "매일 배송", "영양 정보 제공", "반품 가능"],
}

export default function ProductDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const [quantity, setQuantity] = useState(1)
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false)
  const [activeTab, setActiveTab] = useState("description")

  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Link
          href="/"
          className="flex items-center gap-2 text-primary hover:underline mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          뒤로가기
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="flex items-center justify-center bg-muted rounded-lg h-96 lg:h-auto lg:sticky lg:top-24">
            <img
              src={mockProduct.image || "/placeholder.svg"}
              alt={mockProduct.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-primary uppercase mb-2">
              {mockProduct.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              {mockProduct.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">
                    ★
                  </span>
                ))}
              </div>
              <span className="text-muted-foreground">
                {mockProduct.rating} ({mockProduct.reviews} 리뷰)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6 pb-6 border-b border-border">
              <p className="text-sm text-muted-foreground mb-2">
                월간 예상 비용
              </p>
              <p className="text-4xl font-bold text-primary">
                ₩{(mockProduct.price * 4).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                주 1회 배송 기준
              </p>
            </div>

            {/* Stock Info */}
            <p className="text-sm text-muted-foreground mb-6">
              {mockProduct.stock > 0 ? (
                <span className="text-green-600">✓ 재고 있음</span>
              ) : (
                <span className="text-destructive">품절</span>
              )}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 h-12 bg-transparent"
                onClick={() => {}}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                장바구니 담기
              </Button>
              <Button
                size="lg"
                className="flex-1 h-12 bg-primary hover:bg-primary/90"
                onClick={() => setShowSubscriptionForm(true)}
              >
                구독 신청
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 bg-transparent"
              >
                <Heart className="w-5 h-5" />
              </Button>
            </div>

            {/* Subscription Form Modal */}
            {showSubscriptionForm && (
              <SubscriptionForm
                product={mockProduct}
                onClose={() => setShowSubscriptionForm(false)}
              />
            )}

            {/* Key Features */}
            <Card className="p-6 bg-secondary/10">
              <h3 className="font-bold text-foreground mb-4">주요 특징</h3>
              <ul className="space-y-3">
                {mockProduct.details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span className="text-foreground">{detail}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="description">상세 정보</TabsTrigger>
              {/* <TabsTrigger value="shipping">배송 정보</TabsTrigger>
                <TabsTrigger value="reviews">리뷰</TabsTrigger> */}
            </TabsList>

            <TabsContent value="description" className="mt-8">
              <Card className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  상세 정보
                </h3>
                <div className="prose prose-invert max-w-none">
                  <p className="text-foreground text-lg leading-relaxed">
                    {mockProduct.description}
                  </p>
                  <h4 className="text-lg font-bold text-foreground mt-6 mb-3">
                    배송 주기
                  </h4>
                  <ul className="space-y-2 text-foreground">
                    <li>
                      • <strong>주간 구독:</strong> 매주 선택한 요일에 배송
                    </li>
                    <li>
                      • <strong>월간 구독:</strong> 매달 선택한 날짜에 배송
                    </li>
                  </ul>
                </div>
              </Card>
            </TabsContent>

            {/* <TabsContent value="shipping" className="mt-8">
                <Card className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    배송 정보
                  </h3>
                  <div className="space-y-4 text-foreground">
                    <p>
                      <strong>배송지:</strong> 전국 (제주, 도서산간 제외)
                    </p>
                    <p>
                      <strong>배송 시간:</strong> 오전 10시 ~ 오후 6시
                    </p>
                    <p>
                      <strong>배송료:</strong> 무료
                    </p>
                    <p>
                      <strong>반품:</strong> 배송 후 7일 이내 가능
                    </p>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-8">
                <Card className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-6">
                    고객 리뷰
                  </h3>
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="border-b border-border pb-6 last:border-b-0"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-foreground">
                            고객 {i}
                          </span>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, j) => (
                              <span key={j} className="text-yellow-400">
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground">
                          정말 신선하고 맛있습니다. 매주 기대됩니다!
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent> */}
          </Tabs>
        </div>
      </div>
    </main>
  )
}
