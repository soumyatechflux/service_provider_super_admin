import { axiosInstance, axiosInstanceNoAuth } from './../commonHeadApiLogic.js';
import { authorizeMe } from './../commonHeadApiLogic.js'; // Ensure you import this function

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





// for display commission data in table 
export async function CommissionTableAPI() {
    return withAuthorization(async () => {
      const response = await axiosInstance.get("/user/get_dashboard_data_api");
      return response;
    });
  }

// display edit states in modal
export async function EditCommissionStatusModalAPI() {
    return withAuthorization(async () => {
      const response = await axiosInstance.put("/user/get_dashboard_data_api");
      return response;
    });
  }