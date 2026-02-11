"use client"

import { CheckCircle2, X, Mail } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface UploadConfirmationProps {
  fileName: string
  onDismiss: () => void
}

export function UploadConfirmation({ fileName, onDismiss }: UploadConfirmationProps) {
  return (
    <Card className="bg-card border-success/30">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-success/10 p-2">
            <CheckCircle2 className="h-6 w-6 text-success" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-card-foreground mb-1">
              File Upload Confirmation
            </h3>
            <p className="text-foreground">
              <span className="font-medium">{fileName}</span> has been uploaded successfully!
            </p>
            <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>Confirmation email will be sent to configured recipients</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
