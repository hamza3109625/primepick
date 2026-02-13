"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Upload, Calendar as CalendarIcon, FileUp, X, Folder, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { api } from "@/api/axios";
import { useCompanies } from "@/hooks/useCompanies";
import { useProducts } from "@/hooks/useProducts";

interface FileUploadFormProps {
  onUploadSuccess: (fileName: string) => void;
}

const ACCEPTED_FILES = ".csv,.xlsx,.xls,.pdf";

function buildFolderPath(company: string, product: string, date?: Date): string {
  return [
    company,
    product,
    date ? format(date, "ddMMMyyyy").toUpperCase() : null,
  ]
    .filter(Boolean)
    .join("/");
}

export function FileUploadForm({ onUploadSuccess }: FileUploadFormProps) {
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [folderPath, setFolderPath] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: companies = [], isLoading: loadingCompanies } = useCompanies();
  const { data: productsPage, isLoading: loadingProducts } = useProducts({
    companyId: Number(selectedCompanyId),
  });
  const products = productsPage?.content ?? [];

  const selectedCompanyName = companies.find((c) => String(c.id) === selectedCompanyId)?.name ?? "";
  const selectedProductName = products.find((p) => String(p.id) === selectedProductId)?.name ?? "";

  useEffect(() => {
    setFolderPath(buildFolderPath(selectedCompanyName, selectedProductName, selectedDate));
  }, [selectedCompanyName, selectedProductName, selectedDate]);

  const handleCompanyChange = useCallback((value: string) => {
    setSelectedCompanyId(value);
    setSelectedProductId("");
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  }, []);

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const resetForm = useCallback(() => {
    setSelectedFile(null);
    setSelectedCompanyId("");
    setSelectedProductId("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile || !selectedCompanyId || !selectedProductId || !selectedDate) return;

    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", selectedFile);
      fd.append("prefix", folderPath);
      fd.append("overwrite", "false");
      fd.append("companyId", selectedCompanyId);
      fd.append("productId", selectedProductId);

      await api.post("/s3/files/upload", fd, {
        headers: { "Content-Type": undefined },
      });

      toast.success(`"${selectedFile.name}" uploaded successfully.`);
      onUploadSuccess(selectedFile.name);
      resetForm();
    } catch (err: unknown) {
      const message =
        (err as any)?.response?.data?.message ??
        (err as Error)?.message ??
        "Upload failed. Please try again.";
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, selectedCompanyId, selectedProductId, selectedDate, folderPath, onUploadSuccess, resetForm]);

  const canUpload = !!selectedFile && !!selectedCompanyId && !!selectedProductId && !!selectedDate;

  return (
    <Card className="bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
          <FileUp className="h-5 w-5 text-primary" />
          File Upload
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Form Fields in Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Company */}
          <div className="space-y-2">
            <Label htmlFor="company" className="text-sm font-medium text-foreground">
              Company
            </Label>
            <Select value={selectedCompanyId} onValueChange={handleCompanyChange} disabled={loadingCompanies}>
              <SelectTrigger id="company" className="w-full">
                {loadingCompanies ? (
                  <LoadingOption label="Loading companies..." />
                ) : (
                  <SelectValue placeholder="Select a company" />
                )}
              </SelectTrigger>
              <SelectContent>
                {companies.map(({ id, name }) => (
                  <SelectItem key={id} value={String(id)}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product */}
          <div className="space-y-2">
            <Label htmlFor="product" className="text-sm font-medium text-foreground">
              Product
            </Label>
            <Select
              value={selectedProductId}
              onValueChange={setSelectedProductId}
              disabled={!selectedCompanyId || loadingProducts}
            >
              <SelectTrigger id="product" className="w-full">
                {loadingProducts ? (
                  <LoadingOption label="Loading products..." />
                ) : (
                  <SelectValue placeholder={!selectedCompanyId ? "Select a company first" : "Select a product"} />
                )}
              </SelectTrigger>
              <SelectContent>
                {products.map(({ id, name }) => (
                  <SelectItem key={id} value={String(id)}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Folder Path - Full Width */}
        <div className="space-y-2">
          <Label htmlFor="folder" className="text-sm font-medium text-foreground flex items-center gap-1.5">
            <Folder className="h-4 w-4 text-muted-foreground" />
            Folder Path
          </Label>
          <Textarea
            id="folder"
            value={folderPath}
            onChange={(e) => setFolderPath(e.target.value)}
            placeholder="Auto-filled from Company / Product / Date"
            className="resize-none font-mono text-sm min-h-[60px]"
            rows={2}
          />
          {folderPath && (
            <p className="text-xs text-muted-foreground">Auto-generated — you can edit if needed.</p>
          )}
        </div>

        {/* File Upload and Button in Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">
          {/* File */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">File</Label>
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept={ACCEPTED_FILES} />

            {selectedFile ? (
              <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg border border-border">
                <div className="flex items-center gap-2 min-w-0">
                  <FileUp className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-sm text-foreground truncate">{selectedFile.name}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={handleRemoveFile}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-accent/50 transition-colors"
              >
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Click to browse or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">CSV, Excel, or PDF files</p>
              </div>
            )}
          </div>

          {/* Upload Button */}
          <Button className="md:w-48 h-10" onClick={handleUpload} disabled={!canUpload || isUploading}>
            {isUploading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading...</>
            ) : (
              <><Upload className="mr-2 h-4 w-4" />Upload File</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingOption({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-2 text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      {label}
    </span>
  );
}