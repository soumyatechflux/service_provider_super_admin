import React, { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import CookCategoriesTab from "./CookCategoriesTab/CookCategoriesTab";
import DriverSubCategoriTab from "./DriverSubCategoriTab/DriverSubCategoriTab";
import GardenerSubCategoryTab from "./GardenerSubCategoryTab/GardenerSubCategoryTab";


const SubCategoriesTabs = () => {
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
    <h2>SubCategory</h2>
    <Tabs
      activeKey={activeTab}
      onSelect={(key) => setActiveTab(key)}
      id="justify-tab-example"
      className="custom-tabs mb-3 m-3"
      justify
    >
      <Tab eventKey="cook" title="Cook">
        <CookCategoriesTab category_id={getCategoryID()} />
      </Tab>
      <Tab eventKey="driver" title="Driver">
        <DriverSubCategoriTab category_id={getCategoryID()} />
      </Tab>
      <Tab eventKey="gardener" title="Gardener">
        <GardenerSubCategoryTab category_id={getCategoryID()} />
      </Tab>
    </Tabs>
    </>
  );
};

export default SubCategoriesTabs;