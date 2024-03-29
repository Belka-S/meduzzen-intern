import { TCompany } from 'store/company';

import { apiClient, token } from './apiHttp';

export interface ICreateCompanyCredentials {
  company_name: string;
  is_visible: boolean;
}

export type TPaginationParams = { page: number; page_size: number };

export const createCompany = async (credentials: ICreateCompanyCredentials) => {
  const { data } = await apiClient.post('/company/', credentials);
  const { company_name, is_visible } = credentials;
  data.result = { ...data.result, company_name, is_visible };
  return data;
};

export const getCompany = async (accessToken: string, id: number) => {
  token.set(accessToken);
  const { data } = await apiClient.get(`/company/${id}`);
  return data;
};

export const deleteCompany = async (accessToken: string, id: number) => {
  token.set(accessToken);
  const { data } = await apiClient.delete(`/company/${id}`);
  data.result = { ...data.result, company_id: id };
  return data;
};

export const updateCompanyInfo = async (
  accessToken: string,
  company: Partial<TCompany>,
) => {
  const { company_id, ...credentials } = company;
  token.set(accessToken);
  const { data } = await apiClient.put(
    `/company/${company_id}/update_info/`,
    credentials,
  );
  return data;
};

export const updateVisible = async (
  accessToken: string,
  company: Partial<TCompany>,
) => {
  const { company_id, ...credentials } = company;
  token.set(accessToken);
  const { data } = await apiClient.put(
    `/company/${company_id}/update_visible/`,
    credentials,
  );
  return data;
};

export const updateAvatar = async (
  accessToken: string,
  company_id: number,
  formData: FormData,
) => {
  token.set(accessToken);
  const { data } = await apiClient.put(
    `/company/${company_id}/update_avatar/`,
    formData,
  );
  return data;
};

export const getAllCompanies = async (
  accessToken: string,
  params: TPaginationParams,
) => {
  token.set(accessToken);
  const { data } = await apiClient.get('/companies/', { params });
  return data;
};
