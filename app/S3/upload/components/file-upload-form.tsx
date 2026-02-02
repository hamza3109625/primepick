"use client"

import React from "react"

import { useState, useRef } from "react"
import { Upload, Calendar as CalendarIcon, FileUp, X } from "lucide-react"
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
import { cn } from "@/lib/utils"

interface FileUploadFormProps {
  onUploadSuccess: (fileName: string) => void
}

const products = [
  { id: "ehs", name: "EHS" },
  { id: "move-in", name: "Move-In" },
  { id: "inspection", name: "Inspection" },
  { id: "maintenance", name: "Maintenance" },
]

export function FileUploadForm({ onUploadSuccess }: FileUploadFormProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !selectedProduct || !selectedDate) return

    setIsUploading(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    onUploadSuccess(selectedFile.name)
    setIsUploading(false)
    setSelectedFile(null)
    setSelectedProduct("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const canUpload = selectedFile && selectedProduct && selectedDate

  return (
    <Card className="bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
          <FileUp className="h-5 w-5 text-primary" />
          File Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Product Selection */}
        <div className="space-y-2">
          <Label htmlFor="product" className="text-sm font-medium text-foreground">
            Product
          </Label>
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger id="product" className="w-full">
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

        {/* Date Selection */}
        <div className="space-y-2">
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

        {/* File Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">File</Label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept=".csv,.xlsx,.xls,.pdf"
          />
          
          {!selectedFile ? (
            <div
              onClick={handleBrowseClick}
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-accent/50 transition-colors"
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Click to browse or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                CSV, Excel, or PDF files
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg border border-border">
              <div className="flex items-center gap-2 min-w-0">
                <FileUp className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-foreground truncate">
                  {selectedFile.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={handleRemoveFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <Button
          className="w-full"
          onClick={handleUpload}
          disabled={!canUpload || isUploading}
        >
          {isUploading ? (
            <>
              <span className="animate-spin mr-2">
                <Upload className="h-4 w-4" />
              </span>
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
