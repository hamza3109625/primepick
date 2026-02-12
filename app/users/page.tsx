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

export default function UsersTable() {
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<SortKey>("username");
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>(undefined);

  // Fetch companies for the dropdown
  const { data: companies, isLoading: isLoadingCompanies } = useCompanies();

  // Fetch users — reset to page 0 whenever the company filter changes
  const { data, isLoading, isError, error } = useUsers(
    currentPage,
    rowsPerPage,
    selectedCompanyId,
  );

  const handleCompanyChange = (value: string) => {
    setCurrentPage(0); // reset pagination on filter change
    setSelectedCompanyId(value === "all" ? undefined : Number(value));
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  // Sort the users client-side
  const sortedUsers = data?.content
    ? [...data.content].sort((a, b) => {
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
      })
    : [];

  const getDisplayName = (user: NonNullable<typeof data>["content"][0]) => {
    const parts = [user.firstName, user.middleName, user.lastName].filter(Boolean);
    return parts.length > 0 ? parts.join(" ") : user.username;
  };

  const getDisplayAddress = (user: NonNullable<typeof data>["content"][0]) => {
    const parts = [user.address, user.city, user.state, user.zipCode].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "N/A";
  };

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
      <div className="rounded-lg border bg-card p-4">

        {/* Company filter */}
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
          <Select
            value={selectedCompanyId !== undefined ? String(selectedCompanyId) : "all"}
            onValueChange={handleCompanyChange}
            disabled={isLoadingCompanies}
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Filter by company…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All companies</SelectItem>
              {companies?.map((company) => (
                <SelectItem key={company.id} value={String(company.id)}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Live count badge */}
          {data && (
            <span className="text-sm text-muted-foreground ml-auto">
              {data.totalElements} user{data.totalElements !== 1 ? "s" : ""}
              {selectedCompanyId !== undefined && (
                <> in {companies?.find((c) => c.id === selectedCompanyId)?.name ?? "selected company"}</>
              )}
            </span>
          )}
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : !data || data.empty ? (
          <div className="text-center text-muted-foreground py-16">
            {selectedCompanyId !== undefined
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
                {sortedUsers.map((user) => (
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
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(data.number ?? 0) * (data.size ?? rowsPerPage) + 1} to{" "}
                {Math.min(
                  ((data.number ?? 0) + 1) * (data.size ?? rowsPerPage),
                  data.totalElements ?? 0,
                )}{" "}
                of {data.totalElements ?? 0} users
              </div>
              <div className="flex gap-2">
                <button
                  disabled={data.first ?? true}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Previous
                </button>
                {Array.from({ length: data.totalPages ?? 0 }, (_, i) => i).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 text-sm rounded border hover:bg-gray-100 ${
                      page === (data.number ?? 0)
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : ""
                    }`}
                  >
                    {page + 1}
                  </button>
                ))}
                <button
                  disabled={data.last ?? true}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3 py-1 text-sm rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}