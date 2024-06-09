import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const axiosInstance = axios.create({
  withCredentials: true  // This allows sending cookies cross-origin
});

const sendOtp = (email) => {
  return axiosInstance.post(`${API_URL}/send-otp`, { email });
};

const verifyOtp = (email, otp) => {
  return axiosInstance.post(`${API_URL}/verify-otp`, { email, otp });
};

export default { sendOtp, verifyOtp };