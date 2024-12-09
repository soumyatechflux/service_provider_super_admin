import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import SupportCustomerTab from "./SupportCustomerTab/SupportCustomerTab";
import SupportPartnerTab from "./SupportPartnerTab/SupportPartnerTab";
import "./SupportTabs.css"; // Import custom CSS

const SupportTabs = () => {
  return (
    <Tabs
      defaultActiveKey="customer"
      id="justify-tab-example"
      className="custom-tabs mb-3 m-3"
      justify
    >
      <Tab eventKey="customer" title="Customer Support" >
        <SupportCustomerTab />
      </Tab>
      <Tab eventKey="partner" title="Partner Support">
        <SupportPartnerTab />
      </Tab>
    </Tabs>
  );
};

export default SupportTabs;
