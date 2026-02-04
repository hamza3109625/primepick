"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
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
import { ChevronsUpDown, Package } from "lucide-react";

// Sample companies
const companies = [
  { id: "1", name: "ABC Corp" },
  { id: "2", name: "XYZ Ltd" },
  { id: "3", name: "123 LLC" },
  { id: "4", name: "DEF Inc" },
  { id: "5", name: "GHI Ltd" },
];

// Sample products
const products = [
  {
    id: "1",
    companyId: "1",
    name: "Product A",
    sku: "SKU-001",
    category: "Electronics",
    price: "$299.99",
    stock: 45,
    status: "Active",
  },
  {
    id: "2",
    companyId: "1",
    name: "Product B",
    sku: "SKU-002",
    category: "Software",
    price: "$149.99",
    stock: 120,
    status: "Active",
  },
  {
    id: "3",
    companyId: "2",
    name: "Product C",
    sku: "SKU-003",
    category: "Hardware",
    price: "$499.99",
    stock: 23,
    status: "Active",
  },
  {
    id: "4",
    companyId: "2",
    name: "Product D",
    sku: "SKU-004",
    category: "Accessories",
    price: "$79.99",
    stock: 0,
    status: "Out of Stock",
  },
  {
    id: "5",
    companyId: "3",
    name: "Product E",
    sku: "SKU-005",
    category: "Electronics",
    price: "$199.99",
    stock: 67,
    status: "Active",
  },
  {
    id: "6",
    companyId: "3",
    name: "Product F",
    sku: "SKU-006",
    category: "Software",
    price: "$99.99",
    stock: 150,
    status: "Active",
  },
  {
    id: "7",
    companyId: "4",
    name: "Product G",
    sku: "SKU-007",
    category: "Hardware",
    price: "$599.99",
    stock: 12,
    status: "Active",
  },
  {
    id: "8",
    companyId: "4",
    name: "Product H",
    sku: "SKU-008",
    category: "Electronics",
    price: "$399.99",
    stock: 5,
    status: "Low Stock",
  },
  {
    id: "9",
    companyId: "5",
    name: "Product I",
    sku: "SKU-009",
    category: "Software",
    price: "$249.99",
    stock: 88,
    status: "Active",
  },
  {
    id: "10",
    companyId: "5",
    name: "Product J",
    sku: "SKU-010",
    category: "Accessories",
    price: "$49.99",
    stock: 200,
    status: "Active",
  },
];

type SortKey = "name" | "sku" | "category" | "price" | "stock" | "status";

export default function ProductsTable() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(8);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);

  // Filter products by selected company
  const filteredProducts = selectedCompanyId
    ? products.filter((product) => product.companyId === selectedCompanyId)
    : [];

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let valA = a[sortKey];
    let valB = b[sortKey];

    // Handle price sorting (remove $ and convert to number)
    if (sortKey === "price") {
      valA = parseFloat(String(valA).replace("$", ""));
      valB = parseFloat(String(valB).replace("$", ""));
    }

    // Handle numeric sorting
    if (typeof valA === "number" && typeof valB === "number") {
      return sortAsc ? valA - valB : valB - valA;
    }

    // Handle string sorting
    const strA = String(valA).toLowerCase();
    const strB = String(valB).toLowerCase();
    if (strA < strB) return sortAsc ? -1 : 1;
    if (strA > strB) return sortAsc ? 1 : -1;
    return 0;
  });

  // Pagination
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedProducts.length / rowsPerPage);

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

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20";
      case "Out of Stock":
        return "bg-red-500/10 text-red-600 hover:bg-red-500/20";
      case "Low Stock":
        return "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header with Company Selector */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">
              View all products by company
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
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Company Selected</h3>
              <p className="text-sm text-muted-foreground">
                Please select a company from the dropdown above to view their products
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
              <p className="text-sm text-muted-foreground">
                This company has no products yet
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    {[
                      { label: "Product Name", key: "name" },
                      { label: "SKU", key: "sku" },
                      { label: "Category", key: "category" },
                      { label: "Price", key: "price" },
                      { label: "Stock", key: "stock" },
                      { label: "Status", key: "status" },
                    ].map((col) => (
                      <TableHead
                        key={col.label}
                        className="cursor-pointer select-none"
                        onClick={() => handleSort(col.key as SortKey)}
                      >
                        <div className="flex items-center gap-1">
                          {col.label}
                          <ChevronsUpDown size={16} />
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {product.sku}
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="font-semibold">
                        {product.price}
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            product.stock === 0
                              ? "text-red-600"
                              : product.stock < 20
                              ? "text-amber-600"
                              : ""
                          }
                        >
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.status === "Active" ? "default" : "outline"
                          }
                          className={getStatusBadgeStyle(product.status)}
                        >
                          {product.status}
                        </Badge>
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
        {selectedCompanyId && filteredProducts.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of{" "}
            {filteredProducts.length} products for{" "}
            <span className="font-medium text-foreground">
              {companies.find((c) => c.id === selectedCompanyId)?.name}
            </span>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}