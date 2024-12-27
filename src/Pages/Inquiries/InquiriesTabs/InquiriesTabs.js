import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import CommonInquiriesTab from "./CommonInquiriesTab/CommonInquiriesTab";

const InquiriesTabs = () => {
  return (
    <Tabs
      defaultActiveKey="customer"
      id="justify-tab-example"
      className="custom-tabs mb-3 m-3"
      justify
    >
      <Tab eventKey="customer" title="Customer">
        <CommonInquiriesTab />
      </Tab>
      <Tab eventKey="partner" title="Partner">
        <CommonInquiriesTab />
      </Tab>
      
    </Tabs>
  );
};

export default InquiriesTabs;
