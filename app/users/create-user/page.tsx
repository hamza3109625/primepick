"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useCreateStandardUser } from "@/hooks/useUsers";
import { useCompanies } from "@/hooks/useCompanies";
import { UserRole } from "@/api/user.api";
import { toast } from "sonner";

export default function CreateUserForm() {
  const router = useRouter();
  const createUserMutation = useCreateStandardUser();
  const { data: companies, isLoading: companiesLoading } = useCompanies();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    middleName: "",
    lastName: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    country: "",
    phone: "",
    companyId: "",
    role: "" as UserRole | "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCompanyChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      companyId: value,
    }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value as UserRole,
    }));
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formData.companyId) {
      toast.error("Please select a company");
      return;
    }

    if (!formData.role) {
      toast.error("Please select a role");
      return;
    }

    try {
      const response = await createUserMutation.mutateAsync({
        data: {
          username: formData.username,
          email: formData.email,
          firstName: formData.firstName || undefined,
          middleName: formData.middleName || undefined,
          lastName: formData.lastName || undefined,
          address: formData.address || undefined,
          city: formData.city || undefined,
          state: formData.province || undefined,
          zipCode: formData.postalCode || undefined,
          country: formData.country || undefined,
          phone: formData.phone || undefined,
          companyId: parseInt(formData.companyId),
        },
        role: formData.role,
      });

      toast.success(response.data.message || "User created successfully");
      router.push("/users");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create user");
    }
  }

  const isLoading = createUserMutation.isPending;

  return (
    <DashboardLayout>
      <div className="mb-3">
        <p className="font-semibold" style={{ color: "#0E325D" }}>
          New Standard User
        </p>
      </div>
      <Card
        className="w-full max-w-8xl border-0 shadow-none"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <CardContent className="p-0">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Company and Role Selection */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyId" style={{ color: "#0E325D" }}>
                  Company *
                </Label>
                <Select
                  value={formData.companyId}
                  onValueChange={handleCompanyChange}
                  disabled={isLoading || companiesLoading}
                  required
                >
                  <SelectTrigger
                    className="border-gray-300 focus:border-[#007CFC] focus:ring-[#007CFC]"
                    style={{ backgroundColor: "#FFFFFF", color: "#0E325D" }}
                  >
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies?.map((company: { id: number; name: string }) => (
                      <SelectItem key={company.id} value={company.id.toString()}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" style={{ color: "#0E325D" }}>
                  Role *
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={handleRoleChange}
                  disabled={isLoading}
                  required
                >
                  <SelectTrigger
                    className="border-gray-300 focus:border-[#007CFC] focus:ring-[#007CFC]"
                    style={{ backgroundColor: "#FFFFFF", color: "#0E325D" }}
                  >
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="EXTERNAL_USER">External User</SelectItem>
                    <SelectItem value="INTERNAL_USER">Internal User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username" style={{ color: "#0E325D" }}>
                  Username *
                </Label>
                <Input
                  id="username"
                  placeholder="john_doe"
                  required
                  minLength={3}
                  maxLength={64}
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="border-gray-300 focus:border-[#007CFC] focus:ring-[#007CFC]"
                  style={{ backgroundColor: "#FFFFFF", color: "#0E325D" }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" style={{ color: "#0E325D" }}>
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  required
                  maxLength={180}
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="border-gray-300 focus:border-[#007CFC] focus:ring-[#007CFC]"
                  style={{ backgroundColor: "#FFFFFF", color: "#0E325D" }}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="firstName" style={{ color: "#0E325D" }}>
                  First Name
                </Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  minLength={3}
                  maxLength={140}
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="border-gray-300 focus:border-[#007CFC] focus:ring-[#007CFC]"
                  style={{ backgroundColor: "#FFFFFF", color: "#0E325D" }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middleName" style={{ color: "#0E325D" }}>
                  Middle Name
                </Label>
                <Input
                  id="middleName"
                  placeholder="M."
                  maxLength={64}
                  value={formData.middleName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="border-gray-300 focus:border-[#007CFC] focus:ring-[#007CFC]"
                  style={{ backgroundColor: "#FFFFFF", color: "#0E325D" }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" style={{ color: "#0E325D" }}>
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  minLength={3}
                  maxLength={64}
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="border-gray-300 focus:border-[#007CFC] focus:ring-[#007CFC]"
                  style={{ backgroundColor: "#FFFFFF", color: "#0E325D" }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" style={{ color: "#0E325D" }}>
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                minLength={3}
                maxLength={80}
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isLoading}
                className="border-gray-300 focus:border-[#007CFC] focus:ring-[#007CFC]"
                style={{ backgroundColor: "#FFFFFF", color: "#0E325D" }}
              />
            </div>

            <div>
              <h1
                className="text-xl font-semibold mb-4"
                style={{ color: "#0E325D" }}
              >
                Address
              </h1>

              <div className="space-y-2 mb-4">
                <Label htmlFor="address" style={{ color: "#0E325D" }}>
                  Street Address
                </Label>
                <Input
                  id="address"
                  placeholder="123 Main Street"
                  minLength={3}
                  maxLength={240}
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="border-gray-300 focus:border-[#007CFC] focus:ring-[#007CFC]"
                  style={{ backgroundColor: "#FFFFFF", color: "#0E325D" }}
                />
              </div>

              <div className="space-y-2 mb-4">
                <Label htmlFor="city" style={{ color: "#0E325D" }}>
                  City
                </Label>
                <Input
                  id="city"
                  placeholder="New York"
                  minLength={3}
                  maxLength={80}
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="border-gray-300 focus:border-[#007CFC] focus:ring-[#007CFC]"
                  style={{ backgroundColor: "#FFFFFF", color: "#0E325D" }}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="province" style={{ color: "#0E325D" }}>
                    State/Province
                  </Label>
                  <Input
                    id="province"
                    placeholder="NY"
                    minLength={2}
                    maxLength={80}
                    value={formData.province}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="border-gray-300 focus:border-[#007CFC] focus:ring-[#007CFC]"
                    style={{ backgroundColor: "#FFFFFF", color: "#0E325D" }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode" style={{ color: "#0E325D" }}>
                    Postal Code
                  </Label>
                  <Input
                    id="postalCode"
                    placeholder="10001"
                    minLength={6}
                    maxLength={20}
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="border-gray-300 focus:border-[#007CFC] focus:ring-[#007CFC]"
                    style={{ backgroundColor: "#FFFFFF", color: "#0E325D" }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" style={{ color: "#0E325D" }}>
                    Country
                  </Label>
                  <Input
                    id="country"
                    placeholder="United States"
                    minLength={3}
                    maxLength={80}
                    value={formData.country}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="border-gray-300 focus:border-[#007CFC] focus:ring-[#007CFC]"
                    style={{ backgroundColor: "#FFFFFF", color: "#0E325D" }}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                className="w-auto"
                disabled={isLoading}
                style={{
                  backgroundColor: "#007CFC",
                  color: "#FFFFFF",
                  borderColor: "#007CFC",
                }}
              >
                {isLoading ? "Creating..." : "Create User"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-auto"
                disabled={isLoading}
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}