import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/auth.api";
import { LoginRequest } from "@/types/auth";

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (response) => {
      const data = response.data;
      
      // Store authentication data
      const rolesStr = Array.isArray(data.roles)
        ? data.roles.join(",")
        : data.roles || data.role || "";

      localStorage.setItem("token", data.token || "");
      localStorage.setItem("userid", data.userId ?? data.id ?? "");
      localStorage.setItem("username", data.username ?? "");
      localStorage.setItem("roles", rolesStr);
      localStorage.setItem("mobile", (data.mobile ?? "").trim());

      // Refresh top navigation if function exists
      if (typeof (window as any).refreshTopnav === "function") {
        (window as any).refreshTopnav();
      }

      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 650);
    },
  });
};