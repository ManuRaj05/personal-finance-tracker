import { Suspense } from "react"
import Link from "next/link"
import { getIncomes } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, ArrowUpCircle } from "lucide-react"

async function IncomeList() {
  try {
    const incomes = await getIncomes()

    return (
      <Card>
        <CardHeader>
          <CardTitle>Income History</CardTitle>
        </CardHeader>
        <CardContent>
          {incomes.length > 0 ? (
            <div className="space-y-4">
              {incomes.map((income, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full p-2 bg-green-100">
                      <ArrowUpCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">{income.source}</p>
                      <p className="text-sm text-muted-foreground">{new Date(income.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-lg font-medium text-green-500">+${income.amount.toFixed(2)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-[200px] items-center justify-center">
              <p className="text-muted-foreground">No income records found. Add your first income.</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  } catch (error) {
    console.error("Error fetching incomes:", error)
    return (
      <div className="flex flex-col items-center justify-center h-[200px]">
        <p className="text-muted-foreground">Failed to load income data</p>
      </div>
    );
  }
}

export default function IncomePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Income</h1>
          <p className="text-muted-foreground">Track and manage your income sources</p>
        </div>
        <Link href="/dashboard/income/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Income
          </Button>
        </Link>
      </div>
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        }>
        <IncomeList />
      </Suspense>
    </div>
  );
}

