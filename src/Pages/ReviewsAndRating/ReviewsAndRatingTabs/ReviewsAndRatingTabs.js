import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import CustomerReviewTabs from "./CustomerReviewTabs/CustomerReviewTabs";
import PartnerReviewTabs from "./PartnerReviewTabs/PartnerReviewTabs";
import './ReviewsAndRatingTabs.css'

const ReviewsAndRatingTabs = () => {
  return (
    <Tabs
      defaultActiveKey="customer-reviews"
      id="justify-tab-example"
      className="custom-tabs mb-3 m-3"
      justify
    >
      <Tab eventKey="customer-reviews" 
      title="Customer Reviews" 
      >
        
        <CustomerReviewTabs/>
      </Tab>
      <Tab eventKey="partner-reviews" title="Partner Reviews" className="">
        <PartnerReviewTabs/>
      </Tab>
    </Tabs>
  );
};

export default ReviewsAndRatingTabs;

