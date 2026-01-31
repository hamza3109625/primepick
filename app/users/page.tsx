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
import { DashboardLayout } from "@/components/dashboard-layout";
import { Eye, Edit, Trash2, ChevronsUpDown } from "lucide-react";

// Sample users
const users = [
  {
    id: "1",
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    organization: "ABC Corp",
    address: "123 Street",
    product: "Product A",
    status: "Active",
  },
  {
    id: "2",
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    organization: "XYZ Ltd",
    address: "456 Avenue",
    product: "Product B",
    status: "Inactive",
  },
  {
    id: "3",
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    organization: "123 LLC",
    address: "789 Road",
    product: "Product C",
    status: "Active",
  },
  {
    id: "4",
    name: "William Kim",
    email: "will@email.com",
    organization: "DEF Inc",
    address: "12 Road",
    product: "Product D",
    status: "Active",
  },
  {
    id: "5",
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    organization: "GHI Ltd",
    address: "34 Street",
    product: "Product E",
    status: "Inactive",
  },
  {
    id: "6",
    name: "Ethan Hunt",
    email: "ethan.hunt@email.com",
    organization: "JKL Corp",
    address: "56 Avenue",
    product: "Product F",
    status: "Active",
  },
  {
    id: "7",
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    organization: "MNO Inc",
    address: "78 Road",
    product: "Product G",
    status: "Active",
  },
  {
    id: "8",
    name: "Liam Brown",
    email: "liam.brown@email.com",
    organization: "PQR Ltd",
    address: "90 Street",
    product: "Product H",
    status: "Inactive",
  },
  {
    id: "9",
    name: "Ava Johnson",
    email: "ava.johnson@email.com",
    organization: "STU Corp",
    address: "11 Avenue",
    product: "Product I",
    status: "Active",
  },
  {
    id: "10",
    name: "Noah Miller",
    email: "noah.miller@email.com",
    organization: "VWX Ltd",
    address: "22 Road",
    product: "Product J",
    status: "Active",
  },
  {
    id: "11",
    name: "Noah Miller",
    email: "noah.miller@email.com",
    organization: "VWX Ltd",
    address: "22 Road",
    product: "Product J",
    status: "Active",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

type SortKey =
  | "name"
  | "email"
  | "organization"
  | "address"
  | "product"
  | "status";

export default function UsersTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(8);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);

  // Sorting
  const sortedUsers = [...users].sort((a, b) => {
    const valA = a[sortKey].toLowerCase();
    const valB = b[sortKey].toLowerCase();
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  // Pagination
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedUsers = sortedUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(users.length / rowsPerPage);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <DashboardLayout>
      <div className="rounded-lg border bg-card p-4">
        <Table>
          <TableHeader>
            <TableRow>
              {[
                { label: "Username", key: "name" },
                { label: "Email", key: "email" },
                { label: "Organization", key: "organization" },
                { label: "Address", key: "address" },
                { label: "Product", key: "product" },
                { label: "Status", key: "status" },
                { label: "Actions", key: "" },
              ].map((col) => (
                <TableHead
                  key={col.label}
                  className="cursor-pointer select-none"
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
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.organization}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>{user.product}</TableCell>
                <TableCell>
                  <Badge
                    variant={user.status === "Active" ? "default" : "outline"}
                    className={
                      user.status === "Active"
                        ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                        : "text-muted-foreground"
                    }
                  >
                    {user.status}
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
        <div className="flex justify-end mt-4 gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-2 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 text-sm"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 text-sm rounded border hover:bg-gray-100 ${
                page === currentPage ? "bg-blue-500 text-white" : ""
              }`}
            >
              {page}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-2 py-1 text-sm rounded border hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
