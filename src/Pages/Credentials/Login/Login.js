import React, { useState } from "react";
import OtpModal from "./OtpModal";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "./../../Loader/Loader";

const Login = () => {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");


  const [SucMsg, setSucMsg] = useState("");





  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateInputs = () => {
    let isValid = true;

    if (!email) {
      toast.error("Phone number is required");
      isValid = false;
    } else if (!/^\d{10}$/.test(email)) {
      toast.error("Please enter a valid 10-digit phone number");
      isValid = false;
    }
    

    return isValid;
  };

  const handleSignIn = async () => {

    
    if (!validateInputs()) {
      return;
    }

    try {
      setLoading(true);
      const body = {
        admin: {
          country_code: "+91",
          mobile: email,
        },
      };
      

      const response = await axios.post(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/login`,
        body
      );


      setLoading(false);

      if (response.data.success === true) {

        // toast.success(response.data.success_msg || "Login successful!");

        setStep(2);

    setSucMsg(response.data.message);


      } else {

        toast.error(
          response.data.message || "Login failed. Please try again."
        );

      }
    } catch (error) {
      setLoading(false);
      console.error("Error during login:", error);
      toast.error("An error occurred during login. Please try again later.");
    }
  };

  return (
    <>
      {loading && <Loader />}

      <div className="main-container" style={{marginTop:"12vh"}}>
        <div className="login-container">
          <form
            className="login-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSignIn();
            }}
          >
            <h2
              style={{
                cursor: "default",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                fontSize: "24px",
                background:
                  "linear-gradient(90deg, #fffacd, #ffebcd)" /* Light yellow gradient */,
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" /* Soft shadow */,
                padding: "10px 20px" /* Adds space around text */,
                borderRadius: "8px" /* Rounded corners */,
                marginBottom: "20px",
              }}
            >
              {/* <i className="fas fa-user" style={{ 
      fontSize: "24px", 
      position: "absolute", 
      left: "0" 
    }}></i>  */}
              <span style={{ textAlign: "center" }}>Super Admin - Login</span>
              {/* <i className="fas fa-user" style={{ 
      fontSize: "24px", 
      position: "absolute", 
      right: "0" 
    }}></i> */}
            </h2>

            <label htmlFor="email" className="login-label">
              Phone <span className="text-danger">*</span>
            </label>
         
            {/* <input
              type="phone"
              id="email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            /> */}


<div style={{ display: "flex", alignItems: "stretch" }}>
  <span
    style={{
      padding: "0 8px",
      backgroundColor: "#f5f5f5",
      border: "1px solid #ccc",
      borderRadius: "4px 0 0 4px",
      height: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    +91
  </span>
  <input
    type="tel"
    id="email"
    className="login-input"
    style={{
      flex: 1,
      padding: "0 8px",
      border: "1px solid #ccc",
      borderRadius: "0 4px 4px 0",
      height: "40px",
      outline: "none",
    }}
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="Enter your phone number"
    required
  />
</div>









            <div className="login-btn-container">
              <button
                type="submit"
                style={{ width: "30%" }}
                className="login-btn"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

            {/* <div
              style={{
                marginTop: "10px",
                alignContent: "center",
                textAlign: "center",
                alignItems: "center",
              }}
            >
              <Link
                to="/signup"
                style={{
                  textDecoration: "none",
                  marginTop: "10px",
                }}
              >
                <p
                  className="SignUp-LoginPage"
                  style={{
                    margin: "0",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.textDecoration = "underline")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.textDecoration = "none")
                  }
                >
                  Don't have an account? Sign up
                </p>
              </Link>
            </div> */}
          </form>
        </div>
    
        {step === 2 && (
          <OtpModal
            isOpen={step === 2}
            onHide={() => setStep(0)}
            email={email}
            SucMsg={SucMsg}
          />
        )}
    
      </div>
    </>
  );
};

export default Login;
