"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"
import MyInfoTab from "@/components/dashboard/my-info-tab"
import WalletTab from "@/components/dashboard/wallet-tab"
import SubscriptionsTab from "@/components/dashboard/subscriptions-tab"
import MyShopsTab from "@/components/dashboard/my-shops-tab"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("info")

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header onCartClick={() => {}} onMyPageClick={() => {}} onLoginClick={() => {}} />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">대시보드</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="info">내 정보</TabsTrigger>
              <TabsTrigger value="wallet">지갑</TabsTrigger>
              <TabsTrigger value="subscriptions">구독 관리</TabsTrigger>
              <TabsTrigger value="shops">내 상점</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <MyInfoTab />
            </TabsContent>

            <TabsContent value="wallet">
              <WalletTab />
            </TabsContent>

            <TabsContent value="subscriptions">
              <SubscriptionsTab />
            </TabsContent>

            <TabsContent value="shops">
              <MyShopsTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
