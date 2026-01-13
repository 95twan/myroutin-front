"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { productApi } from "@/lib/api/product"
import { reviewApi, type ReviewDetailInfo } from "@/lib/api/review"
import { getImageUrl } from "@/lib/image"

export default function MyReviewsTab() {
  const [reviews, setReviews] = useState<ReviewDetailInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [productPreviews, setProductPreviews] = useState<
    Record<string, { name: string; thumbnailKey: string }>
  >({})
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null)
  const [editRating, setEditRating] = useState(0)
  const [editBody, setEditBody] = useState("")
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await reviewApi.getMyReviews()
        setReviews(data?.content ?? [])
      } catch (err: any) {
        setError(err?.message || "내 리뷰를 불러오지 못했습니다.")
        setReviews([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviews()
  }, [])

  useEffect(() => {
    const missingProductIds = Array.from(
      new Set(
        reviews
          .map((review) => review.productId)
          .filter((id) => id && !productPreviews[id])
      )
    )

    if (missingProductIds.length === 0) return

    const fetchProducts = async () => {
      const entries = await Promise.all(
        missingProductIds.map(async (productId) => {
          try {
            const product = await productApi.getProductDetail(productId)
            return [
              productId,
              {
                name: product?.name || "상품",
                thumbnailKey: product?.thumbnailKey || "",
              },
            ] as const
          } catch {
            return null
          }
        })
      )

      const next = entries.filter(
        (entry): entry is readonly [string, { name: string; thumbnailKey: string }] =>
          !!entry
      )

      if (next.length > 0) {
        setProductPreviews((prev) => {
          const updated = { ...prev }
          next.forEach(([id, data]) => {
            updated[id] = data
          })
          return updated
        })
      }
    }

    fetchProducts()
  }, [reviews, productPreviews])

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, index) => (
      <span
        key={`my-review-star-${index}`}
        className={index < rating ? "text-yellow-500" : "text-muted-foreground/40"}
      >
        ★
      </span>
    ))

  const renderEditableStars = (rating: number, onSelect: (value: number) => void) =>
    Array.from({ length: 5 }, (_, index) => {
      const value = index + 1
      return (
        <button
          key={`my-review-edit-star-${value}`}
          type="button"
          className={`cursor-pointer ${
            value <= rating ? "text-yellow-500" : "text-muted-foreground/40"
          }`}
          onClick={() => onSelect(value)}
          aria-label={`별점 ${value}점`}
        >
          ★
        </button>
      )
    })

  const formatDate = (value: string) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleDateString("ko-KR")
  }

  const startEdit = (review: ReviewDetailInfo) => {
    setEditingReviewId(review.reviewId)
    setEditRating(review.rating)
    setEditBody(review.body)
    setActionError(null)
  }

  const cancelEdit = () => {
    setEditingReviewId(null)
    setEditRating(0)
    setEditBody("")
    setActionError(null)
  }

  const handleSaveEdit = async (reviewId: string) => {
    if (editRating < 1 || editRating > 5) {
      setActionError("별점을 선택해주세요.")
      return
    }
    if (!editBody.trim()) {
      setActionError("리뷰 내용을 입력해주세요.")
      return
    }
    setActionLoadingId(reviewId)
    setActionError(null)
    try {
      await reviewApi.modifyReview(reviewId, {
        rating: editRating,
        body: editBody.trim(),
      })
      setReviews((prev) =>
        prev.map((review) =>
          review.reviewId === reviewId
            ? { ...review, rating: editRating, body: editBody.trim() }
            : review
        )
      )
      cancelEdit()
    } catch (err: any) {
      setActionError(err?.message || "리뷰 수정에 실패했습니다.")
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleDelete = async (reviewId: string) => {
    if (!confirm("리뷰를 삭제하시겠습니까?")) return
    setActionLoadingId(reviewId)
    setActionError(null)
    try {
      await reviewApi.deleteReview(reviewId)
      setReviews((prev) => prev.filter((review) => review.reviewId !== reviewId))
      if (editingReviewId === reviewId) {
        cancelEdit()
      }
    } catch (err: any) {
      setActionError(err?.message || "리뷰 삭제에 실패했습니다.")
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <div className="space-y-4">
      {isLoading && (
        <Card className="p-6 text-sm text-muted-foreground">
          리뷰를 불러오는 중입니다...
        </Card>
      )}
      {error && (
        <Card className="p-6 text-sm text-red-600">{error}</Card>
      )}
      {!isLoading && !error && reviews.length === 0 && (
        <Card className="p-6 text-sm text-muted-foreground">
          등록된 리뷰가 없습니다.
        </Card>
      )}
      {!isLoading && !error && reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <Card
              key={
                review.reviewId
                  ? `my-review-${review.reviewId}`
                  : `my-review-${index}`
              }
              className="p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      getImageUrl(productPreviews[review.productId]?.thumbnailKey) ||
                      "/placeholder.svg"
                    }
                    alt={productPreviews[review.productId]?.name || "상품"}
                    className="w-14 h-14 rounded-md object-contain bg-white border border-border/60"
                  />
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">상품</p>
                    <p className="font-semibold text-foreground">
                      {productPreviews[review.productId]?.name || "상품"}
                    </p>
                    <Link
                      href={`/product/${review.productId}`}
                      className="text-primary hover:underline text-sm"
                    >
                      상품 보기
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  {editingReviewId === review.reviewId
                    ? renderEditableStars(editRating, setEditRating)
                    : renderStars(review.rating)}
                </div>
              </div>

              <div className="flex items-start justify-between gap-3 mt-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">
                      {review.nickname || "나"}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  좋아요 {review.likeCount}
                </span>
              </div>
              {editingReviewId === review.reviewId ? (
                <textarea
                  className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  rows={2}
                  value={editBody}
                  onChange={(event) => setEditBody(event.target.value)}
                  placeholder="리뷰 내용을 입력해주세요."
                />
              ) : (
                <p className="text-sm text-foreground mt-2 leading-relaxed whitespace-pre-line">
                  {review.body}
                </p>
              )}
              {editingReviewId === review.reviewId && actionError && (
                <p className="text-sm text-destructive mt-1.5">{actionError}</p>
              )}
              <div className="flex flex-wrap justify-end gap-2 mt-3">
                {editingReviewId === review.reviewId ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={cancelEdit}
                      disabled={actionLoadingId === review.reviewId}
                    >
                      취소
                    </Button>
                    <Button
                      onClick={() => handleSaveEdit(review.reviewId)}
                      disabled={actionLoadingId === review.reviewId}
                    >
                      {actionLoadingId === review.reviewId
                        ? "저장 중..."
                        : "저장"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => startEdit(review)}
                      disabled={actionLoadingId === review.reviewId}
                    >
                      수정
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDelete(review.reviewId)}
                      disabled={actionLoadingId === review.reviewId}
                    >
                      {actionLoadingId === review.reviewId
                        ? "삭제 중..."
                        : "삭제"}
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
