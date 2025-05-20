import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001", // Adjust according to backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
