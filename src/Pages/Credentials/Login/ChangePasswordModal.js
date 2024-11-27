import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import './Modal.css';

const ChangePasswordModal = ({ isOpen, onHide, onPasswordReset }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [passwordCriteria, setPasswordCriteria] = useState([]);

    const validatePassword = (password) => {
        const passwordRequirements = [
            { regex: /.{8,}/, message: 'at least 8 characters long' },
            { regex: /[A-Z]/, message: 'at least one uppercase letter' },
            { regex: /[a-z]/, message: 'at least one lowercase letter' },
            { regex: /[0-9]/, message: 'at least one number' },
            { regex: /[!@#$%^&*]/, message: 'at least one special character (e.g., !@#$%^&*)' }
        ];

        const failedRequirements = passwordRequirements
            .filter(req => !req.regex.test(password))
            .map(req => req.message);

        return failedRequirements;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const criteriaErrors = validatePassword(password);
        if (criteriaErrors.length > 0) {
            setPasswordCriteria(criteriaErrors);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setError('');
        setPasswordCriteria([]);
        onPasswordReset(password);
    };

    const handleSignInClick = () => {
        onHide();
    };

    return (
        <Modal show={isOpen} onHide={onHide} centered>
            <Modal.Header>
                <Modal.Title>Reset Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="password">
                        <Form.Label className='login-label'>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            className='login-input-forpass'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="confirmPassword">
                        <Form.Label className='login-label'>Confirm New Password</Form.Label>
                        <Form.Control
                            type="password"
                            className='login-input-forpass'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        {/* Display password criteria near "Confirm New Password" */}
                        {passwordCriteria.length > 0 && (
                            <div className='text-danger mt-2'>
                                {passwordCriteria.map((msg, index) => (
                                    <div key={index}>{`- ${msg}`}</div>
                                ))}
                            </div>
                        )}
                        {error && <Form.Text className='text-danger'>{error}</Form.Text>}
                    </Form.Group>

                    <Button variant="primary" type="submit" className='login-btn'>
                        Save Changes
                    </Button>
                    <div className='modal-sign-btn'>
                        <Button type="button" className='SignIn-btn' onClick={handleSignInClick}>
                            Sign In
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ChangePasswordModal;






// import React, { useState } from 'react';
// import { Modal, Button, Form, Spinner } from 'react-bootstrap'; // Import Spinner for loader
// import { toast } from 'react-toastify'; // Import toast notification library
// import './Modal.css';
// import { SignInforgotPasswordAPI } from '../../../utils/APIs/credentialsApis';

// const ChangePasswordModal = ({ isOpen, onHide, onPasswordReset }) => {
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false); // For loading state

//     // Function to handle form submission
//     const handleSubmit = async (event) => {
//         event.preventDefault();
        
//         // Validate password and confirmPassword
//         if (password !== confirmPassword) {
//             setError('Passwords do not match');
//             toast.error('Passwords do not match'); // Show toast error
//             return;
//         }

//         setError(''); // Clear any previous error

//         try {
//             setLoading(true); // Set loading state to true

//             // API call to reset password
//             const formData = { password }; // Prepare the data
//             const response = await SignInforgotPasswordAPI(formData); // Call API

//             if (response && response.data && response.data.success) {
//                 toast.success('Password has been reset successfully');
//                 onPasswordReset(password); // Notify parent component
//                 onHide(); // Close modal
//             } else {
//                 toast.error(response.data.error || 'Failed to reset password');
//             }
//         } catch (error) {
//             console.error('Error resetting password:', error);
//             toast.error('An error occurred while resetting the password');
//         } finally {
//             setLoading(false); // Stop loading
//         }
//     };

//     const handleSignInClick = () => {
//         onHide(); // Close the modal when "Sign In" button is clicked
//     };

//     return (
//         <Modal show={isOpen} onHide={onHide} centered>
//             <Modal.Header>
//                 <Modal.Title>Reset Password</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 {loading && ( // Show the loader only when loading is true
//                     <div className="text-center mb-3">
//                         <Spinner animation="border" role="status">
//                             <span className="sr-only">Loading...</span>
//                         </Spinner>
//                     </div>
//                 )}
//                 <Form onSubmit={handleSubmit}>
//                     <Form.Group controlId="password">
//                         <Form.Label className='login-label'>New Password</Form.Label>
//                         <Form.Control
//                             type="password"
//                             className='login-input-forpass'
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                         />
//                         <Form.Label className='login-label'>Confirm New Password</Form.Label>
//                         <Form.Control
//                             type="password"
//                             className='login-input-forpass'
//                             value={confirmPassword}
//                             onChange={(e) => setConfirmPassword(e.target.value)}
//                             required
//                         />
//                         {error && <Form.Text className='text-danger'>{error}</Form.Text>}
//                     </Form.Group>
//                     <Button variant="primary" type="submit" className='login-btn' disabled={loading}>
//                         Save Changes
//                     </Button>
//                     <div className='modal-sign-btn'>
//                         <Button type="button" className='SignIn-btn' onClick={handleSignInClick}>
//                             Sign In
//                         </Button>
//                     </div>
//                 </Form>
//             </Modal.Body>
//         </Modal>
//     );
// };

// export default ChangePasswordModal;
