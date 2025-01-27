import React from "react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light  sticky-top">
        <div className="nav-container nav-container-flex">


       
        <img 
              src="/images/SP_Logo.png" 
              alt="Servyo Logo" 
              className="navbar-brand-logo" 
              style={{ height: "50px", cursor: "pointer",width:"160px" }}
            />


        </div>
      </nav>
    </>
  );
};

export default Navbar;
