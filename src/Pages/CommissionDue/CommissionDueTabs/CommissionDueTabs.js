import React, { useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import CommonCommissionTab from "./CommonCommissionTab/CommonCommissionTab";
import PaymentHistoryTable from "../PaymentHistoryTable/PaymentHistoryTable";

const CommissionDueTabs = () => {


  const [loading, setLoading] = useState(false); // Simulating loader state
  const [selectedItem, setSelectedItem] = useState(null); // Selected item for modal
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  const handlePayNowClick = (item) => {
    setSelectedItem(item); // Set the item details for the modal
    setShowModal(true); // Show the modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };


  return (
    <>
    <h2>Weekly Payouts</h2>
    <Tabs
      defaultActiveKey="customer"
      id="justify-tab-example"
      className="custom-tabs mb-3 m-3"
      justify
    >
      <Tab eventKey="customer" title="Cook">
        <CommonCommissionTab
          category_id="1"
          loading={loading}
          setLoading={setLoading}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          showModal={showModal}
          setShowModal={setShowModal}
          handlePayNowClick={handlePayNowClick}
          handleCloseModal={handleCloseModal}
        />
      </Tab>
      <Tab eventKey="partner" title="Driver">
        <CommonCommissionTab
          category_id="2"
          loading={loading}
          setLoading={setLoading}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          showModal={showModal}
          setShowModal={setShowModal}
          handlePayNowClick={handlePayNowClick}
          handleCloseModal={handleCloseModal}
        />
      </Tab>
      <Tab eventKey="gardener" title="Gardener">
        <CommonCommissionTab
          category_id="3"
          loading={loading}
          setLoading={setLoading}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          showModal={showModal}
          setShowModal={setShowModal}
          handlePayNowClick={handlePayNowClick}
          handleCloseModal={handleCloseModal}
        />
      </Tab>

      <Tab eventKey="history" title="Payment History">
        <PaymentHistoryTable
          // category_id="3"
          loading={loading}
          setLoading={setLoading}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          showModal={showModal}
          setShowModal={setShowModal}
          handlePayNowClick={handlePayNowClick}
          handleCloseModal={handleCloseModal}
        />
      </Tab>
    </Tabs>
    </>
  );
};

export default CommissionDueTabs;
