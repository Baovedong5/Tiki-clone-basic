import axios from "../utils/axios-customize";

export const callFetchBook = (query) => {
  return axios.get(`/api/v1/book?${query}`);
};

export const callCategory = () => {
  return axios.get("/api/v1/database/category");
};
