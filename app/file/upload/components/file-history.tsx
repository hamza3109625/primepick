"use client"

import { useState } from "react"
import { Download, Calendar as CalendarIcon, History } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

const products = [
  { id: "all", name: "All Products" },
  { id: "ehs", name: "EHS" },
  { id: "move-in", name: "Move-In" },
  { id: "inspection", name: "Inspection" },
  { id: "maintenance", name: "Maintenance" },
]

interface FileRecord {
  id: string
  product: string
  fileType: string
  filePath: string
  fileName: string
  uploadedBy: string
  numberOfRecords: number
  totalAmount: number
}

const mockFileHistory: FileRecord[] = [
  {
    id: "001",
    product: "EHS",
    fileType: "Collection",
    filePath: "../EHS/20Jan2026",
    fileName: "Sohail-20Jan2026",
    uploadedBy: "User1",
    numberOfRecords: 83,
    totalAmount: 1000000.00,
  },
  {
    id: "002",
    product: "EHS",
    fileType: "Report",
    filePath: "../EHS/20Jan2026",
    fileName: "Sohail-20Jan2026",
    uploadedBy: "Prime Pick",
    numberOfRecords: 80,
    totalAmount: 1000000.00,
  },
  {
    id: "003",
    product: "Move-In",
    fileType: "Collection",
    filePath: "../EHS/20Jan2026",
    fileName: "Karen-20Jan2026",
    uploadedBy: "User1",
    numberOfRecords: 150,
    totalAmount: 100150000.00,
  },
  {
    id: "004",
    product: "Move-In",
    fileType: "Report",
    filePath: "../EHS/20Jan2026",
    fileName: "Sohail-20Jan2026",
    uploadedBy: "Prime Pick",
    numberOfRecords: 150,
    totalAmount: 100150000.00,
  },
]

export function FileHistory() {
  const [selectedProduct, setSelectedProduct] = useState<string>("all")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const filteredHistory = mockFileHistory.filter((record) => {
    if (selectedProduct !== "all" && record.product.toLowerCase().replace("-", "-") !== selectedProduct) {
      return false
    }
    return true
  })

  const handleDownload = (fileId: string) => {
    // Simulate download API call
    console.log(`Downloading file ${fileId}`)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <Card className="bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          File History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <Label htmlFor="filter-product" className="text-sm font-medium text-foreground">
              Product
            </Label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger id="filter-product">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 space-y-2">
            <Label className="text-sm font-medium text-foreground">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Table */}
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="text-xs font-semibold text-foreground">File ID</TableHead>
                <TableHead className="text-xs font-semibold text-foreground">Product</TableHead>
                <TableHead className="text-xs font-semibold text-foreground">File Type</TableHead>
                <TableHead className="text-xs font-semibold text-foreground">File Path</TableHead>
                <TableHead className="text-xs font-semibold text-foreground">File Name</TableHead>
                <TableHead className="text-xs font-semibold text-foreground">Uploaded By</TableHead>
                <TableHead className="text-xs font-semibold text-foreground text-right">Records</TableHead>
                <TableHead className="text-xs font-semibold text-foreground text-right">Total Amount</TableHead>
                <TableHead className="text-xs font-semibold text-foreground w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    No files found
                  </TableCell>
                </TableRow>
              ) : (
                filteredHistory.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium text-foreground">{record.id}</TableCell>
                    <TableCell className="text-foreground">{record.product}</TableCell>
                    <TableCell className="text-foreground">{record.fileType}</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">{record.filePath}</TableCell>
                    <TableCell className="text-foreground">{record.fileName}</TableCell>
                    <TableCell className="text-foreground">{record.uploadedBy}</TableCell>
                    <TableCell className="text-right text-foreground">{record.numberOfRecords}</TableCell>
                    <TableCell className="text-right font-medium text-foreground">
                      {formatCurrency(record.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                        onClick={() => handleDownload(record.id)}
                        title="Download Report"
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
      </CardContent>
    </Card>
  )
}
