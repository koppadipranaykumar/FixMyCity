import axios from "axios";
import API_BASE_URL from "../../config/api";
const API_URL = `${API_BASE_URL}/api/auth`;

export const registerUser = async (userData: any) => {
  const response = await axios.post(
    `${API_URL}/register`,
    userData
  );

  return response.data;
};

export const loginUser = async (userData: any) => {
  const response = await axios.post(
    `${API_URL}/login`,
    userData
  );

  return response.data;
};