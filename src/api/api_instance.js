import axios from "axios";
const instance = axios.create({
  baseURL: "http://165.22.63.108:3003/api",               
  headers: { 
    "Content-Type": "application/json",
    timeout: 1000,
  },
});

export default instance;
