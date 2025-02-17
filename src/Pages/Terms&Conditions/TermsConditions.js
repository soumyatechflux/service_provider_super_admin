
// import React, { useEffect, useState } from "react";
// import "../../Template/LayoutMain/LayoutMain/Layout.css";
// import TermsAndConditionText from "./TermsAndConditionText";



// const TermsConditions = () => {
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
//         <TermsAndConditionText/>
       

//       </div>
//     </>
//   );
// };

// export default TermsConditions;





import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
// import "./SupportTabs.css"; 
import TermsAndConditionCustomer from "./TermsAndConditionCustomer";
import TermsAndConditionPatner from "./TermsAndConditionPatner";

const TermsConditions = () => {
  return (
    <>
    <h2>Terms and Conditions</h2>
    <Tabs
      defaultActiveKey="customer"
      id="justify-tab-example"
      className="custom-tabs mb-3 m-3"
      justify
    >
      <Tab eventKey="customer" title="Customer" >
        <TermsAndConditionCustomer />
      </Tab>
      <Tab eventKey="partner" title="Partner">
      <TermsAndConditionPatner />
      </Tab>
    </Tabs>
    </>
  );
};

export default TermsConditions;

