import React, { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import VerifiedPartnerTab from "./VerifiedPartnerTab/VerifiedPartnerTab";
import { useNavigate } from "react-router-dom";

const CommissionTable = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [ShowVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState(null);

  const navigate = useNavigate();

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowDetailsModal(true);
  };
  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedRestaurant(null);
  };

  const handleVerifyClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowVerifyModal(true);
  };

  const handleCloseVerifyModal = () => {
    setShowVerifyModal(false);
    setSelectedRestaurant(null);
  };

  const handleDeleteClick = (partner) => {
    setPartnerToDelete(partner);
    setShowDeleteModal(true);
  };

  const handleNavigateToVerifyCook = (restaurant, id, isVerify) => {
    setSelectedId(restaurant);
    navigate("/verify-partner", { state: { restaurant, id, isVerify } });
  };

  // Separate verified and unverified restaurants
  const verifiedRestaurants = restaurants.filter(
    (restaurant) => restaurant.is_verify === 1
  );
  const unverifiedRestaurants = restaurants.filter(
    (restaurant) => restaurant.is_verify === 0
  );

  return (
    <Tabs
      defaultActiveKey="verified-partners"
      id="justify-tab-example"
      className="custom-tabs mb-3 m-3"
      justify
    >
      <Tab eventKey="verified-partners" title="Verified Partners">
        <VerifiedPartnerTab
          restaurants={verifiedRestaurants}
          setRestaurants={setRestaurants}
          loading={loading}
          setLoading={setLoading}
          showDetailsModal={showDetailsModal}
          setShowDetailsModal={setShowDetailsModal}
          ShowVerifyModal={ShowVerifyModal}
          setShowVerifyModal={setShowVerifyModal}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          selectedRestaurant={selectedRestaurant}
          setSelectedRestaurant={setSelectedRestaurant}
          navigate={navigate}
          handleRestaurantClick={handleRestaurantClick}
          handleCloseDetailsModal={handleCloseDetailsModal}
          handleVerifyClick={handleVerifyClick}
          handleCloseVerifyModal={handleCloseVerifyModal}
          handleNavigateToVerifyCook={handleNavigateToVerifyCook}
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          partnerToDelete={partnerToDelete}
          setPartnerToDelete={setPartnerToDelete}
          handleDeleteClick={handleDeleteClick}
        />
      </Tab>
      <Tab
        eventKey="unverified-partners"
        title="Unverified Partners"
        className=""
      >
        <VerifiedPartnerTab
          restaurants={unverifiedRestaurants}
          setRestaurants={setRestaurants}
          loading={loading}
          setLoading={setLoading}
          showDetailsModal={showDetailsModal}
          setShowDetailsModal={setShowDetailsModal}
          ShowVerifyModal={ShowVerifyModal}
          setShowVerifyModal={setShowVerifyModal}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          selectedRestaurant={selectedRestaurant}
          setSelectedRestaurant={setSelectedRestaurant}
          navigate={navigate}
          handleRestaurantClick={handleRestaurantClick}
          handleCloseDetailsModal={handleCloseDetailsModal}
          handleVerifyClick={handleVerifyClick}
          handleCloseVerifyModal={handleCloseVerifyModal}
          handleNavigateToVerifyCook={handleNavigateToVerifyCook}
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          partnerToDelete={partnerToDelete}
          setPartnerToDelete={setPartnerToDelete}
          handleDeleteClick={handleDeleteClick}
        />
      </Tab>
    </Tabs>
  );
};

export default CommissionTable;
