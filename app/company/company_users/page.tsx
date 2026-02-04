"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ChevronsUpDown, Users, Eye, Edit, Trash2 } from "lucide-react";

// Sample companies
const companies = [
  { id: "1", name: "ABC Corp" },
  { id: "2", name: "XYZ Ltd" },
  { id: "3", name: "123 LLC" },
  { id: "4", name: "DEF Inc" },
  { id: "5", name: "GHI Ltd" },
  { id: "6", name: "JKL Corp" },
];

// Sample users
const users = [
  {
    id: "1",
    companyId: "1",
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    role: "Admin",
    department: "Engineering",
    phone: "+1 234-567-8901",
    status: "Active",
  },
  {
    id: "2",
    companyId: "1",
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    role: "User",
    department: "Sales",
    phone: "+1 234-567-8902",
    status: "Active",
  },
  {
    id: "3",
    companyId: "2",
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    role: "Manager",
    department: "Marketing",
    phone: "+1 234-567-8903",
    status: "Active",
  },
  {
    id: "4",
    companyId: "2",
    name: "William Kim",
    email: "will@email.com",
    role: "User",
    department: "Support",
    phone: "+1 234-567-8904",
    status: "Inactive",
  },
  {
    id: "5",
    companyId: "3",
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    role: "Admin",
    department: "Engineering",
    phone: "+1 234-567-8905",
    status: "Active",
  },
  {
    id: "6",
    companyId: "3",
    name: "Ethan Hunt",
    email: "ethan.hunt@email.com",
    role: "User",
    department: "Operations",
    phone: "+1 234-567-8906",
    status: "Active",
  },
  {
    id: "7",
    companyId: "4",
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    role: "Manager",
    department: "HR",
    phone: "+1 234-567-8907",
    status: "Active",
  },
  {
    id: "8",
    companyId: "4",
    name: "Liam Brown",
    email: "liam.brown@email.com",
    role: "User",
    department: "Finance",
    phone: "+1 234-567-8908",
    status: "Inactive",
  },
  {
    id: "9",
    companyId: "5",
    name: "Ava Johnson",
    email: "ava.johnson@email.com",
    role: "Admin",
    department: "Engineering",
    phone: "+1 234-567-8909",
    status: "Active",
  },
  {
    id: "10",
    companyId: "5",
    name: "Noah Miller",
    email: "noah.miller@email.com",
    role: "User",
    department: "Sales",
    phone: "+1 234-567-8910",
    status: "Active",
  },
  {
    id: "11",
    companyId: "6",
    name: "Mia Garcia",
    email: "mia.garcia@email.com",
    role: "Manager",
    department: "Marketing",
    phone: "+1 234-567-8911",
    status: "Active",
  },
  {
    id: "12",
    companyId: "6",
    name: "James Martinez",
    email: "james.martinez@email.com",
    role: "User",
    department: "Support",
    phone: "+1 234-567-8912",
    status: "Inactive",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

type SortKey = "name" | "email" | "role" | "department" | "phone" | "status";

export default function UsersTable() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(8);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);

  // Filter users by selected company
  const filteredUsers = selectedCompanyId
    ? users.filter((user) => user.companyId === selectedCompanyId)
    : [];

  // Sorting
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const valA = String(a[sortKey]).toLowerCase();
    const valB = String(b[sortKey]).toLowerCase();
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  // Pagination
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedUsers = sortedUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedUsers.length / rowsPerPage);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const handleCompanyChange = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setCurrentPage(1); // Reset to first page when company changes
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20";
      case "Manager":
        return "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20";
      case "User":
        return "bg-slate-500/10 text-slate-600 hover:bg-slate-500/20";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    return status === "Active"
      ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
      : "bg-red-500/10 text-red-600 hover:bg-red-500/20";
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header with Company Selector */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground">
              View all users by company
            </p>
          </div>
          <div className="w-64">
            <Select value={selectedCompanyId} onValueChange={handleCompanyChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card p-4">
          {!selectedCompanyId ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Company Selected</h3>
              <p className="text-sm text-muted-foreground">
                Please select a company from the dropdown above to view their users
              </p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Users Found</h3>
              <p className="text-sm text-muted-foreground">
                This company has no users yet
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    {[
                      { label: "Username", key: "name" },
                      { label: "Email", key: "email" },
                      { label: "Role", key: "role" },
                      { label: "Department", key: "department" },
                      { label: "Phone", key: "phone" },
                      { label: "Status", key: "status" },
                      { label: "Actions", key: "" },
                    ].map((col) => (
                      <TableHead
                        key={col.label}
                        className={col.key ? "cursor-pointer select-none" : ""}
                        onClick={() => col.key && handleSort(col.key as SortKey)}
                      >
                        <div className="flex items-center gap-1">
                          {col.label}
                          {col.key && <ChevronsUpDown size={16} />}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-muted text-xs">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-foreground">
                            {user.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getRoleBadgeStyle(user.role)}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.phone}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.status === "Active" ? "default" : "outline"}
                          className={getStatusBadgeStyle(user.status)}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <button className="text-blue-500 hover:text-blue-700 transition-colors">
                          <Eye size={16} />
                        </button>
                        <button className="text-green-500 hover:text-green-700 transition-colors">
                          <Edit size={16} />
                        </button>
                        <button className="text-red-500 hover:text-red-700 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-end mt-4 gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="px-3 py-1 rounded border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 text-sm rounded border hover:bg-accent ${
                          page === currentPage
                            ? "bg-primary text-primary-foreground"
                            : ""
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="px-3 py-1 text-sm rounded border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Summary */}
        {selectedCompanyId && filteredUsers.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of{" "}
            {filteredUsers.length} users for{" "}
            <span className="font-medium text-foreground">
              {companies.find((c) => c.id === selectedCompanyId)?.name}
            </span>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}