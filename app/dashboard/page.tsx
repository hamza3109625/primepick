import { DashboardLayout } from "@/components/dashboard-layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Users, Mail, FolderOpen, TrendingUp } from "lucide-react"

const stats = [
  { title: "Total Users", value: "2,847", change: "+12%", icon: Users },
  { title: "Emails Sent", value: "14,203", change: "+8%", icon: Mail },
  { title: "Files Stored", value: "1,429", change: "+23%", icon: FolderOpen },
  { title: "Growth Rate", value: "18.2%", change: "+4%", icon: TrendingUp },
]

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-[#0E325D]">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-[#0E325D]/60">
            Welcome back! Here&apos;s an overview of your system.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card
              key={stat.title}
              className="bg-white border border-[#EEFBFF] shadow-sm"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#0E325D]/70">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-[#007CFC]" />
              </CardHeader>

              <CardContent>
                <div className="text-2xl font-bold text-[#0E325D]">
                  {stat.value}
                </div>
                <p className="mt-1 text-xs text-[#007CFC]">
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom section */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Recent Activity */}
          <Card className="bg-white border border-[#EEFBFF] shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#0E325D]">
                Recent Activity
              </CardTitle>
              <CardDescription className="text-[#0E325D]/60">
                Latest actions in your system
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "New user registered", time: "2 minutes ago", icon: Users },
                  { action: "Email campaign sent", time: "15 minutes ago", icon: Mail },
                  { action: "Files uploaded", time: "1 hour ago", icon: FolderOpen },
                  { action: "User permissions updated", time: "3 hours ago", icon: Users },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="h-9 w-9 rounded-lg bg-[#EEFBFF] flex items-center justify-center">
                      <item.icon className="h-4 w-4 text-[#007CFC]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0E325D]">
                        {item.action}
                      </p>
                      <p className="text-xs text-[#0E325D]/60">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white border border-[#EEFBFF] shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#0E325D]">
                Quick Actions
              </CardTitle>
              <CardDescription className="text-[#0E325D]/60">
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Add User", icon: Users , href: "/users/create-user" },
                  { label: "Send Email", icon: Mail },
                  { label: "Upload File", icon: FolderOpen , href: "/file/upload" },
                  { label: "View Reports", icon: TrendingUp },
                ].map((action, index) => (
                  <button
                    key={index}
                    className="
                      flex items-center gap-3 p-3 rounded-lg
                      bg-[#EEFBFF]
                      hover:bg-[#007CFC]/10
                      transition-colors text-left
                    "
                  >
                    <action.icon className="h-4 w-4 text-[#007CFC]" />
                    <span className="text-sm font-medium text-[#0E325D]">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
