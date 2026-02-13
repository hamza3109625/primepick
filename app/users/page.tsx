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
import { Eye, Edit, Trash2, ChevronsUpDown, Loader2, Building2 } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { useCompanies } from "@/hooks/useCompanies";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

type SortKey = "username" | "email" | "address" | "active";

const PAGE_SIZE = 10;

export default function UsersTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("username");
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("all");

  // Fetch all companies for the dropdown
  const { data: companies, isLoading: isLoadingCompanies } = useCompanies();

  // Fetch all users at once (no server-side filtering)
  const { data, isLoading, isError, error } = useUsers(
    0,
    1000, // Fetch a large number to get all users
    undefined, // No company filter on the API call
  );

  const allUsers = data?.content ?? [];

  // Apply company filter client-side
  let users = allUsers;
  
  if (selectedCompanyId !== "all") {
    const companyId = Number(selectedCompanyId);
    users = users.filter(user => user.companyId === companyId);
  }

  // Sort the filtered users client-side
  const sortedUsers = [...users].sort((a, b) => {
    let valA: string;
    let valB: string;

    if (sortKey === "active") {
      valA = a.active ? "active" : "inactive";
      valB = b.active ? "active" : "inactive";
    } else {
      valA = (a[sortKey] || "").toLowerCase();
      valB = (b[sortKey] || "").toLowerCase();
    }

    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const totalElements = sortedUsers.length;
  const totalPages = Math.ceil(totalElements / PAGE_SIZE);

  const handleCompanyChange = (value: string) => {
    setSelectedCompanyId(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const getDisplayName = (user: NonNullable<typeof data>["content"][0]) => {
    const parts = [user.firstName, user.middleName, user.lastName].filter(Boolean);
    return parts.length > 0 ? parts.join(" ") : user.username;
  };

  const getDisplayAddress = (user: NonNullable<typeof data>["content"][0]) => {
    const parts = [user.address, user.city, user.state, user.zipCode].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "N/A";
  };

  const getCompanyName = (companyId: number | null) => {
    if (companyId === null) return "No Company";
    const company = companies?.find((c) => c.id === companyId);
    return company?.name || "Unknown";
  };

  // Paginate the sorted and filtered users
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalElements);
  const paginatedUsers = sortedUsers.slice(startIndex, endIndex);

  if (isLoading && !data) {
    return (
      <DashboardLayout>
        <div className="rounded-lg border bg-card p-4 flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-center text-red-500 py-8">
            Error loading users: {error?.message || "Unknown error"}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-2">
            <h1 className="text-2xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground">
              Manage and view all users
            </p>
          </div>
      <div className="rounded-lg border bg-card p-4">

          

        {/* Company filter */}
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
          <Select
            value={selectedCompanyId}
            onValueChange={handleCompanyChange}
            disabled={isLoadingCompanies}
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Filter by company…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All companies</SelectItem>
              {isLoadingCompanies ? (
                <SelectItem value="loading" disabled>
                  Loading companies...
                </SelectItem>
              ) : (
                companies?.map((company) => (
                  <SelectItem key={company.id} value={String(company.id)}>
                    {company.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          {/* Live count badge */}
          <span className="text-sm text-muted-foreground ml-auto">
            {totalElements} user{totalElements !== 1 ? "s" : ""}
            {selectedCompanyId !== "all" && (
              <> in {getCompanyName(selectedCompanyId === "all" ? null : Number(selectedCompanyId))}</>
            )}
          </span>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : paginatedUsers.length === 0 ? (
          <div className="text-center text-muted-foreground py-16">
            {selectedCompanyId !== "all"
              ? "No users found for this company."
              : "No users found."}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  {[
                    { label: "Username", key: "username" },
                    { label: "Email", key: "email" },
                    { label: "Phone", key: null },
                    { label: "Address", key: "address" },
                    { label: "Token Status", key: null },
                    { label: "Status", key: "active" },
                    { label: "Actions", key: null },
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
                            {getInitials(getDisplayName(user))}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">
                          {getDisplayName(user)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || "N/A"}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {getDisplayAddress(user)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.tokenStatus === "ACTIVE" ? "default" : "outline"}
                        className={
                          user.tokenStatus === "ACTIVE"
                            ? "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
                            : "text-muted-foreground"
                        }
                      >
                        {user.tokenStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.active ? "default" : "outline"}
                        className={
                          user.active
                            ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                            : "text-muted-foreground"
                        }
                      >
                        {user.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <button className="text-blue-500 hover:text-blue-700">
                        <Eye size={16} />
                      </button>
                      <button className="text-green-500 hover:text-green-700">
                        <Edit size={16} />
                      </button>
                      <button className="text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {endIndex} of {totalElements} users
                  {selectedCompanyId !== "all" && " for selected company"}
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="px-3 py-1 rounded border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="px-3 py-1 text-sm rounded border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Summary - shown when not paginating */}
        {!isLoading && paginatedUsers.length > 0 && totalPages === 1 && (
          <div className="text-sm text-muted-foreground mt-4">
            Showing {totalElements} user{totalElements !== 1 ? "s" : ""}
            {selectedCompanyId !== "all" && " for selected company"}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}