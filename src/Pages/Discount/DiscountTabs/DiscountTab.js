import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import CommonDiscountTab from "./CommonDiscoutTab/CommonDiscountTab";

const DiscountTabs = () => {
  return (
    <Tabs
      defaultActiveKey="customer"
      id="justify-tab-example"
      className="custom-tabs mb-3 m-3"
      justify
    >
      <Tab eventKey="customer" title="Cook">
        <CommonDiscountTab />
      </Tab>
      <Tab eventKey="partner" title="Driver">
        <CommonDiscountTab />
      </Tab>
      <Tab eventKey="gardener" title="Gardener">
        <CommonDiscountTab />
      </Tab>
    </Tabs>
  );
};

export default DiscountTabs;
