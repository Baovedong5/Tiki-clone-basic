import axios from "../utils/axios-customize";

export const callFetchBook = (query) => {
  return axios.get(`/api/v1/book?${query}`);
};
