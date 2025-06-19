import axios from "axios";

const baseURL = "http://MAINSERVER:7176/api/Authenticate"; // Replace with your actual base URL

const authService = {
  getAccessToken: async () => {
    try {
      const response = await axios.get(`${baseURL}/api/Authenticate/get-access-token`);
      if (response.data && response.data.accessToken) {
        return response.data.accessToken;
      } else {
        throw new Error("Failed to retrieve access token");
      }
    } catch (error) {
      console.error("Error fetching access token:", error);
      throw error;
    }
  },
};

export default authService;
