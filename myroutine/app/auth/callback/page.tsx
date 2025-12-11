"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { authApi, apiClient } from "@/lib/api-client"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function OAuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const provider = localStorage.getItem("login_provider")
        const code = searchParams.get("code")

        if (!provider || !code) {
          throw new Error("OAuth 정보가 없습니다")
        }

        const response = await authApi.oauthLogin(provider, code)

        // 응답에 accessToken이 있으면 기존 회원 (로그인)
        if (response.loginStatus === "SUCCESS" && response.accessToken) {
          apiClient.setAccessToken(response.accessToken)

          // 토큰 저장 (localStorage 또는 cookie)
          localStorage.setItem("accessToken", response.accessToken)
          if (response.refreshToken) {
            localStorage.setItem("refreshToken", response.refreshToken)
          }
          window.dispatchEvent(new Event("auth-changed"))

          router.push("/")
        }
        // temporaryToken이 있으면 신규 회원 (회원가입 필요)
        else if (
          response.loginStatus === "NEW_MEMBER" &&
          response.temporaryToken
        ) {
          sessionStorage.setItem("temporaryToken", response.temporaryToken)

          // 회원가입 페이지로 이동
          router.push("/auth/signup")
        } else {
          throw new Error("알 수 없는 응답입니다")
        }
      } catch (err: any) {
        console.error("[v0] OAuth callback error:", err)
        setError(err.message || "OAuth 처리 중 오류가 발생했습니다")
        setIsLoading(false)
      }
    }
    if (searchParams.get("code")) {
      handleOAuthCallback()
    }
  }, [searchParams, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <div className="p-8 text-center">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-foreground font-bold text-lg">
                M
              </span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              처리 중...
            </h1>
            <p className="text-muted-foreground">
              OAuth 인증을 처리하고 있습니다
            </p>
            <div className="mt-6 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <div className="p-8">
            <Link
              href="/"
              className="flex items-center gap-2 mb-8 justify-center"
            >
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  M
                </span>
              </div>
              <span className="font-bold text-xl text-foreground">
                MyRoutine
              </span>
            </Link>

            <h1 className="text-2xl font-bold text-foreground mb-2 text-center">
              오류 발생
            </h1>
            <p className="text-red-600 text-center mb-6">{error}</p>

            <Link href="/login" className="block">
              <button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg">
                다시 시도
              </button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return null
}
