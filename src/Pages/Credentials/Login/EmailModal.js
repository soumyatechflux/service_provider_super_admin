import React, { useState } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { FaAngleLeft } from "react-icons/fa6";
import './Modal.css'; 

const EmailModal = ({ isOpen, onHide, onEmailSubmit }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        onEmailSubmit(email); 
    };

    const handleSignInClick = () => {
        onHide(); // Close the modal when "Sign In" button is clicked
    };

    return (
        <Modal show={isOpen} onHide={onHide} centered>
            <Modal.Header>
                <Modal.Title><FaAngleLeft /> Oops! Forgot Password?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="email">
                        <Form.Label className='login-label'>Email</Form.Label>
                        <Form.Control
                            type="email"
                            className='login-input-forpass'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <button variant="primary" type="submit" className='login-btn'>
                        Submit
                    </button>
                    <div className='modal-sign-btn'>
                        <button type="button" className='SignIn-btn' onClick={handleSignInClick}>
                            Sign In
                        </button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EmailModal;


// import React, { useState } from 'react';
// import { Modal, Form } from 'react-bootstrap';
// import { FaAngleLeft } from "react-icons/fa6";
// import { toast, ToastContainer } from 'react-toastify'; 
// import { SignInforgotPasswordAPI } from '../../../utils/APIs/credentialsApis';
// import './Modal.css'; 

// const EmailModal = ({ isOpen, onHide, onEmailSubmit }) => {
//     const [email, setEmail] = useState('');

//     // Function to validate email format using regular expression
//     const isValidEmail = (email) => {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return emailRegex.test(email);
//     };

//     const handleSubmit = async (event) => {
//         event.preventDefault();

//         // Check if the email field is empty
//         if (!email) {
//             toast.error('Email field cannot be empty.'); 
//             return;
//         }

//         // Check if the email format is valid
//         if (!isValidEmail(email)) {
//             toast.error('Please enter a valid email address.'); 
//             return;
//         }

//         try {
//             const response = await SignInforgotPasswordAPI({ email });
//             onEmailSubmit(email);
//             toast.success('Email submitted successfully!'); // Success message
//         } catch (error) {
//             toast.error('Failed to submit email. Please try again.');
//         }
//     };

//     const handleSignInClick = () => {
//         onHide(); 
//     };

//     return (
//         <>
//             <Modal show={isOpen} onHide={onHide} centered>
//                 <Modal.Header>
//                     <Modal.Title><FaAngleLeft /> Oops! Forgot Password?</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Form onSubmit={handleSubmit}>
//                         <Form.Group controlId="email">
//                             <Form.Label className='login-label'>Email</Form.Label>
//                             <Form.Control
//                                 type="email"
//                                 className='login-input-forpass'
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 required
//                             />
//                         </Form.Group>
//                         <button variant="primary" type="submit" className='login-btn'>
//                             Submit
//                         </button>
//                         <div className='modal-sign-btn'>
//                             <button type="button" className='SignIn-btn' onClick={handleSignInClick}>
//                                 Sign In
//                             </button>
//                         </div>
//                     </Form>
//                 </Modal.Body>
//             </Modal>
//             <ToastContainer /> {/* Toast container for displaying notifications */}
//         </>
//     );
// };

// export default EmailModal;

