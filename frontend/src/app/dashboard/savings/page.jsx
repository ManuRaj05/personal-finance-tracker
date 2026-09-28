import { Suspense } from "react"
import Link from "next/link"
import { getSavings } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, PiggyBank } from "lucide-react"

async function SavingsList() {
  try {
    const savings = await getSavings()

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {savings.length > 0 ? (
          savings.map((saving, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{saving.goal}</CardTitle>
                <PiggyBank className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${saving.amount.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Started on {new Date(saving.date).toLocaleDateString()}</p>
                <div className="mt-4 h-2 w-full rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary" style={{ width: "40%" }} />
                </div>
                <p className="mt-2 text-xs text-right text-muted-foreground">40% of goal</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex h-[200px] items-center justify-center">
            <p className="text-muted-foreground">No savings goals found. Create your first savings goal.</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching savings:", error)
    return (
      <div className="flex flex-col items-center justify-center h-[200px]">
        <p className="text-muted-foreground">Failed to load savings data</p>
      </div>
    );
  }
}

export default function SavingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Savings Goals</h1>
          <p className="text-muted-foreground">Track and manage your savings goals</p>
        </div>
        <Link href="/dashboard/savings/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Savings Goal
          </Button>
        </Link>
      </div>
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        }>
        <SavingsList />
      </Suspense>
    </div>
  );
}

