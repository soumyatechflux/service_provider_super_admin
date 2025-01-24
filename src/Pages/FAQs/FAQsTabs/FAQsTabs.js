import React, { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import CommonFAQsTab from "./CommonFAQsTab/CommonFAQsTab";

const FAQsTabs = () => {
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
    <h2>FAQs</h2>
    <Tabs
      activeKey={activeTab}
      onSelect={(key) => setActiveTab(key)}
      id="justify-tab-example"
      className="custom-tabs mb-3 m-3"
      justify
    >
      <Tab eventKey="cook" title="Cook">
        <CommonFAQsTab categoryID={getCategoryID()} />
      </Tab>
      <Tab eventKey="driver" title="Driver">
        <CommonFAQsTab categoryID={getCategoryID()} />
      </Tab>
      <Tab eventKey="gardener" title="Gardener">
        <CommonFAQsTab categoryID={getCategoryID()} />
      </Tab>
    </Tabs>
    </>
  );
};

export default FAQsTabs;
