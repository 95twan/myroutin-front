"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface SubscriptionFormProps {
  product: any
  onClose: () => void
}

const daysOfWeek = [
  { id: 1, label: "월" },
  { id: 2, label: "화" },
  { id: 3, label: "수" },
  { id: 4, label: "목" },
  { id: 5, label: "금" },
  { id: 6, label: "토" },
  { id: 7, label: "일" },
]

const daysOfMonth = Array.from({ length: 28 }, (_, i) => i + 1)

export default function SubscriptionForm({ product, onClose }: SubscriptionFormProps) {
  const [recurrenceType, setRecurrenceType] = useState<"WEEKLY" | "MONTHLY">("WEEKLY")
  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState<number[]>([1, 3])
  const [selectedDayOfMonth, setSelectedDayOfMonth] = useState("1")
  const [quantity, setQuantity] = useState(1)
  const [address, setAddress] = useState("")

  const handleDayOfWeekToggle = (day: number) => {
    setSelectedDaysOfWeek((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: Call API to create subscription
    const subscriptionData = {
      productId: product.id,
      quantity,
      recurrenceType,
      deliveryAddress: address,
      dayOfWeek: recurrenceType === "WEEKLY" ? selectedDaysOfWeek : null,
      dayOfMonth: recurrenceType === "MONTHLY" ? Number.parseInt(selectedDayOfMonth) : null,
    }

    console.log("Subscription data:", subscriptionData)
    alert("구독 신청이 완료되었습니다!")
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg max-h-96 overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">구독 신청</h2>
            <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Product Info */}
            <div className="pb-6 border-b border-border">
              <p className="text-sm text-muted-foreground">상품</p>
              <p className="text-lg font-bold text-foreground">{product.name}</p>
              <p className="text-xl font-bold text-primary mt-2">₩{product.price.toLocaleString()}</p>
            </div>

            {/* Recurrence Type */}
            <div>
              <Label className="text-foreground font-bold mb-3 block">배송 주기</Label>
              <RadioGroup value={recurrenceType} onValueChange={(v) => setRecurrenceType(v as "WEEKLY" | "MONTHLY")}>
                <div className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value="WEEKLY" id="weekly" />
                  <Label htmlFor="weekly" className="cursor-pointer text-foreground">
                    매주
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="MONTHLY" id="monthly" />
                  <Label htmlFor="monthly" className="cursor-pointer text-foreground">
                    매월
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Days Selection */}
            {recurrenceType === "WEEKLY" ? (
              <div>
                <Label className="text-foreground font-bold mb-3 block">배송 요일</Label>
                <div className="grid grid-cols-7 gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => handleDayOfWeekToggle(day.id)}
                      className={`py-2 px-3 rounded-md font-bold text-sm transition-colors ${
                        selectedDaysOfWeek.includes(day.id)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <Label htmlFor="day-of-month" className="text-foreground font-bold mb-3 block">
                  배송 날짜
                </Label>
                <Select value={selectedDayOfMonth} onValueChange={setSelectedDayOfMonth}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {daysOfMonth.map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {day}일
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Quantity */}
            <div>
              <Label htmlFor="quantity" className="text-foreground font-bold mb-3 block">
                수량
              </Label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-md border border-border hover:bg-muted"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                  className="flex-1 h-10 text-center border border-border rounded-md"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-md border border-border hover:bg-muted"
                >
                  +
                </button>
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <Label htmlFor="address" className="text-foreground font-bold mb-3 block">
                배송지
              </Label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="배송받을 주소를 입력하세요"
                className="w-full h-10 px-3 rounded-md border border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Total Price */}
            <div className="bg-primary/10 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-foreground font-bold">예상 총 비용</span>
                <span className="text-2xl font-bold text-primary">₩{(product.price * quantity).toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{recurrenceType === "WEEKLY" ? "주간" : "월간"} 기준</p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
            >
              구독 신청하기
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
