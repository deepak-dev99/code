import Urls from "../config/urls";
import http from "./http";
export const fetchUsers = async (role = null) => {
  try {
    let url = Urls.users;

    if (role.length > 0) {

const roles = role === 'admin' ? ['operator','crypto_admin','content_admin','admin'] : [role];
const query = roles.map(r => `role=${encodeURIComponent(r)}`).join("&");

      url += `?${query}`;
    }

    const response = await http.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const createUsers = async () => {
  const response = await http.post(`${Urls.users}`);
  return response.data;
};

export const editUsers = async (id, data) => {
  const response = await http.put(`${Urls.users}/${id}`, data);
  return response.data;
};

export const deleteUsers = async (id, data) => {
  const response = await http.delete(`${Urls.users}/${id}`, data);
  return response.data;
};


export const createAdmin = async (data) => {
  const response = await http.post(`${Urls.registeradmin}`, data);
  return response.data;
};


export const uploadPdf = async (data) => {
  const response = await http.post(`${Urls.upload}`, data);
  return response.data;
};
export const Urlfiles = async (data) => {
  const response = await http.get(`${Urls.urlfiles}`, data);
  return response.data;
};

export const Dropdown = async (data) => {
  const response = await http.get(`${Urls.files}`, data);
  return response.data;
};
export const Dashboarddata = async ({ queryKey }) => {
  const [, selectedFile] = queryKey; // ["dashboard", selectedFile]
  const response = await http.get(`${Urls.dashboard}?_id=${selectedFile}`);
  return response.data;
};

export const getMembership = async (data) => {
  const response = await http.get(`${Urls.getmembership}`, data);
  return response.data;
};
export const updateMembership = async (id,data) => {
  const response = await http.put(`${Urls.getmembership}/${id}`, data);
  return response.data;
};
export const fanclubList = async (data) => {
  const response = await http.get(`${Urls.fanclub}`, data);
  return response.data;
};
// export const updateMemberHistory = async (id,data) => {
//   const response = await http.get(`${Urls.updatemember}/${id}`, data);
//   return response.data;
// };



export const updateMemberHistory = async ({ queryKey }) => {
  const [, id] = queryKey;
  const response = await http.get(`${Urls.updatemember}/${id}`);
  return response.data;
};


export const getUsers = async () => {
  const response = await http.get(`${Urls.users}`);
  return response.data;
};

export const analyzeData = async () => {
  const response = await http.get(`${Urls.analyze}`);
  return response.data;
};


export const patchCampaign = async () => {
  const response = await http.patch(`${Urls.patchcampaign}`);
  return response.data;
};
export const userBlock = async (id) => {
  const response = await http.patch(`${Urls.isblocked}/${id}`);
  return response.data;
};