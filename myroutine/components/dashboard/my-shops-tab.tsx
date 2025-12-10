"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, Edit2, Trash2 } from "lucide-react"

interface Shop {
  id: string
  name: string
  email: string
  phone: string
  address: string
}

export default function MyShopsTab() {
  const [shops, setShops] = useState<Shop[]>([
    {
      id: "1",
      name: "건강한 밥상",
      email: "shop1@example.com",
      phone: "02-1234-5678",
      address: "서울시 강남구",
    },
    {
      id: "2",
      name: "프리미엄 패션",
      email: "shop2@example.com",
      phone: "02-2345-6789",
      address: "서울시 마포구",
    },
  ])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })

  const handleAddShop = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Call API to create shop
    const newShop: Shop = {
      id: Date.now().toString(),
      ...formData,
    }
    setShops((prev) => [...prev, newShop])
    setFormData({ name: "", email: "", phone: "", address: "" })
    setShowForm(false)
    alert("상점이 등록되었습니다!")
  }

  const handleDeleteShop = (id: string) => {
    if (confirm("정말 상점을 삭제하시겠습니까?")) {
      setShops((prev) => prev.filter((shop) => shop.id !== id))
      alert("상점이 삭제되었습니다!")
    }
  }

  return (
    <div className="space-y-6">
      {/* Add Shop Button */}
      <Button
        onClick={() => setShowForm(true)}
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2"
      >
        <Plus className="w-5 h-5" />새 상점 등록
      </Button>

      {/* Add Shop Form */}
      {showForm && (
        <Card className="p-6 md:p-8 border-primary/20 bg-primary/5">
          <h3 className="text-xl font-bold text-foreground mb-6">새 상점 등록</h3>
          <form onSubmit={handleAddShop} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">상점명 *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="상점명을 입력하세요"
                className="h-10"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">상점 이메일 *</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="shop@example.com"
                className="h-10"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">연락처 *</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="02-1234-5678"
                className="h-10"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">상점 주소 *</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="상점 주소를 입력하세요"
                className="h-10"
                required
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" onClick={() => setShowForm(false)} variant="outline" className="flex-1">
                취소
              </Button>
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                등록하기
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Shops List */}
      <div className="space-y-4">
        {shops.map((shop) => (
          <Card key={shop.id} className="p-6 md:p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">{shop.name}</h3>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Edit2 className="w-4 h-4" />
                  수정
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteShop(shop.id)}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                  삭제
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">이메일</p>
                <p className="font-semibold text-foreground">{shop.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">연락처</p>
                <p className="font-semibold text-foreground">{shop.phone}</p>
              </div>
              <div>
                <p className="text-muted-foreground">주소</p>
                <p className="font-semibold text-foreground">{shop.address}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
