"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pause, Play, Trash2 } from "lucide-react"

interface Subscription {
  id: string
  productName: string
  productImage: string
  price: number
  status: "ACTIVE" | "PAUSED" | "CANCELLED"
  nextRunDate: string
  recurrenceType: "WEEKLY" | "MONTHLY"
  daysOfWeek?: number[]
  dayOfMonth?: number
}

export default function SubscriptionsTab() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: "1",
      productName: "프리미엄 샐러드 구독",
      productImage: "/vibrant-mixed-salad.png",
      price: 8900,
      status: "ACTIVE",
      nextRunDate: "2024-01-20",
      recurrenceType: "WEEKLY",
      daysOfWeek: [1, 3, 5],
    },
    {
      id: "2",
      productName: "유기농 요거트 세트",
      productImage: "/creamy-yogurt-bowl.png",
      price: 12900,
      status: "PAUSED",
      nextRunDate: "2024-02-01",
      recurrenceType: "MONTHLY",
      dayOfMonth: 1,
    },
    {
      id: "3",
      productName: "프리미엄 커피 원두",
      productImage: "/steaming-coffee-cup.png",
      price: 15000,
      status: "ACTIVE",
      nextRunDate: "2024-01-25",
      recurrenceType: "WEEKLY",
      daysOfWeek: [2, 4],
    },
  ])

  const handlePause = (id: string) => {
    setSubscriptions((prev) => prev.map((sub) => (sub.id === id ? { ...sub, status: "PAUSED" } : sub)))
    alert("구독이 일시정지되었습니다!")
  }

  const handleResume = (id: string) => {
    setSubscriptions((prev) => prev.map((sub) => (sub.id === id ? { ...sub, status: "ACTIVE" } : sub)))
    alert("구독이 재개되었습니다!")
  }

  const handleCancel = (id: string) => {
    if (confirm("정말 구독을 해지하시겠습니까?")) {
      setSubscriptions((prev) => prev.map((sub) => (sub.id === id ? { ...sub, status: "CANCELLED" } : sub)))
      alert("구독이 해지되었습니다!")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800"
      case "PAUSED":
        return "bg-yellow-100 text-yellow-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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
      {subscriptions.map((sub) => (
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
                  <h3 className="text-xl font-bold text-foreground">{sub.productName}</h3>
                  <Badge className={getStatusColor(sub.status)}>{getStatusLabel(sub.status)}</Badge>
                </div>
                <p className="text-2xl font-bold text-primary">₩{sub.price.toLocaleString()}</p>
              </div>

              {/* Subscription Details */}
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-6">
                <div>
                  <p className="font-bold text-foreground">배송 주기</p>
                  <p>
                    {sub.recurrenceType === "WEEKLY" ? "주간" : "월간"}
                    {sub.recurrenceType === "WEEKLY" &&
                      ` (${sub.daysOfWeek?.map((d) => ["월", "화", "수", "목", "금", "토", "일"][d - 1]).join(", ")})`}
                    {sub.recurrenceType === "MONTHLY" && ` (${sub.dayOfMonth}일)`}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-foreground">다음 배송</p>
                  <p>{sub.nextRunDate}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap">
                {sub.status === "ACTIVE" && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => handlePause(sub.id)} className="gap-2">
                      <Pause className="w-4 h-4" />
                      일시정지
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancel(sub.id)}
                      className="gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                      해지
                    </Button>
                  </>
                )}
                {sub.status === "PAUSED" && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => handleResume(sub.id)} className="gap-2">
                      <Play className="w-4 h-4" />
                      재개
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancel(sub.id)}
                      className="gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                      해지
                    </Button>
                  </>
                )}
                {sub.status === "CANCELLED" && <p className="text-muted-foreground italic">해지된 구독입니다</p>}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
