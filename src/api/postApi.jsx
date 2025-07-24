import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_COUNTRY_API,
});

export const getCountryData = () => {
  return api.get("/all?fields=name,population,region,capital,flags");
};

export const getCountryIndData = (countryName) => {
  return api.get(`/name/${countryName}?fullText=true`);
};
