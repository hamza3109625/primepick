"use client";

import React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardLayout } from "@/components/dashboard-layout";

export default function CreateUserForm() {
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }

  return (
    <DashboardLayout>
      <div className="mb-3">
        <p className="font-semibold" style={{ color: '#0E325D' }}>New STANDARD_USER</p>
        <p className="text-sm" style={{ color: '#0E325D' }}>Backend: POST /users/standard</p>
      </div>
      <Card className="w-full max-w-8xl border-0 shadow-none" style={{ backgroundColor: '#FFFFFF' }}>
        <CardContent className="p-0">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="userName" style={{ color: '#0E325D' }}>Username</Label>
                <Input
                  id="userName"
                  placeholder="John"
                  required
                  disabled={isLoading}
                  className="border-gray-300 focus:border-[#007CFC] focus:ring-[#007CFC]"
                  style={{ backgroundColor: '#FFFFFF', color: '#0E325D' }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" style={{ color: '#0E325D' }}>Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  required
                  disabled={isLoading}
                  className="border-gray-300 focus:border-[#007CFC] focus:ring-[#007CFC]"
                  style={{ backgroundColor: '#FFFFFF', color: '#0E325D' }}
                />
              </div>
            </div>

            <div>
              <h1 className="text-xl font-semibold mb-4" style={{ color: '#0E325D' }}>Organization</h1>

              {/* Full width Organization Name */}
              <div className="space-y-2 mb-4">
                <Label htmlFor="organizationName" style={{ color: '#0E325D' }}>Organization Name</Label>
                <Input
                  id="organizationName"
                  placeholder="Organization Name"
                  required
                  disabled={isLoading}
                  className="border-gray-300 focus:border-[#007CFC] focus:ring-[#007CFC]"
                  style={{ backgroundColor: '#FFFFFF', color: '#0E325D' }}
                />
              </div>

              {/* Address and City - 50/50 split */}
              <div className="grid gap-4 sm:grid-cols-2 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="address" style={{ color: '#0E325D' }}>Address</Label>
                  <Input
                    id="address"
                    placeholder="Street Address"
                    required
                    disabled={isLoading}
                    className="border-gray-300 focus:border-[#007CFC] focus:ring-[#007CFC]"
                    style={{ backgroundColor: '#FFFFFF', color: '#0E325D' }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" style={{ color: '#0E325D' }}>City</Label>
                  <Input
                    id="city"
                    placeholder="City"
                    required
                    disabled={isLoading}
                    className="border-gray-300 focus:border-[#007CFC] focus:ring-[#007CFC]"
                    style={{ backgroundColor: '#FFFFFF', color: '#0E325D' }}
                  />
                </div>
              </div>

              {/* Province, Postal Code, Country - equal thirds */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="province" style={{ color: '#0E325D' }}>Province</Label>
                  <Input
                    id="province"
                    placeholder="Province"
                    required
                    disabled={isLoading}
                    className="border-gray-300 focus:border-[#007CFC] focus:ring-[#007CFC]"
                    style={{ backgroundColor: '#FFFFFF', color: '#0E325D' }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode" style={{ color: '#0E325D' }}>Postal Code</Label>
                  <Input
                    id="postalCode"
                    placeholder="Postal Code"
                    required
                    disabled={isLoading}
                    className="border-gray-300 focus:border-[#007CFC] focus:ring-[#007CFC]"
                    style={{ backgroundColor: '#FFFFFF', color: '#0E325D' }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" style={{ color: '#0E325D' }}>Country</Label>
                  <Input
                    id="country"
                    placeholder="Country"
                    required
                    disabled={isLoading}
                    className="border-gray-300 focus:border-[#007CFC] focus:ring-[#007CFC]"
                    style={{ backgroundColor: '#FFFFFF', color: '#0E325D' }}
                  />
                </div>
              </div>
            </div>

            <div>
              <Button 
                type="submit" 
                className="w-auto" 
                disabled={isLoading}
                style={{ 
                  backgroundColor: '#007CFC', 
                  color: '#FFFFFF',
                  borderColor: '#007CFC'
                }}
              >
                {isLoading ? "Creating..." : "Create User"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}