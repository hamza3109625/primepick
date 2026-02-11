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

      // Store phone (not mobile)
      if (userProfile?.phone) {
        localStorage.setItem("mobile", userProfile.phone.trim());
      }

      console.log("Stored values:", {
        token: localStorage.getItem("token"),
        userid: localStorage.getItem("userid"),
        username: localStorage.getItem("username"),
        roles: localStorage.getItem("roles"),
        mobile: localStorage.getItem("mobile"),
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
