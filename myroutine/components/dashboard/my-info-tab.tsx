"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Save } from "lucide-react"

export default function MyInfoTab() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "홍길동",
    email: "hong@example.com",
    phone: "010-1234-5678",
    address: "서울시 강남구 역삼동",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    // TODO: Call API to update user info
    console.log("Save user info:", formData)
    alert("정보가 저장되었습니다!")
    setIsEditing(false)
  }

  return (
    <Card className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-foreground">내 정보</h2>
        <Button
          variant={isEditing ? "default" : "outline"}
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="gap-2"
        >
          <Save className="w-4 h-4" />
          {isEditing ? "저장하기" : "수정하기"}
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-foreground mb-2">
            이름
          </label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditing}
            className="h-10"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-foreground mb-2">
            이메일
          </label>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled
            className="h-10"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-foreground mb-2">
            휴대폰 번호
          </label>
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing}
            className="h-10"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-foreground mb-2">
            배송지 주소
          </label>
          <Input
            name="address"
            value={formData.address}
            onChange={handleChange}
            disabled={!isEditing}
            className="h-10"
          />
        </div>

        {isEditing && (
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              onClick={() => setIsEditing(false)}
              variant="outline"
              className="flex-1"
            >
              취소
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              저장하기
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
