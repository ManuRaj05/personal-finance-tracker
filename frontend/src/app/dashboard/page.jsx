import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, CreditCard, ArrowDownCircle, ArrowUpCircle, Loader2 } from "lucide-react"
import { getAccounts, getIncomes, getExpenses, getSavings } from "@/lib/api"

async function DashboardContent() {
  try {
    const [accounts, incomes, expenses, savings] = await Promise.all([
      getAccounts(),
      getIncomes(),
      getExpenses(),
      getSavings(),
    ])

    // Calculate totals
    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0)
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const totalSavings = savings.reduce((sum, saving) => sum + saving.amount, 0)

    // Get recent transactions (combine and sort incomes and expenses)
    const recentTransactions = [
      ...incomes.map((income) => ({
        type: "income",
        amount: income.amount,
        description: income.source,
        date: new Date(income.date),
      })),
      ...expenses.map((expense) => ({
        type: "expense",
        amount: expense.amount,
        description: expense.category,
        date: new Date(expense.date),
      })),
    ]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5)

    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalBalance.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Across all accounts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <ArrowUpCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalIncome.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">All time income</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <ArrowDownCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">All time expenses</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSavings.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Across all savings goals</p>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="recent">Recent Transactions</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Income vs Expenses</CardTitle>
                  <CardDescription>Your financial balance for the current period</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="flex items-center justify-center h-60">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-8">
                        <div className="flex flex-col items-center">
                          <div className="text-2xl font-bold text-green-500">${totalIncome.toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">Income</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="text-2xl font-bold text-red-500">${totalExpenses.toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">Expenses</div>
                        </div>
                      </div>
                     <div className="mt-4 w-full max-w-xs">
                    <div className="flex h-4 w-full overflow-hidden rounded-full">
                      {totalIncome + totalExpenses > 0 && (
                        <>
                          <div
                            className="h-4 bg-green-500"
                            style={{
                              width: `${(totalIncome / (totalIncome + totalExpenses)) * 100}%`,
                            }}
                          />
                          <div
                            className="h-4 bg-red-500"
                            style={{
                              width: `${(totalExpenses / (totalIncome + totalExpenses)) * 100}%`,
                            }}
                          />
                        </>
                      )}
                    </div>
                    </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Savings Progress</CardTitle>
                  <CardDescription>Track your progress towards savings goals</CardDescription>
                </CardHeader>
                <CardContent>
                  {savings.length > 0 ? (
                    <div className="space-y-4">
                      {savings.slice(0, 3).map((saving, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{saving.goal}</div>
                            <div className="text-sm text-muted-foreground">${saving.amount.toFixed(2)}</div>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted">
                            <div className="h-2 rounded-full bg-primary" style={{ width: "40%" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-[140px] items-center justify-center">
                      <p className="text-sm text-muted-foreground">No savings goals yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your most recent financial activities</CardDescription>
              </CardHeader>
              <CardContent>
                {recentTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {recentTransactions.map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`rounded-full p-2 ${transaction.type === "income" ? "bg-green-100" : "bg-red-100"}`}>
                            {transaction.type === "income" ? (
                              <ArrowUpCircle className={`h-4 w-4 text-green-500`} />
                            ) : (
                              <ArrowDownCircle className={`h-4 w-4 text-red-500`} />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{transaction.description}</p>
                            <p className="text-xs text-muted-foreground">{transaction.date.toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div
                          className={`text-sm font-medium ${transaction.type === "income" ? "text-green-500" : "text-red-500"}`}>
                          {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-[200px] items-center justify-center">
                    <p className="text-sm text-muted-foreground">No recent transactions</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
      </div>
    );
  }
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your financial status and recent activities</p>
      </div>
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        }>
        <DashboardContent />
      </Suspense>
    </div>
  );
}

