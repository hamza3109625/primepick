"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { FileUploadForm } from "./components/file-upload-form"
import { UploadConfirmation } from "./components/upload-confirmation"
import { FileHistory } from "./components/file-history"

export default function Upload() {
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)

  const handleUploadSuccess = (fileName: string) => {
    setUploadedFileName(fileName)
  }

  const handleDismissConfirmation = () => {
    setUploadedFileName(null)
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            File Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Upload files and view upload history
          </p>
        </div>

        {/* Upload Confirmation */}
        {uploadedFileName && (
          <UploadConfirmation
            fileName={uploadedFileName}
            onDismiss={handleDismissConfirmation}
          />
        )}

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* File Upload Form - Takes 1 column */}
          <div className="lg:col-span-1">
            <FileUploadForm onUploadSuccess={handleUploadSuccess} />
          </div>

          {/* File History - Takes 2 columns */}
          <div className="lg:col-span-2">
            <FileHistory />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
