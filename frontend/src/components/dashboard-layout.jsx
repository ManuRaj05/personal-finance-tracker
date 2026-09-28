"use client";
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, CreditCard, DollarSign, Receipt, PiggyBank, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleLogout = () => {
    // Clear the token cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    router.push("/login")
    router.refresh()
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Accounts", href: "/dashboard/accounts", icon: CreditCard },
    { name: "Income", href: "/dashboard/income", icon: DollarSign },
    { name: "Expenses", href: "/dashboard/expenses", icon: Receipt },
    { name: "Savings", href: "/dashboard/savings", icon: PiggyBank },
  ]

  if (!isMounted) return null

  return (
    <div className="flex min-h-screen flex-col">
      <header
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">Expense Tracker</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    pathname === item.href ? "text-foreground" : "text-foreground/60"
                  )}>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <div className="px-7">
                <Link
                  href="/dashboard"
                  className="flex items-center"
                  onClick={() => setIsOpen(false)}>
                  <span className="font-bold">Expense Tracker</span>
                </Link>
              </div>
              <div className="mt-8 flex flex-col gap-4 px-7">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 text-base font-medium",
                      pathname === item.href ? "text-foreground" : "text-foreground/60"
                    )}>
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
                <Button variant="ghost" className="justify-start px-2" onClick={handleLogout}>
                  <LogOut className="mr-2 h-5 w-5" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <Button variant="ghost" onClick={handleLogout} className="hidden md:flex">
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">{children}</main>
    </div>
  );
}

