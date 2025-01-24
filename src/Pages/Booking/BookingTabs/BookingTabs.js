
import React, { useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import axios from "axios";
import { toast } from "react-toastify";
import CommonBookingTab from "./CommonBookingTab/CommonBookingTab";

const BookingTabs = () => {


  const [loading, setLoading] = useState(false); // Simulating loader state
  const [selectedItem, setSelectedItem] = useState(null); // Selected item for modal
  const [showModal, setShowModal] = useState(false); // Modal visibility state



  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };


  return (
    <>
    <h2>Bookings</h2>
    <Tabs
      defaultActiveKey="customer"
      id="justify-tab-example"
      className="custom-tabs mb-3 m-3"
      justify
    >
      <Tab eventKey="customer" title="Cook">
        <CommonBookingTab
          category_id="1"
          loading={loading}
          setLoading={setLoading}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          showModal={showModal}
          setShowModal={setShowModal}
          handleCloseModal={handleCloseModal}
        />
      </Tab>
      <Tab eventKey="partner" title="Driver">
        <CommonBookingTab
          category_id="2"
          loading={loading}
          setLoading={setLoading}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          showModal={showModal}
          setShowModal={setShowModal}
          handleCloseModal={handleCloseModal}
        />
      </Tab>
      <Tab eventKey="gardener" title="Gardener">
        <CommonBookingTab
          category_id="3"
          loading={loading}
          setLoading={setLoading}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          showModal={showModal}
          setShowModal={setShowModal}
          handleCloseModal={handleCloseModal}
        />
      </Tab>
    </Tabs>
    </>
  );
};

export default BookingTabs;
