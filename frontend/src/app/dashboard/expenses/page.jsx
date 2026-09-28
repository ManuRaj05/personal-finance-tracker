import { Suspense } from "react"
import Link from "next/link"
import { getExpenses } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, ArrowDownCircle } from "lucide-react"

async function ExpensesList() {
  try {
    const expenses = await getExpenses()

    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense History</CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length > 0 ? (
            <div className="space-y-4">
              {expenses.map((expense, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full p-2 bg-red-100">
                      <ArrowDownCircle className="h-4 w-4 text-red-500" />
                    </div>
                    <div>
                      <p className="font-medium">{expense.category}</p>
                      <p className="text-sm text-muted-foreground">{new Date(expense.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-lg font-medium text-red-500">-${expense.amount.toFixed(2)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-[200px] items-center justify-center">
              <p className="text-muted-foreground">No expense records found. Add your first expense.</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  } catch (error) {
    console.error("Error fetching expenses:", error)
    return (
      <div className="flex flex-col items-center justify-center h-[200px]">
        <p className="text-muted-foreground">Failed to load expense data</p>
      </div>
    );
  }
}

export default function ExpensesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">Track and manage your expenses</p>
        </div>
        <Link href="/dashboard/expenses/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </Link>
      </div>
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        }>
        <ExpensesList />
      </Suspense>
    </div>
  );
}

