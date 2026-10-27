import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
});

export const checkUsername = async (username) => {
  const response = await API.get("/users", {
    params: { username },
  });

  return response.data.length > 0;
};

export const checkEmail = async (email) => {
  const response = await API.get("/users", {
    params: { 
        email: email.trim().toLowerCase(),
     },
  });

  return response.data.length > 0;
};

export const registerUser = async (userData) => {
  const response = await API.post("/users", userData);
  return response.data;
};

export const loginUser = async ({ email, password }) => {
  const response = await API.get("/users", {
    params: { email, password },
  });

  if (response.data.length === 0) {
    throw new Error("Invalid email or password");
  }

  return response.data[0];
};

export const getUserById = async (id) => {
  const response = await API.get(`/users/${id}`);
  return response.data;
};

export default API;