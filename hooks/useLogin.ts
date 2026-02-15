import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/auth.api";
import { LoginRequest } from "@/types/auth";

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (response) => {
      console.log("Login response:", response);

      const data = response.data;
      const userProfile = data.userProfile;

      // Store token
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Store user ID
      if (userProfile?.id) {
        localStorage.setItem("userid", String(userProfile.id));
      }

      // Store username
      if (userProfile?.firstName) {
        localStorage.setItem("username", userProfile.firstName);
      }

      // Store role (singular, not roles)
      if (userProfile?.role) {
        localStorage.setItem("roles", userProfile.role);
      }

      // Store email (not mobile)
      if (userProfile?.email) {
        localStorage.setItem("email", userProfile.email.trim());
      }

      // Store company ID
      if (userProfile?.companyId) {
        localStorage.setItem("companyId", String(userProfile.companyId));
      }

      if (userProfile?.firstName) {
        localStorage.setItem("firstname", userProfile.firstName);
      }

      console.log("Stored values:", {
        token: localStorage.getItem("token"),
        userid: localStorage.getItem("userid"),
        username: localStorage.getItem("username"),
        firstname: localStorage.getItem("firstname"),
        roles: localStorage.getItem("roles"),
        email: localStorage.getItem("email"),
        companyId: localStorage.getItem("companyId"),
      });

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