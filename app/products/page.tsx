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
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  ChevronsUpDown,
  Package,
  Eye,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { format } from "date-fns";

type SortKey = "name" | "shortCode" | "longCode" | "status" | "createDate";

export default function ProductsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(8);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);

  // Fetch products from API with pagination
  const { data, isLoading, error } = useProducts({
    page: currentPage - 1,
    size: rowsPerPage,
    sortBy: sortKey,
    direction: sortAsc ? "asc" : "desc",
  });

  const products = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    return status === "ACTIVE"
      ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
      : "bg-red-500/10 text-red-600 hover:bg-red-500/20";
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalElements);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">
              Manage and view all products
            </p>
          </div>

          {/* Add Product Dialog can go here */}
          {/* <AddProductDialog /> */}
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Loader2 className="h-12 w-12 text-muted-foreground mb-4 animate-spin" />
              <h3 className="text-lg font-semibold mb-2">Loading Products</h3>
              <p className="text-sm text-muted-foreground">
                Please wait while we fetch the data
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Error Loading Products
              </h3>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error
                  ? error.message
                  : "Something went wrong"}
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
              <p className="text-sm text-muted-foreground">
                No products have been added yet
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    {[
                      { label: "Product Name", key: "name" },
                      { label: "Short Code", key: "shortCode" },
                      { label: "Long Code", key: "longCode" },
                      { label: "Created Date", key: "createDate" },
                      { label: "Status", key: "status" },
                      { label: "Actions", key: "" },
                    ].map((col) => (
                      <TableHead
                        key={col.label}
                        className={col.key ? "cursor-pointer select-none" : ""}
                        onClick={() =>
                          col.key && handleSort(col.key as SortKey)
                        }
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
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Package size={16} className="text-primary" />
                          </div>
                          <div>
                            <span className="font-medium text-foreground block">
                              {product.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {product.description}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {product.shortCode}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {product.longCode}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(product.createDate)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.status === "ACTIVE" ? "default" : "outline"
                          }
                          className={getStatusBadgeStyle(product.status)}
                        >
                          {product.status}
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
        {!isLoading && !error && products.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {endIndex} of {totalElements} products
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}