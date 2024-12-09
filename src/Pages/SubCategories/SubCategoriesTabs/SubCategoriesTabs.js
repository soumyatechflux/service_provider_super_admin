import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import CookCategoriesTab from "./CookCategoriesTab/CookCategoriesTab";
import DriverSubCategoriTab from "./DriverSubCategoriTab/DriverSubCategoriTab";
import GardenerSubCategoryTab from "./GardenerSubCategoryTab/GardenerSubCategoryTab";


const SubCategoriesTabs = () => {

  return (
    <Tabs
      defaultActiveKey="customer"
      id="justify-tab-example"
      className="custom-tabs mb-3 m-3"
      justify
    >
      <Tab eventKey="customer" title="Cook" >
        
        <CookCategoriesTab/>
      </Tab>
      <Tab eventKey="partner" title="Driver">
        
        <DriverSubCategoriTab/>
      </Tab>
      <Tab eventKey="gardener" title="Gardener">
        
        <GardenerSubCategoryTab/>
      </Tab>
    </Tabs>
  );
};

export default SubCategoriesTabs;