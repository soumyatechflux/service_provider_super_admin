import React, { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import CommonServicesTab from "./CommonServicesTab/CommonServicesTab";

const ServicesTabs = () => {
  const [activeTab, setActiveTab] = useState("cook");

  const getCategoryID = () => {
    switch (activeTab) {
      case "cook":
        return 1; // Category ID for Cook
      case "driver":
        return 2; // Category ID for Driver
      case "gardener":
        return 3; // Category ID for Gardener
      default:
        return 1;
    }
  };

  return (
    <>
     <h2>Services</h2>
    <Tabs
      activeKey={activeTab}
      onSelect={(key) => setActiveTab(key)}
      id="justify-tab-example"
      className="custom-tabs mb-3 m-3"
      justify
    >
      <Tab eventKey="cook" title="Cook">
        <CommonServicesTab categoryId={getCategoryID()} />
      </Tab>
      <Tab eventKey="driver" title="Driver">
        <CommonServicesTab categoryId={getCategoryID()} />
      </Tab>
      <Tab eventKey="gardener" title="Gardener">
        <CommonServicesTab categoryId={getCategoryID()} />
      </Tab>
    </Tabs>
    </>
  );
};

export default ServicesTabs;
