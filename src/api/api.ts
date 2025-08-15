import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://real-estate-api-laravel.test/";

export const getCsrf = () => axios.get("/sanctum/csrf-cookie");

export const login = async (email: string, password: string) => {
  await getCsrf();
  return axios.post("/api/login", { email, password });
};

export const register = (
  name: string,
  email: string,
  password: string,
  password_confirmation: string
) => {
  return axios.post("/api/register", {
    name,
    email,
    password,
    password_confirmation,
  });
};

export const logout = () => axios.post("/api/logout");
