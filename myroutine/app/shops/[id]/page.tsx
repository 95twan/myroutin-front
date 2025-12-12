"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { shopApi, type ShopInfoResponse } from "@/lib/api-client"
import { Mail, Phone, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function ShopDetailPage() {
  const routeParams = useParams<{ id: string }>()
  const id = (routeParams?.id as string) || ""
  const router = useRouter()
  const [shop, setShop] = useState<ShopInfoResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    shopName: "",
    shopEmail: "",
    shopPhoneNumber: "",
    shopAddress: "",
  })

  useEffect(() => {
    const fetchShop = async () => {
      if (!id) return
      setIsLoading(true)
      setError(null)
      try {
        const data = await shopApi.getMyShopDetail(id)
        setShop(data)
        setFormData({
          shopName: data?.shopName || "",
          shopEmail: data?.shopEmail || "",
          shopPhoneNumber: data?.shopPhoneNumber || "",
          shopAddress: data?.shopAddress || "",
        })
      } catch (err: any) {
        setError(err?.message || "상점 정보를 불러오지 못했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchShop()
  }, [id])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!shop) return
    setIsSaving(true)
    setError(null)
    try {
      await shopApi.modifyShop(id, {
        shopName: formData.shopName,
        shopEmail: formData.shopEmail,
        shopPhoneNumber: formData.shopPhoneNumber,
        shopAddress: formData.shopAddress,
      })
      const updated = {
        id: shop.id,
        shopName: formData.shopName,
        shopEmail: formData.shopEmail,
        shopPhoneNumber: formData.shopPhoneNumber,
        shopAddress: formData.shopAddress,
      }
      setShop(updated)
      setIsEditing(false)
    } catch (err: any) {
      setError(err?.message || "상점 정보를 수정하지 못했습니다.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("정말 상점을 삭제하시겠습니까?")) return
    setIsDeleting(true)
    setError(null)
    try {
      await shopApi.deleteShop(id)
      alert("상점이 삭제되었습니다.")
      router.push("/dashboard")
    } catch (err: any) {
      setError(err?.message || "상점 삭제에 실패했습니다.")
    } finally {
      setIsDeleting(false)
    }
  }

  const displayValue = (value: string) =>
    value?.trim() ? value : "등록된 정보가 없습니다."

  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              상점 상세
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              내 상점 정보를 확인하세요
            </p>
          </div>
          <Link href="/dashboard?tab=shops">
            <Button variant="outline">상점 목록으로</Button>
          </Link>
        </div>

        <Card className="p-6 md:p-8 space-y-6">
          {isLoading ? (
            <p className="text-muted-foreground">불러오는 중...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                    {shop?.shopName?.[0] ?? "S"}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">상점명</p>
                    <h2 className="text-xl md:text-2xl font-bold text-foreground">
                      {displayValue(shop?.shopName || "")}
                    </h2>
                    <p className="text-xs text-muted-foreground">ID: {id}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false)
                          if (shop) {
                            setFormData({
                              shopName: shop.shopName,
                              shopEmail: shop.shopEmail,
                              shopPhoneNumber: shop.shopPhoneNumber,
                              shopAddress: shop.shopAddress,
                            })
                          }
                        }}
                        className="gap-2"
                        disabled={isSaving}
                      >
                        취소
                      </Button>
                      <Button onClick={handleSave} className="gap-2" disabled={isSaving}>
                        {isSaving ? "저장 중..." : "저장"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" onClick={handleEdit} className="gap-2">
                        정보 수정
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleDelete}
                        className="gap-2 text-destructive hover:text-destructive"
                        disabled={isDeleting}
                      >
                        {isDeleting ? "삭제 중..." : "삭제"}
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">상점명</p>
                    <Input
                      value={formData.shopName}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, shopName: e.target.value }))
                      }
                      placeholder="상점명을 입력하세요"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-1">이메일</p>
                      <Input
                        value={formData.shopEmail}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, shopEmail: e.target.value }))
                        }
                        placeholder="shop@example.com"
                        type="email"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-1">연락처</p>
                      <Input
                        value={formData.shopPhoneNumber}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            shopPhoneNumber: e.target.value,
                          }))
                        }
                        placeholder="02-1234-5678"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">주소</p>
                    <Input
                      value={formData.shopAddress}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, shopAddress: e.target.value }))
                      }
                      placeholder="상점 주소를 입력하세요"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 bg-muted/40 border-border/60">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">이메일</p>
                    </div>
                    <p className="font-semibold text-foreground">
                      {displayValue(shop?.shopEmail || "")}
                    </p>
                  </Card>
                  <Card className="p-4 bg-muted/40 border-border/60">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">연락처</p>
                    </div>
                    <p className="font-semibold text-foreground">
                      {displayValue(shop?.shopPhoneNumber || "")}
                    </p>
                  </Card>
                  <Card className="p-4 bg-muted/40 border-border/60">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">주소</p>
                    </div>
                    <p className="font-semibold text-foreground">
                      {displayValue(shop?.shopAddress || "")}
                    </p>
                  </Card>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </main>
  )
}
