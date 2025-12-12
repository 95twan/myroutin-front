"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { CATEGORY_OPTIONS } from "@/lib/categories"

interface SidebarProps {
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
  priceRange: [number, number]
  onPriceChange: (range: [number, number]) => void
}

export default function Sidebar({ selectedCategory, onCategoryChange, priceRange, onPriceChange }: SidebarProps) {
  return (
    <div className="space-y-6 sticky top-20">
      {/* Category Filter */}
      <Card className="p-6">
        <h3 className="font-bold text-lg text-foreground mb-4">카테고리</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <Checkbox
              id="all-categories"
              checked={selectedCategory === null}
              onCheckedChange={() => onCategoryChange(null)}
            />
            <Label htmlFor="all-categories" className="ml-2 cursor-pointer text-foreground">
              전체
            </Label>
          </div>
          {CATEGORY_OPTIONS.map((cat) => (
            <div key={cat.id} className="flex items-center">
              <Checkbox
                id={cat.id}
                checked={selectedCategory === cat.id}
                onCheckedChange={() => onCategoryChange(selectedCategory === cat.id ? null : cat.id)}
              />
              <Label htmlFor={cat.id} className="ml-2 cursor-pointer text-foreground">
                {cat.label}
              </Label>
            </div>
          ))}
        </div>
      </Card>

      {/* Price Filter */}
      <Card className="p-6">
        <h3 className="font-bold text-lg text-foreground mb-4">가격 범위</h3>
        <div className="space-y-4">
          <Slider
            value={[priceRange[0], priceRange[1]]}
            onValueChange={(value) => {
              onPriceChange([value[0], value[1]])
            }}
            min={0}
            max={100000}
            step={1000}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>₩{priceRange[0].toLocaleString()}</span>
            <span>₩{priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </Card>

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full bg-transparent"
        onClick={() => {
          onCategoryChange(null)
          onPriceChange([0, 100000])
        }}
      >
        필터 초기화
      </Button>
    </div>
  )
}
