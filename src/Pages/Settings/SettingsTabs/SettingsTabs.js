import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import CommonSettingsTab from "../CommonSettingsTab/CommonSettingsTab";

const SettingsTabs = () => {
  return (
    <Tabs
      defaultActiveKey="customer"
      id="justify-tab-example"
      className="custom-tabs mb-3 m-3"
      justify
    >
      <Tab eventKey="customer" title="Cook">
        <CommonSettingsTab />
      </Tab>
      <Tab eventKey="partner" title="Driver">
        <CommonSettingsTab />
      </Tab>
      <Tab eventKey="gardener" title="Gardener">
        <CommonSettingsTab />
      </Tab>
    </Tabs>
  );
};

export default SettingsTabs;
