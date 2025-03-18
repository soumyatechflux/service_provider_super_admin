
import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "../Support/SupportTabs/SupportTabs.css";
import CustomerReferalTable from "./CustomerReferalTable/CustomerReferalTable";
import PartnerReferalTable from "./PartnerReferalTable/PartnerReferalTable";
import PayoutPartner from "./PayoutPartner/PayoutPartner";
import PayoutCustomer from "./PayoutCustomer/PayoutCustomer";

const ReferalTable = () => {
  return (
    <>
    <h2>Referral Table</h2>
    <Tabs
      defaultActiveKey="customer"
      id="justify-tab-example"
      className="custom-tabs mb-3 m-3"
      justify
    >
      <Tab eventKey="customer" title="Customer Referral" >
        <CustomerReferalTable/>
      </Tab>
      <Tab eventKey="partner" title="Partner Referral">
        <PartnerReferalTable/>
      </Tab>
     
      <Tab eventKey="customer-payout" title="Customer Referral Payout">
  <PayoutCustomer />
</Tab>
   
      <Tab eventKey="partner-payout" title="Partner Referral Payout">
  <PayoutPartner />
</Tab>
      
    </Tabs>
    </>
  );
};

export default ReferalTable;
