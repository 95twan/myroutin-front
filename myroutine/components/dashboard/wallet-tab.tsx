"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, ArrowUp, ArrowDown } from "lucide-react"

interface Transaction {
  id: string
  type: "deposit" | "withdraw"
  amount: number
  description: string
  date: string
}

export default function WalletTab() {
  const [balance, setBalance] = useState(50000)
  const [showChargeModal, setShowChargeModal] = useState(false)
  const [chargeAmount, setChargeAmount] = useState("")
  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "deposit",
      amount: 50000,
      description: "충전",
      date: "2024-01-15",
    },
    {
      id: "2",
      type: "withdraw",
      amount: 8900,
      description: "상품 결제",
      date: "2024-01-14",
    },
    {
      id: "3",
      type: "withdraw",
      amount: 12900,
      description: "상품 결제",
      date: "2024-01-13",
    },
    {
      id: "4",
      type: "deposit",
      amount: 30000,
      description: "환불",
      date: "2024-01-10",
    },
  ])

  const handleCharge = async () => {
    if (!chargeAmount) return

    // TODO: Call API to charge wallet
    const amount = Number.parseInt(chargeAmount)
    console.log("Charge wallet:", amount)
    setBalance((prev) => prev + amount)
    setChargeAmount("")
    setShowChargeModal(false)
    alert("충전이 완료되었습니다!")
  }

  return (
    <div className="space-y-8">
      {/* Balance Card */}
      <Card className="p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
        <p className="text-muted-foreground mb-2">현재 잔액</p>
        <p className="text-5xl font-bold text-primary mb-6">₩{balance.toLocaleString()}</p>
        <Button
          onClick={() => setShowChargeModal(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2"
        >
          <Plus className="w-5 h-5" />
          충전하기
        </Button>
      </Card>

      {/* Charge Modal */}
      {showChargeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm">
            <div className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-6">충전하기</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">충전 금액</label>
                  <Input
                    type="number"
                    value={chargeAmount}
                    onChange={(e) => setChargeAmount(e.target.value)}
                    placeholder="충전할 금액을 입력하세요"
                    className="h-10"
                  />
                </div>

                {/* Preset amounts */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">자주 사용하는 금액</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[10000, 30000, 50000, 100000].map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        size="sm"
                        onClick={() => setChargeAmount(amount.toString())}
                        className="text-xs"
                      >
                        {amount / 1000}만
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={() => setShowChargeModal(false)} variant="outline" className="flex-1">
                    취소
                  </Button>
                  <Button
                    onClick={handleCharge}
                    disabled={!chargeAmount}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    충전하기
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Transaction History */}
      <Card className="p-6 md:p-8">
        <h3 className="text-2xl font-bold text-foreground mb-6">거래 내역</h3>
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-2 rounded-full ${
                    tx.type === "deposit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}
                >
                  {tx.type === "deposit" ? <ArrowDown className="w-5 h-5" /> : <ArrowUp className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-bold text-foreground">{tx.description}</p>
                  <p className="text-sm text-muted-foreground">{tx.date}</p>
                </div>
              </div>
              <p className={`font-bold text-lg ${tx.type === "deposit" ? "text-green-600" : "text-red-600"}`}>
                {tx.type === "deposit" ? "+" : "-"}₩{tx.amount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
