import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Modal.css";
import axios from "axios";
import Loader from "../../Loader/Loader";

const OtpModal = ({ isOpen, onHide, email ,SucMsg}) => {
  const [otp, setOtp] = useState(["", "", "", ""]);

  const userId = sessionStorage.getItem("newSignUpRestoUserId");


  const [timeRemaining, setTimeRemaining] = useState(20);
  const [showResend, setShowResend] = useState(false); // New state for resend button
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const value = e.target.value.slice(0, 1);

    // Only accept numbers
    if (!/^[0-9]$/.test(value) && value !== "") {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }

    if (!value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (otp.some((digit) => digit === "")) {
      toast.error("Please enter all 4 digits of the OTP.");
      return;
    }

    try {



      const body = {
        admin: {
          country_code: "+91",
          mobile: email,
          otp: Number(otp.join("")),
        },
      };



      setLoading(true);

      const response = await axios.post(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/otp-verify`,
        body
      );

      setLoading(false);



      if (response.data.success === true) {



        sessionStorage.clear();


        sessionStorage.setItem("isSuperAdminLoggedInOfServiceProvider", true);

        sessionStorage.setItem(
          "TokenForSuperAdminOfServiceProvider",
          response?.data?.token
        );


        navigate("/dashboard");
        toast.success(response?.data?.success_msg || "Login Successfully!");





        onHide();

      } else {
        toast.error(
          response.data.message || "Invalid OTP. Please try again."
        );
      }





    } catch (error) {
      setLoading(false);
      console.error("Error during OTP verification:", error);
      toast.error("Error verifying OTP. Please try again.");
    }
  };

  const handleSignInClick = () => {
    onHide();
  };

  const handleResend = async () => {
    try {
      const body = {

        // email: email,
        userId:userId,
        
      };


      setLoading(true);

      const response = await axios.post(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/otp-verify/asjnichjsc`,
        body
      );

      setLoading(false);

      if (response.data.response === true) {
        setTimeRemaining(20);
        setShowResend(false);

        // toast.info("Verification code resent to your email.");

             toast.info(response.data.success_msg || "Verification code resent to your email.");


      } else {
        toast.error(response.data.error_msg || "Failed. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setShowResend(true); // Show "Resend OTP" when the timer ends
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  return (
    <>
      <Modal show={isOpen} onHide={onHide} centered>
        {loading && <Loader />}

        <Modal.Header style={{ padding: "0" }}>
          {" "}
   
          <Modal.Title
            style={{
              width: "100%",
              padding: "10px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                margin: "0",
                fontSize: "24px",
                background: "linear-gradient(90deg, #fffacd, #ffebcd)",
                padding: "10px 0",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              Verify Account
            </h2>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Modal Body Content */}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="otp">


              {/* <label className="otp-label">
                Your verification code has been sent to your phone number. Please enter
                it here to verify.
              </label> */}



              <label className="otp-label">
              {SucMsg}
              </label>
           



              <div className="otp-input-container">
                {otp.map((digit, index) => (
                  <Form.Control
                    key={index}
                    type="text"
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    maxLength="1"
                    className="otp-input"
                    ref={(el) => (inputRefs.current[index] = el)}
                    required
                  />
                ))}
              </div>
            </Form.Group>

            {/* {showResend ? (
              <p
                className="timer resend-txt"
                onClick={handleResend}
                style={{
                  cursor: "pointer",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.textDecoration = "underline")
                }
                onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
              >
                Resend OTP
              </p>
            ) : (
              <p style={{ cursor: "default" }} className="timer resend-txt">
                {formatTime(timeRemaining)}
              </p>
            )} */}

            <hr />

            <div className="login-btn-container">
              <button
                type="submit"
                style={{ width: "50%" }}
                className="login-btn"
                disabled={loading}
              >
                {loading ? "Loading..." : "Verify"}
              </button>
            </div>

            <span
              style={{
                display: "block",
                textAlign: "center",
              }}
              className="CreateAccount-text"
            >
              OR
            </span>

            <div className="modal-sign-btn">
              <Button
                type="button"
                className="SignIn-btn"
                onClick={handleSignInClick}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default OtpModal;
