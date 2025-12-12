"use client"

import { useEffect, useMemo, useState } from "react"
import { Minus, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  thumbnailUrl?: string
}

const MOCK_CART: CartItem[] = [
  {
    id: "1",
    name: "프리미엄 샐러드 구독",
    price: 8900,
    quantity: 2,
    thumbnailUrl: "/salad-subscription.jpg",
  },
  {
    id: "2",
    name: "유기농 요거트 세트",
    price: 12900,
    quantity: 1,
    thumbnailUrl: "/organic-yogurt.jpg",
  },
]

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(MOCK_CART)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = localStorage.getItem("mockCart")
    if (!stored) return
    try {
      const parsed = JSON.parse(stored) as CartItem[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        setItems(parsed)
      }
    } catch {
      setItems(MOCK_CART)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    localStorage.setItem("mockCart", JSON.stringify(items))
  }, [items])

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(items.map((item) => item.id))
    }
  }

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeSelected = () => {
    if (selectedIds.length === 0) return
    setItems((prev) => prev.filter((item) => !selectedIds.includes(item.id)))
    setSelectedIds([])
  }

  const clearAll = () => {
    setItems([])
    setSelectedIds([])
    if (typeof window !== "undefined") {
      localStorage.removeItem("mockCart")
    }
  }

  const allSelected = items.length > 0 && selectedIds.length === items.length

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  )

  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">장바구니</h1>
          <Link href="/" className="text-primary hover:underline text-sm">
            쇼핑 계속하기
          </Link>
        </div>

        {items.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="text-muted-foreground mb-4">
              장바구니가 비어 있어요. 마음에 드는 상품을 추가해보세요!
            </p>
            <Link href="/">
              <Button variant="outline">상품 둘러보기</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 divide-y divide-border">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="select-all"
                    checked={allSelected}
                    onCheckedChange={toggleSelectAll}
                  />
                  <label
                    htmlFor="select-all"
                    className="text-sm text-foreground cursor-pointer"
                  >
                    전체 선택 ({selectedIds.length}/{items.length})
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={removeSelected}
                    disabled={selectedIds.length === 0}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    선택 삭제
                  </Button>
                  <Button variant="ghost" size="sm" onClick={clearAll}>
                    전체 삭제
                  </Button>
                </div>
              </div>
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4">
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    onCheckedChange={() => toggleSelect(item.id)}
                    aria-label={`${item.name} 선택`}
                  />
                  <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden">
                    <img
                      src={item.thumbnailUrl || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground line-clamp-2">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, -1)}
                        aria-label="수량 감소"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-10 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, 1)}
                        aria-label="수량 증가"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">
                      ₩{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      (개당 ₩{item.price.toLocaleString()})
                    </p>
                  </div>
                </div>
              ))}
            </Card>

            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-bold text-foreground">주문 요약</h2>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">상품 금액</span>
                <span className="font-semibold text-foreground">₩{total.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">배송비</span>
                <span className="font-semibold text-foreground">₩0</span>
              </div>
              <div className="border-t border-border pt-4 flex items-center justify-between text-lg font-bold">
                <span className="text-foreground">총 결제금액</span>
                <span className="text-primary">₩{total.toLocaleString()}</span>
              </div>
              <Button className="w-full h-12">결제하기 (목업)</Button>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
