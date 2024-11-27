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


// for display restaurant data in table 
export async function RestaurantTableAPI() {
    return withAuthorization(async () => {
      const response = await axiosInstance.get("/user/get_dashboard_data_api");
      return response;
    });
  }

//   edit resatuarant status and input commission
export async function EditRestaurantStatusinAPI(data) {
    return withAuthorization(async () => {
      const response = await axiosInstanceNoAuth.put("/api/auth/superadminlogin", data);
      return response;
    });
  }

// for display restaurant data of user table inside the modal 
export async function UserTableOfRestaurantModalAPI() {
  return withAuthorization(async () => {
    const response = await axiosInstance.get("/user/get_dashboard_data_api");
    return response;
  });
}

// for display order details of user inside the table of particular restaurant
export async function OrderOfUserRestaurantModalAPI() {
  return withAuthorization(async () => {
    const response = await axiosInstance.get("/user/get_dashboard_data_api");
    return response;
  });
}

// for display restaurant details inside the modal
export async function DisplayRestaurantDetailsModalAPI() {
  return withAuthorization(async () => {
    const response = await axiosInstance.get("/user/get_dashboard_data_api");
    return response;
  });
}
