
import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "../Support/SupportTabs/SupportTabs.css"; 
import CustomerReward from "./CustomerReward/CustomerReferAndEarn";
import PartnerReward from "./PartnerReward/PartnerReferAndEarn";

const RewardTab = () => {
  return (
    <>
      <h2>Reward Configuration</h2>
      <Tabs
      defaultActiveKey="customer"
      id="justify-tab-example"
      className="custom-tabs mb-3 m-3"
      justify
    >
      <Tab eventKey="customer" title="Customer Reward" >
        <CustomerReward/>
      </Tab>
      <Tab eventKey="partner" title="Partner Reward">
        <PartnerReward/>
      </Tab>
    </Tabs>
    </>
  );
};

export default RewardTab;
