import axios from "axios";
import authService from "./authService";

// Directly set the base URL
const BASE_URL = "your api key"; // Replace with the actual base URL
console.log("Base URL:", BASE_URL);

// Helper function to set authorization headers
const setAuthorizationHeader = (accessToken: string, xToken?: string): void => {
  axios.defaults.headers.common["accessToken"] = accessToken;
  if (xToken) {
    axios.defaults.headers.common["xToken"] = xToken;
  }
};

// Request OTP using Aadhaar number
const requestOtp = async (txnId: string, aadharNo: string) => {
  const accessToken = await authService.getAccessToken();
  setAuthorizationHeader(accessToken);
  const payload = { txnId, aadharNo };
  const response = await axios.post(`${BASE_URL}/request-otp`, payload);
  return { data: { ...response.data, txnId: response.data.txnId } };
};

// Enroll by Aadhaar
const enrollByAadhaar = async (txnId: string, otpValue: string, mobile: string) => {
  const accessToken = await authService.getAccessToken();
  setAuthorizationHeader(accessToken);
  const payload = { txnId, otpValue, mobile };
  return axios.post(`${BASE_URL}/enrol-by-aadhaar`, payload);
};

// Request OTP by mobile number
const requestOtpByMobile = async (txnId: string, mobileNo: string) => {
  const accessToken = await authService.getAccessToken();
  setAuthorizationHeader(accessToken);
  const payload = { txnId, mobileNo };
  return axios.post(`${BASE_URL}/request-otp-by-mobile`, payload);
};

// Authenticate by ABDM
const authenticateByAbdm = async (txnId: string, otpValue: string) => {
  const accessToken = await authService.getAccessToken();
  setAuthorizationHeader(accessToken);
  const payload = { txnId, otpValue };
  return axios.post(`${BASE_URL}/authenticate-by-abdm`, payload);
};

// Get enroll suggestion
const enrollSuggestion = async (txnId: string) => {
  const accessToken = await authService.getAccessToken();
  setAuthorizationHeader(accessToken);
  return axios.get(`${BASE_URL}/enroll-suggestion`, { params: { txnId } });
};

// Enroll ABHA address
const enrollAbhaAddress = async (txnId: string, abhaAddress: string, xToken: string) => {
  const accessToken = await authService.getAccessToken();
  setAuthorizationHeader(accessToken);
  const payload = { txnId, abhaAddress };
  axios.defaults.headers.common["xToken"] = `${xToken}`;
  return axios.post(`${BASE_URL}/enroll-abha-address`, payload);
};

// Get profile account information
const getProfileAccount = async (xToken: string) => {
  const accessToken = await authService.getAccessToken();
  setAuthorizationHeader(accessToken, xToken);
  return axios.get(`${BASE_URL}/profile-account`);
};

// Get ABHA card
const getAbhaCard = async (xToken: string) => {
  try {
    const accessToken = await authService.getAccessToken();
    setAuthorizationHeader(accessToken, xToken);
    return await axios.get(`${BASE_URL}/abha-card`);
  } catch (error) {
    console.error("Error fetching ABHA card:", error);
    throw error;
  }
};

const ABHACreationService = {
  requestOtp,
  enrollByAadhaar,
  requestOtpByMobile,
  authenticateByAbdm,
  enrollSuggestion,
  enrollAbhaAddress,
  getProfileAccount,
  getAbhaCard,
};

export default ABHACreationService;
