import { Suspense } from "react"
import Link from "next/link"
import { getAccounts } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, CreditCard, Wallet, Building } from "lucide-react"

async function AccountsList() {
  try {
    const accounts = await getAccounts()

    const getAccountIcon = (type) => {
      switch (type.toLowerCase()) {
        case "credit":
          return <CreditCard className="h-5 w-5" />;
        case "bank":
          return <Building className="h-5 w-5" />;
        default:
          return <Wallet className="h-5 w-5" />;
      }
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.length > 0 ? (
          accounts.map((account, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{account.name}</CardTitle>
                {getAccountIcon(account.type)}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${account.balance.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground capitalize">{account.type} Account</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex h-[200px] items-center justify-center">
            <p className="text-muted-foreground">No accounts found. Add your first account.</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching accounts:", error)
    return (
      <div className="flex flex-col items-center justify-center h-[200px]">
        <p className="text-muted-foreground">Failed to load accounts</p>
      </div>
    );
  }
}

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground">Manage your financial accounts</p>
        </div>
        <Link href="/dashboard/accounts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Account
          </Button>
        </Link>
      </div>
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        }>
        <AccountsList />
      </Suspense>
    </div>
  );
}

