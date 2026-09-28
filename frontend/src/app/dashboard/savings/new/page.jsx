"use client";
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSaving } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function NewSavingPage() {
  const router = useRouter()
  const [goal, setGoal] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const amountNum = Number.parseFloat(amount)
      if (isNaN(amountNum)) {
        throw new Error("Amount must be a valid number")
      }

      await createSaving({
        goal,
        amount: amountNum,
        date,
      })

      router.push("/dashboard/savings")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add savings goal")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/dashboard/savings" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Savings Goal</h1>
          <p className="text-muted-foreground">Create a new savings goal to track</p>
        </div>
      </div>
      <Card className="max-w-md mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Savings Goal Details</CardTitle>
            <CardDescription>Enter the details of your savings goal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="goal">Goal Name</Label>
              <Input
                id="goal"
                placeholder="e.g. Vacation, Emergency Fund, New Car"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Target Amount</Label>
              <div className="relative">
                <div
                  className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-muted-foreground">$</span>
                </div>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-7"
                  required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Start Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Savings Goal"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

