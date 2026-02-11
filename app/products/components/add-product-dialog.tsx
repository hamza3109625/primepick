"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useCreateProduct } from "@/hooks/useProducts";
import { useCompanies } from "@/hooks/useCompanies";
import { toast } from "sonner";

const productSchema = z.object({
  companyId: z.number().min(1, "Company is required"),
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  shortCode: z.string().min(1, "Short code is required"),
  longCode: z.string().min(1, "Long code is required"),
  createdBy: z.number().min(1, "Created by is required"),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function AddProductDialog() {
  const [open, setOpen] = useState(false);
  const createProduct = useCreateProduct();
  const { data: companies, isLoading: isLoadingCompanies } = useCompanies();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      companyId: undefined,
      name: "",
      description: "",
      shortCode: "",
      longCode: "",
      createdBy: 3, // You might want to get this from auth context
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      await createProduct.mutateAsync({
        ...data,
        status: "Created", // Auto-set to "Created"
        createDate: new Date().toISOString(), // Auto-generate current date/time
      });

      toast.success("Product created successfully!");
      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create product"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new product.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Company ID */}
            <FormField
              control={form.control}
              name="companyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                    disabled={isLoadingCompanies}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a company" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingCompanies ? (
                        <div className="flex items-center justify-center py-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : !companies || companies.length === 0 ? (
                        <div className="py-2 px-2 text-sm text-muted-foreground">
                          No companies available
                        </div>
                      ) : (
                        companies.map((company) => (
                          <SelectItem
                            key={company.id}
                            value={company.id.toString()}
                          >
                            {company.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Product Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Short Code */}
              <FormField
                control={form.control}
                name="shortCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Code *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., ABS" {...field} />
                    </FormControl>
                    <FormDescription>3-5 characters</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Long Code */}
              <FormField
                control={form.control}
                name="longCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Long Code *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., ABSPROD" {...field} />
                    </FormControl>
                    <FormDescription>Unique identifier</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Created By - Hidden field */}
            <FormField
              control={form.control}
              name="createdBy"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Info about auto-generated fields */}
            <div className="rounded-lg border border-muted bg-muted/50 p-3">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Note:</span> Status will be set to{" "}
                <span className="font-medium">"Created"</span> and the creation
                date will be automatically generated.
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={createProduct.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createProduct.isPending}>
                {createProduct.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Product"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}