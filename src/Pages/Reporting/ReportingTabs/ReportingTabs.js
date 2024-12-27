import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

const ReportingTabs = () => {
  return (
    <Tabs
      defaultActiveKey="customer"
      id="justify-tab-example"
      className="custom-tabs mb-3 m-3"
      justify
    >
      <Tab eventKey="customer" title="Cook">
        
      </Tab>
      <Tab eventKey="partner" title="Driver">
        
      </Tab>
      <Tab eventKey="gardener" title="Gardener">
        
      </Tab>
    </Tabs>
  );
};

export default ReportingTabs;

