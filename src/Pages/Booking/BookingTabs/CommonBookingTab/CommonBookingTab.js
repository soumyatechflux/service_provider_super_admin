// import React, { useEffect, useState } from "react";
// import Loader from "../../../Loader/Loader";
// import axios from "axios";
// import { toast } from "react-toastify";

// const CommonBookingTab = ({
//   category_id,
//   loading,
//   setLoading,
//   selectedItem,
//   setSelectedItem,
//   showModal,
//   setShowModa,
//   handlePayNowClick,
//   handleCloseModal,
// }) => {
//   // Sample data constant
//   const [dummy_Data, setDummy_Data] = useState([]);

//   const getCommissionData = async (category_id) => {
//     try {
//       const token = sessionStorage.getItem(
//         "TokenForSuperAdminOfServiceProvider"
//       );

//       setLoading(true);

//       const response = await axios.get(
//         `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/bookings`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setLoading(false);

//       if (response?.status === 200 && response?.data?.success) {
//         const data = response?.data?.data || [];

//         setDummy_Data(data);

//         console.log("dasd", data);
//       } else {
//         toast.error(response.data.message || "Failed to fetch commission.");
//         setLoading(false);
//       }
//     } catch (error) {
//       console.error("Error fetching commission:", error);
//       toast.error("Failed to load commission. Please try again.");
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getCommissionData(category_id);
//   }, [category_id]);

//   return (
//     <div className="SubCategory-Table-Main p-3">
//       {loading ? (
//         <Loader />
//       ) : (
//         <div className="table-responsive mb-5">
//           <table className="table table-bordered table-user">
//             <thead className="heading_user">
//               <tr>
//                 <th scope="col" style={{ width: "5%" }}>
//                   Sr.
//                 </th>
//                 <th scope="col" style={{ width: "10%" }}>
//                   Customer Name
//                 </th>
//                 <th scope="col" style={{ width: "10%" }}>
//                   Partner Name
//                 </th>
//                 <th scope="col" style={{ width: "10%" }}>
//                   Sub Category
//                 </th>
//                 <th scope="col" style={{ width: "10%" }}>
//                   Amount
//                 </th>
//                 <th scope="col" style={{ width: "10%" }}>
//                   Address
//                 </th>
//                 <th scope="col" style={{ width: "10%" }}>
//                   Status
//                 </th>
//                 <th scope="col" style={{ width: "10%" }}>
//                   Booking Date
//                 </th>
//                 <th scope="col" style={{ width: "5%" }}>
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {dummy_Data.map((item, index) => (
//                 <tr key={item.id}>
//                   <th scope="row">{index + 1}.</th>
//                   <td>{item.guest_name || "N/A"}</td>
//                   <td>{item.partner?.name || "Unknown"}</td>
//                   <td>
//                     {item.sub_category_name?.sub_category_name || "Unknown"}
//                   </td>
//                   <td>{item.price || "N/A"}</td>
//                   <td>
//                     {item.address_from || "No current_address available."}
//                   </td>
//                   <td>
//                     {item.booking_status || "No current_address available."}
//                   </td>
//                   <td>
//                     {new Intl.DateTimeFormat("en-GB", {
//                       day: "2-digit",
//                       month: "short",
//                       year: "numeric",
//                     }).format(new Date(item.created_at))}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CommonBookingTab;


import React, { useEffect, useState } from "react";
import Loader from "../../../Loader/Loader";
import axios from "axios";
import { toast } from "react-toastify";

const CommonBookingTab = ({
  category_id,
  loading,
  setLoading,
}) => {
  const [dummy_Data, setDummy_Data] = useState([]);

  const getCommissionData = async () => {
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );

      setLoading(true);

      const response = await axios.get(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);

      if (response?.status === 200 && response?.data?.success) {
        const data = response?.data?.data || [];

        // Filter data based on category_id
        const filteredData = data.filter(
          (item) => item.category_id === parseInt(category_id, 10)
        );

        setDummy_Data(filteredData);

        console.log("Filtered Data:", filteredData);
      } else {
        toast.error(response.data.message || "Failed to fetch bookings.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getCommissionData();
  }, [category_id]);

  return (
    <div className="SubCategory-Table-Main p-3">
      {loading ? (
        <Loader />
      ) : (
        <div className="table-responsive mb-5">
          <table className="table table-bordered table-user">
            <thead className="heading_user">
              <tr>
                <th scope="col" style={{ width: "5%" }}>
                  Sr.
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Customer Name
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Partner Name
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Sub Category
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Amount
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Address
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Status
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Booking Date
                </th>
                {/* <th scope="col" style={{ width: "5%" }}>
                  Action
                </th> */}
              </tr>
            </thead>
            <tbody>
              {dummy_Data.map((item, index) => (
                <tr key={item.id}>
                  <th scope="row">{index + 1}.</th>
                  <td>{item.guest_name || "N/A"}</td>
                  <td>{item.partner?.name || "Unknown"}</td>
                  <td>
                    {item.sub_category_name?.sub_category_name || "Unknown"}
                  </td>
                  <td>{item.price || "N/A"}</td>
                  <td>
                    {item.address_from || "No current_address available."}
                  </td>
                  <td>
                    {item.booking_status || "No current_address available."}
                  </td>
                  <td>
                    {new Intl.DateTimeFormat("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }).format(new Date(item.created_at))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CommonBookingTab;
