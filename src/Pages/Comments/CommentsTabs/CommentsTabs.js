import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import CommonCommentsTab from "./CommonCommentsTab/CommonCommentsTab";

const CommentsTabs = () => {
  return (
    <Tabs
      defaultActiveKey="customer"
      id="justify-tab-example"
      className="custom-tabs mb-3 m-3"
      justify
    >
      <Tab eventKey="customer" title="Customer">
        {/* <CommonInquiriesTab /> */}
        <CommonCommentsTab/>
      </Tab>
      <Tab eventKey="partner" title="Partner">
        {/* <CommonInquiriesTab /> */}
        <CommonCommentsTab/>

      </Tab>
      
    </Tabs>
  );
};

export default CommentsTabs;
