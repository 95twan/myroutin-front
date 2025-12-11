"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

interface Order {
  id: string
  productName: string
  productImage: string
  totalPrice: number
  amount: number
}

export default function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      productName: "프리미엄 샐러드 구독",
      productImage: "/vibrant-mixed-salad.png",
      totalPrice: 8900,
      amount: 2,
    },
    {
      id: "2",
      productName: "유기농 요거트 세트",
      productImage: "/creamy-yogurt-bowl.png",
      totalPrice: 12900,
      amount: 1,
    },
    {
      id: "3",
      productName: "프리미엄 커피 원두",
      productImage: "/steaming-coffee-cup.png",
      totalPrice: 15000,
      amount: 3,
    },
  ])

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "활성"
      case "PAUSED":
        return "일시정지"
      case "CANCELLED":
        return "해지"
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      {orders.map((sub) => (
        <Card key={sub.id} className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Product Image */}
            <div className="flex-shrink-0">
              <img
                src={sub.productImage || "/placeholder.svg"}
                alt={sub.productName}
                className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {sub.productName}
                  </h3>
                </div>
                <p className="text-2xl font-bold text-primary">
                  ₩{sub.totalPrice.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
