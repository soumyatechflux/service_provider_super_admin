import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import CommonPricingTab from "./CommonPricingTab/CommonPricingTab";


const PricingTabs = () => {

  return (
    <Tabs
      defaultActiveKey="customer"
      id="justify-tab-example"
      className="custom-tabs mb-3 m-3"
      justify
    >
      <Tab eventKey="customer" title="Cook" >

        <CommonPricingTab/>
        
      </Tab>
      <Tab eventKey="partner" title="Driver">
        
        <CommonPricingTab/>

      </Tab>
      <Tab eventKey="gardener" title="Gardener">
        
        <CommonPricingTab/>

      </Tab>
    </Tabs>
  );
};

export default PricingTabs;