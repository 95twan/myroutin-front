"use client"

import { ShoppingCart, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { authApi } from "@/lib/api-client"

interface HeaderProps {
  onCartClick: () => void
  onMyPageClick: () => void
  onLoginClick: () => void
}

export default function Header({
  onCartClick,
  onMyPageClick,
  onLoginClick,
}: HeaderProps) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    setIsLoggedIn(!!token)
    setIsLoading(false)
  }, [])

  const handleLogout = async () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    try {
      await authApi.logout()
    } catch (error: any) {
      console.error("Logout error:", error)
    }
    setIsLoggedIn(false)
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">M</span>
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:inline">
              MyRoutine
            </span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Search (Desktop only) */}
            <div className="hidden md:flex items-center gap-2 flex-1 max-w-sm ml-8">
              <input
                type="text"
                placeholder="상품 검색..."
                className="flex-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Icons */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onCartClick}
              className="text-foreground hover:text-primary"
            >
              <ShoppingCart className="w-5 h-5" />
            </Button>

            {!isLoading && isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push("/dashboard")}
                  className="text-foreground hover:text-primary"
                  title="마이페이지"
                >
                  <User className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-foreground hover:text-primary"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  로그아웃
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/login")}
                  className="text-foreground hover:text-primary"
                >
                  로그인
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
