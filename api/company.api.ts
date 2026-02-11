import { api } from "./axios";
import { CompanyResponse, Company } from "@/types/company";

export const getCompanies = () => {
  return api.get<CompanyResponse>("/company");
};

export const createCompany = (data: any) => {
  return api.post("/company/register-company", data);
};