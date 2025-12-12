"use client"

import { useEffect, useState } from "react"
import { ShoppingCart, Heart, ChevronLeft, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import SubscriptionForm from "@/components/subscription-form"
import Link from "next/link"
import { useParams } from "next/navigation"
import { productApi, type ProductInfoResponse } from "@/lib/api-client"
import { getCategoryLabel } from "@/lib/categories"

const mockProduct: ProductInfoResponse = {
  id: "1",
  shopId: "1",
  name: "프리미엄 샐러드 구독",
  description:
    "매일 아침 신선하게 배달되는 샐러드입니다. 신선한 야채와 드레싱을 다양하게 제공합니다.",
  price: 8900,
  stock: 0,
  status: "ON_SALE",
  category: "FOOD_BEVERAGE",
  thumbnailUrl: "/placeholder.svg?key=gqzfh",
  createdAt: new Date().toISOString(),
  modifiedAt: new Date().toISOString(),
}

export default function ProductDetailPage() {
  const routeParams = useParams<{ id: string }>()
  const id = (routeParams?.id as string) || ""
  const [product, setProduct] = useState<ProductInfoResponse>(mockProduct)
  const [quantity, setQuantity] = useState(1)
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return
      setIsLoading(true)
      setError(null)
      try {
        const data = await productApi.getProductDetail(id)
        const normalized: ProductInfoResponse = {
          ...mockProduct,
          ...data,
          id: data.id?.toString() || id,
          thumbnailUrl: data.thumbnailUrl || mockProduct.thumbnailUrl,
        }
        setProduct(normalized)
      } catch (err: any) {
        setError(
          err?.message ||
            "상품 정보를 불러오지 못했습니다. 더미 데이터를 표시합니다."
        )
        setProduct(mockProduct)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const displayPrice = (price: number) => `₩${price.toLocaleString()}`

  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-primary hover:underline mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          뒤로가기
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="flex items-center justify-center bg-muted rounded-lg h-80 lg:h-[480px] lg:sticky lg:top-24">
            <img
              src={product.thumbnailUrl || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-sm font-semibold text-primary uppercase">
              {getCategoryLabel(product.category)}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
              {product.name}
            </h1>

            <div className="mb-2">
              <p className="text-4xl font-bold text-primary">
                {displayPrice(product.price)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">
                수량
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-10 text-center font-semibold">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {product.status === "ON_SALE" ? (
              <div className="flex gap-3">
                <div className="flex flex-1 gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 h-12 bg-transparent"
                    onClick={() => {}}
                  >
                    일반 구매
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 h-12 bg-transparent"
                    onClick={() => {
                      const cartItem = {
                        id: product.id?.toString() || id,
                        name: product.name,
                        price: product.price,
                        quantity,
                        thumbnailUrl: product.thumbnailUrl,
                      }
                      if (typeof window !== "undefined") {
                        const prev = localStorage.getItem("mockCart")
                        let parsed: any[] = []
                        if (prev) {
                          try {
                            parsed = JSON.parse(prev)
                          } catch {
                            parsed = []
                          }
                        }
                        const existingIndex = parsed.findIndex(
                          (item) => item.id === cartItem.id
                        )
                        if (existingIndex >= 0) {
                          parsed[existingIndex].quantity =
                            (parsed[existingIndex].quantity || 0) + quantity
                        } else {
                          parsed.push(cartItem)
                        }
                        localStorage.setItem("mockCart", JSON.stringify(parsed))
                      }
                    }}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    장바구니
                  </Button>
                </div>
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
            ) : (
              <Card className="p-6 bg-destructive/10 border-destructive/30 text-destructive text-base font-semibold">
                현재 판매 중이 아닙니다.
              </Card>
            )}

            {showSubscriptionForm && (
              <SubscriptionForm
                product={product}
                onClose={() => setShowSubscriptionForm(false)}
              />
            )}
          </div>
        </div>
        <div className="mt-12">
          <Card className="p-6 md:p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              상세 정보
            </h3>
            <p className="text-foreground leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
            {isLoading && (
              <p className="text-sm text-muted-foreground mt-2">
                불러오는 중...
              </p>
            )}
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </Card>
        </div>
      </div>
    </main>
  )
}
