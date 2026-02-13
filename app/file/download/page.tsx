"use client";

import { useState } from "react";
import { Download, Loader2, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { presignDownload } from "@/api/file.api";
import { toast } from "sonner";
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
import { useFiles } from "@/hooks/useFile";
import { useCompanies } from "@/hooks/useCompanies";
import { useProducts } from "@/hooks/useProducts";
import { FileParams, FileItem } from "@/api/file.api";
import { DashboardLayout } from "@/components/dashboard-layout";

const PAGE_SIZE = 8;

const formatFileSize = (bytes: string) => {
  const n = Number(bytes);
  if (isNaN(n)) return bytes;
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
};

const statusVariant: Record<
  FileItem["status"],
  "default" | "secondary" | "destructive"
> = {
  UPLOADED: "default",
  PROCESSING: "secondary",
  FAILED: "destructive",
};

const getStatusBadgeStyle = (status: FileItem["status"]) => {
  switch (status) {
    case "UPLOADED":
      return "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20";
    case "PROCESSING":
      return "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20";
    case "FAILED":
      return "bg-red-500/10 text-red-600 hover:bg-red-500/20";
    default:
      return "";
  }
};

type SortKey = "id" | "fileName" | "fileType" | "status" | "fileSize";
type FileType = "COLLECTION" | "REPORT";

export default function FilesTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("all");
  const [selectedProductId, setSelectedProductId] = useState<string>("all");
  const [selectedFileType, setSelectedFileType] = useState<string>("all");

  const { data: companiesData, isLoading: isLoadingCompanies } = useCompanies();
  const companies = companiesData ?? [];

  const { data: productsData, isLoading: isLoadingProducts } = useProducts({
    page: 0,
    size: 1000,
  });
  const products = productsData?.content ?? [];

  const { data, isLoading, isError } = useFiles({
    page: 0,
    size: 1000,
    sortBy: sortKey,
    direction: sortAsc ? "asc" : "desc",
  });

  const allFiles = data?.content ?? [];

  // Apply company, product, and file type filters
  let files = allFiles;
  
  if (selectedCompanyId !== "all") {
    files = files.filter(file => file.companyId === Number(selectedCompanyId));
  }
  
  if (selectedProductId !== "all") {
    files = files.filter(file => file.productId === Number(selectedProductId));
  }

  if (selectedFileType !== "all") {
    files = files.filter(file => file.fileType === selectedFileType);
  }

  const totalElements = files.length;
  const totalPages = Math.ceil(totalElements / PAGE_SIZE);

  const getCompanyName = (companyId: number) => {
    const company = companies.find((c: any) => c.id === companyId);
    return company?.name || "Unknown";
  };

  const getProductShortCode = (productId: number) => {
    const product = products.find((p: any) => p.id === productId);
    return product?.shortCode || "N/A";
  };

  const handleCompanyChange = (value: string) => {
    setSelectedCompanyId(value);
    setCurrentPage(1);
  };

  const handleProductChange = (value: string) => {
    setSelectedProductId(value);
    setCurrentPage(1);
  };

  const handleFileTypeChange = (value: string) => {
    setSelectedFileType(value);
    setCurrentPage(1);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const handleDownload = async (filePath: string) => {
    try {
      const response = await presignDownload(filePath);
      const url = response.data.url;
      window.open(url, "_blank", "noopener,noreferrer");
      toast.success("Download started");
    } catch {
      toast.error("Failed to generate download link. Please try again.");
    }
  };

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalElements);
  const paginatedFiles = files.slice(startIndex, endIndex);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Files</h1>
            <p className="text-muted-foreground">
              Manage and view all uploaded files
            </p>
          </div>

         
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="">
            <Select value={selectedCompanyId} onValueChange={handleCompanyChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {isLoadingCompanies ? (
                  <SelectItem value="loading" disabled>
                    Loading companies...
                  </SelectItem>
                ) : (
                  companies.map((company: any) => (
                    <SelectItem key={company.id} value={String(company.id)}>
                      {company.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="">
            <Select value={selectedProductId} onValueChange={handleProductChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                {isLoadingProducts ? (
                  <SelectItem value="loading" disabled>
                    Loading products...
                  </SelectItem>
                ) : (
                  products.map((product: any) => (
                    <SelectItem key={product.id} value={String(product.id)}>
                      {product.shortCode}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="">
            <Select value={selectedFileType} onValueChange={handleFileTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by file type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All File Types</SelectItem>
                <SelectItem value="COLLECTION">Collection</SelectItem>
                <SelectItem value="REPORT">Report</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Loader2 className="h-12 w-12 text-muted-foreground mb-4 animate-spin" />
              <h3 className="text-lg font-semibold mb-2">Loading Files</h3>
              <p className="text-sm text-muted-foreground">
                Please wait while we fetch the data
              </p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Download className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Error Loading Files
              </h3>
              <p className="text-sm text-muted-foreground">
                Something went wrong. Please try again.
              </p>
            </div>
          ) : paginatedFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Download className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Files Found</h3>
              <p className="text-sm text-muted-foreground">
                {selectedCompanyId === "all" && selectedProductId === "all" && selectedFileType === "all"
                  ? "No files have been uploaded yet"
                  : "No files found for the selected filters"}
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    {[
                      { label: "Company Name", key: "" },
                      { label: "Product Name", key: "" },
                      { label: "File Type", key: "fileType" },
                      { label: "File Uploaded Date", key: "" },
                      { label: "Uploaded By", key: "" },
                      { label: "File Name", key: "fileName" },
                      { label: "Status", key: "status" },
                      { label: "Actions", key: "" },
                    ].map((col) => (
                      <TableHead
                        key={col.label}
                        className={
                          col.key
                            ? "cursor-pointer select-none"
                            : ""
                        }
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
                  {paginatedFiles.map((file: FileItem) => (
                    <TableRow key={file.id}>
                      <TableCell className="text-foreground">
                        {getCompanyName(file.companyId)}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {getProductShortCode(file.productId)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {file.fileType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-foreground">
                        {/* Date not available in API - showing N/A */}
                        N/A
                      </TableCell>
                      <TableCell className="text-foreground">
                        {/* Uploaded by not available in API - showing N/A */}
                        N/A
                      </TableCell>
                      <TableCell
                        className="text-foreground max-w-[200px] truncate"
                        title={file.fileName}
                      >
                        {file.fileName}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={statusVariant[file.status]}
                          className={getStatusBadgeStyle(file.status)}
                        >
                          {file.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                          onClick={() => handleDownload(file.filePath)}
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
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
        {!isLoading && !isError && paginatedFiles.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {endIndex} of {totalElements} files
            {(selectedCompanyId !== "all" || selectedProductId !== "all" || selectedFileType !== "all") && " for selected filters"}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}