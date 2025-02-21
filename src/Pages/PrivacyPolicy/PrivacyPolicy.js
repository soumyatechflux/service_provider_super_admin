
// import React, { useEffect, useState } from "react";
// import "../../Template/LayoutMain/LayoutMain/Layout.css";
// import PrivacypolicyText from "./PrivacypolicyText/PrivacypolicyText";

// const PrivacyPolicy = () => {
//   const [value, setValue] = useState(() => {
//     const storedValue = sessionStorage.getItem("isSidebarOpen");
//     return storedValue !== null ? JSON.parse(storedValue) : true;
//   });

//   // Effect to poll sessionStorage value repeatedly
//   useEffect(() => {
//     const checksessionStorage = () => {
//       const storedValue = sessionStorage.getItem("isSidebarOpen");
//       const parsedValue = storedValue !== null ? JSON.parse(storedValue) : true;

//       if (parsedValue !== value) {
//         setValue(parsedValue);
//         console.log("sessionStorage value updated:", parsedValue); // Log the updated value
//       }
//     };

//     // Polling interval in milliseconds (e.g., 10ms)
//     const intervalId = setInterval(checksessionStorage, 10);

//     // Cleanup function to clear the interval
//     return () => {
//       clearInterval(intervalId);
//     };
//   }, [value]);


//   return (
//     <>
 
//       <div
//         className={`content-container ${
//           value ? "sidebar-open" : "sidebar-closed"
//         }`}
//         style={{marginTop:"30px"}}
//       >
//         <PrivacypolicyText/>
       

//       </div>
//     </>
//   );
// };

// export default PrivacyPolicy;



import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
// import "./SupportTabs.css"; 
import CustomerPrivacypolicyText from "./CustomerPrivacypolicyText/CustomerPrivacypolicyText";
import PartnerPrivacyPolicy from "./PartnerPrivacyPolicy/PartnerPrivacyPolicy";

const PrivacyPolicy = () => {
  return (
    <>
    <h2>Privacy Policy</h2>
    <Tabs
      defaultActiveKey="customer"
      id="justify-tab-example"
      className="custom-tabs mb-3 m-3"
      justify
    >
      <Tab eventKey="customer" title="Customer" >
      <CustomerPrivacypolicyText/>
      </Tab>
      <Tab eventKey="partner" title="Partner">
      <PartnerPrivacyPolicy/>
      </Tab>
    </Tabs>
    </>
  );
};

export default PrivacyPolicy;

