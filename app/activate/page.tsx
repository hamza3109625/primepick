import { Suspense } from "react";
import CreatePasswordContent from "./create-password-content";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function ActivateLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-gray-500">Loading...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CreatePasswordPage() {
  return (
    <Suspense fallback={<ActivateLoading />}>
      <CreatePasswordContent />
    </Suspense>
  );
}