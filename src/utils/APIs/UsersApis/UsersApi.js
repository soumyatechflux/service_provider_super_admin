import { axiosInstance, axiosInstanceNoAuth } from '../commonHeadApiLogic.js';
import { authorizeMe } from '../commonHeadApiLogic.js'

// Ensure authorization header is set before making authenticated requests
const withAuthorization = async (apiFunction, ...args) => {
  try {
    await authorizeMe(); // Ensure the Authorization header is set
    return await apiFunction(...args);
  } catch (error) {
    // Handle errors as necessary
    console.error("Error in API request:", error);
    throw error;
  }
};





// for display user data in table 
export async function UserTableAPI() {
    return withAuthorization(async () => {
      const response = await axiosInstance.get("/user/get_dashboard_data_api");
      return response;
    });
  }

// display orders in modal
export async function OrderModalAPI() {
    return withAuthorization(async () => {
      const response = await axiosInstance.get("/user/get_dashboard_data_api");
      return response;
    });
  }