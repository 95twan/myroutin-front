"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Truck, FileText, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"

interface Order {
  id: string
  productName: string
  productImage: string
  totalPrice: number
  amount: number
  date: string
}

export default function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      productName: "프리미엄 샐러드 구독",
      productImage: "/vibrant-mixed-salad.png",
      totalPrice: 8900,
      amount: 2,
      date: "2024-01-15",
    },
    {
      id: "2",
      productName: "유기농 요거트 세트",
      productImage: "/creamy-yogurt-bowl.png",
      totalPrice: 12900,
      amount: 1,
      date: "2024-01-10",
    },
    {
      id: "3",
      productName: "프리미엄 커피 원두",
      productImage: "/steaming-coffee-cup.png",
      totalPrice: 15000,
      amount: 3,
      date: "2024-01-05",
    },
  ])

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.id} className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Product Image */}
            <div className="flex-shrink-0">
              <img
                src={order.productImage || "/placeholder.svg"}
                alt={order.productName}
                className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground mb-1">
                    {order.date}
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {order.productName}
                  </h3>
                </div>
                <p className="text-2xl font-bold text-primary">
                  ₩{order.totalPrice.toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-foreground">수량:</span>{" "}
                  {order.amount}개
                </div>
                <div className="h-3 w-px bg-border" />
                <div className="flex items-center gap-1">
                  <span className="font-medium text-foreground">주문번호:</span>{" "}
                  {order.id.padStart(8, "0")}
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" className="gap-2">
                  <Truck className="w-4 h-4" />
                  배송조회
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <FileText className="w-4 h-4" />
                  구매내역서
                </Button>
                <Button variant="ghost" size="sm" className="gap-1 ml-auto">
                  상세보기 <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
