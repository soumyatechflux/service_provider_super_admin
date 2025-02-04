
import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
// import "./SupportTabs.css"; 
import AlertCustomerTable from "../AlertCustomerTable/AlertCustomerTable";
import AlertPartnerTable from "../AlertPartnerTable/AlertPartnerTable";

const AlertCentreTab = () => {
  return (
    <>
    <h2>Alert Center</h2>
    <Tabs
      defaultActiveKey="customer"
      id="justify-tab-example"
      className="custom-tabs mb-3 m-3"
      justify
    >
      <Tab eventKey="customer" title="Customer" >
        <AlertCustomerTable />
      </Tab>
      <Tab eventKey="partner" title="Partner">
        <AlertPartnerTable />
      </Tab>
    </Tabs>
    </>
  );
};

export default AlertCentreTab;
