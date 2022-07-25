import axios from "axios";

const unspalshApiKey = process.env.REACT_APP_UNSPLASH_API_KEY;
const baseURL = process.env.REACT_APP_UNSPLASH_BASE_URL;

const createAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
  });
  instance.interceptors.request.use((config) => {
    config.headers = {
      Authorization: `Client-ID ${unspalshApiKey}`,
    };
    return config;
  });

  return instance;
};

const API = createAxiosInstance(baseURL, 30000);

const loadPhotos = (pageNumber) =>
  API.get("/photos/?per_page=30&page=" + pageNumber);

export { loadPhotos };
