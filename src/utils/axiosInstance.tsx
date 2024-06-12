import axios from "axios";

// For development
// const baseURL = "http://localhost:5000";

// For deployment
const baseURL = "https://backend-kqnasaoyha-uc.a.run.app";

const axiosInstance = axios.create({ baseURL: baseURL });

export default axiosInstance;
