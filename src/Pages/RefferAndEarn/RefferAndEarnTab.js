
import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "../Support/SupportTabs/SupportTabs.css"; 
import CustomerReferAndEarn from "./CustomerReferAndEarn/CustomerReferAndEarn";
import PartnerReferAndEarn from "./PartnerReferAndEarn/PartnerReferAndEarn";

const RefferAndEarnTab = () => {
  return (
    <>
    <h2>Refer And Earn</h2>
    <Tabs
      defaultActiveKey="customer"
      id="justify-tab-example"
      className="custom-tabs mb-3 m-3"
      justify
    >
      <Tab eventKey="customer" title="Customer Refer" >
        <CustomerReferAndEarn/>
      </Tab>
      <Tab eventKey="partner" title="Partner Refer">
        <PartnerReferAndEarn/>
      </Tab>
    </Tabs>
    </>
  );
};

export default RefferAndEarnTab;
