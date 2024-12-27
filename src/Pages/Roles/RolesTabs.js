import React, { useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import RolesTable from "./RolesTable/RolesTable";


const RolesTabs = () => {


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
    <Tabs
      defaultActiveKey="customer"
      id="justify-tab-example"
      className="custom-tabs mb-3 m-3"
      justify
    >
      <Tab eventKey="customer" title="Cook">
        <RolesTable
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
        <RolesTable
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
        <RolesTable
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
    </Tabs>
  );
};

export default RolesTabs;
