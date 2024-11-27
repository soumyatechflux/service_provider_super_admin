import React from "react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light  sticky-top">
        <div className="container nav-container nav-container-flex">


          {/* <a href="/" className="navbar-brand font-serif">
            Servgo
          </a> */}

          <span  style={{cursor:"default"}} className="navbar-brand font-serif">
            Servgo
          </span>


        </div>
      </nav>
    </>
  );
};

export default Navbar;
