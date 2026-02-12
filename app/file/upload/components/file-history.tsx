"use client";

import { useState } from "react";
import { Download, History, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useFiles } from "@/hooks/useFile";
import { FileParams } from "@/api/file.api";
import { FileItem } from "@/api/file.api";

const PAGE_SIZE = 10;

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

export function FileHistory() {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState<FileParams["direction"]>("asc");

  const { data, isLoading, isError } = useFiles({
    page,
    size: PAGE_SIZE,
    sortBy: "id",
    direction,
  });

  const files = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleDownload = async (filePath: string) => {
    try {
      const response = await presignDownload(filePath);
      const url = response.data.url;
      // Open in new tab — triggers browser download without navigating away
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("Failed to generate download link. Please try again.");
    }
  };

  return (
    <Card className="bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            File History
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDirection((d) => (d === "asc" ? "desc" : "asc"))}
          >
            {direction === "asc" ? "↑ Oldest first" : "↓ Newest first"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="text-xs font-semibold text-foreground">
                  ID
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground">
                  File Name
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground">
                  File Path
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground">
                  Type
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground text-right">
                  Size
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground text-right">
                  Records
                </TableHead>
                <TableHead className="text-xs font-semibold text-foreground w-12" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-destructive"
                  >
                    Failed to load files. Please try again.
                  </TableCell>
                </TableRow>
              ) : files.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No files found.
                  </TableCell>
                </TableRow>
              ) : (
                files.map((file: FileItem) => (
                  <TableRow key={file.id}>
                    <TableCell className="font-medium text-foreground">
                      {file.id}
                    </TableCell>
                    <TableCell
                      className="text-foreground max-w-[200px] truncate"
                      title={file.fileName}
                    >
                      {file.fileName}
                    </TableCell>
                    <TableCell
                      className="text-muted-foreground font-mono text-xs max-w-[200px] truncate"
                      title={file.filePath}
                    >
                      {file.filePath}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {file.fileType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={statusVariant[file.status]}
                        className="text-xs"
                      >
                        {file.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-foreground">
                      {formatFileSize(file.fileSize)}
                    </TableCell>
                    <TableCell className="text-right text-foreground">
                      {file.fileRecords.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                        onClick={() => handleDownload(file.filePath)}
                        title="Download"
                        disabled
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-1">
          <p className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
            {data && <span className="ml-2">({data.totalElements} total)</span>}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0 || isLoading || data?.first}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={isLoading || data?.last}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}