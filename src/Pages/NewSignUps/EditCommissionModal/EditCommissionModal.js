import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./EditCommissionModal.css";

const EditCommissionModal = ({
  show,
  handleClose,
  restaurant,
  setRestaurant,
  handleSubmit,
}) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header>
        <Modal.Title>Edit Restaurant</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="restaurantStatus">
            <Form.Label>Status</Form.Label>
            <Form.Control
              as="select"
              value={restaurant.status}
              onChange={(e) =>
                setRestaurant({ ...restaurant, status: e.target.value })
              }
            >
              <option value="approved">Paid</option>
              <option value="unapproved">Unpaid</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="primary"
          type="submit"
          onClick={handleSubmit} // Ensuring form submission
          className="btn-saveChanges-user"
        >
          Save Changes
        </Button>
        <Button
          variant="secondary"
          onClick={handleClose}
          className="btn-cancel-user"
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditCommissionModal;
 




// import React, { useState, useEffect } from "react";
// import { Modal, Button, Form } from "react-bootstrap";
// import { toast } from "react-toastify";
// import { EditCommissionStatusModalAPI } from "./../../../utils/APIs/CommissionApis/CommissionApi";
// import "./EditCommissionModal.css";

// const EditCommissionModal = ({
//   show,
//   handleClose,
//   restaurant,
//   setRestaurant,
//   handleSubmit,
// }) => {
//   const [loading, setLoading] = useState(false);

//   const handleEditCommissionStatus = async () => {
//     try {
//       setLoading(true);
//       const response = await EditCommissionStatusModalAPI(restaurant.id); 
//       setLoading(false);

//       if (
//         response &&
//         response?.data?.response &&
//         response?.data?.response?.response === true &&
//         response?.data?.response?.data
//       ) {
//         toast.success("Commission status updated successfully!");

        
//         setRestaurant((prevRestaurant) => ({
//           ...prevRestaurant,
//           status: response.data.response.data.status,
//         }));

//         handleClose(); 
//       } else {
//         toast.error("Failed to update the commission status.");
//       }
//     } catch (error) {
//       setLoading(false);
//       toast.error("An error occurred while updating the status.");
//     }
//   };

  
//   const handleSubmitForm = (event) => {
//     event.preventDefault();
//     handleEditCommissionStatus(); // Call API on submit
//   };

//   return (
//     <Modal show={show} onHide={handleClose} centered>
//       <Modal.Header>
//         <Modal.Title>Edit Restaurant</Modal.Title>
//       </Modal.Header>

//       <Modal.Body>
//         <Form onSubmit={handleSubmitForm}>
//           <Form.Group controlId="restaurantStatus">
//             <Form.Label>Status</Form.Label>
//             <Form.Control
//               as="select"
//               value={restaurant.status}
//               onChange={(e) =>
//                 setRestaurant({ ...restaurant, status: e.target.value })
//               }
//             >
//               <option value="approved">Paid</option>
//               <option value="unapproved">Unpaid</option>
//             </Form.Control>
//           </Form.Group>
//         </Form>
//       </Modal.Body>

//       <Modal.Footer>
//         <Button
//           variant="primary"
//           type="submit"
//           onClick={handleSubmitForm}
//           className="btn-saveChanges-user"
//           disabled={loading} 
//         >
//           {loading ? "Saving..." : "Save Changes"}
//         </Button>
//         <Button
//           variant="secondary"
//           onClick={handleClose}
//           className="btn-cancel-user"
//         >
//           Cancel
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default EditCommissionModal;
