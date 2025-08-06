
// import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

// const AttachmentModal = ({ open, attachments, onClose }) => {
//   const hiddenTitles = ["Front Of Car", "Back Of Car", "Cook Photos", "Garden Photos"];

//   const filterAttachments = (attachmentList) =>
//     attachmentList?.filter(
//       (attachment) => !hiddenTitles.includes(attachment.file_title)
//     );

//   return (
//     <Modal isOpen={open} toggle={onClose} size="lg" centered>
//       <ModalHeader>Attachments</ModalHeader>
//       <ModalBody>
//         {attachments ? (
//           <>
//             <h5>Start Job Attachments</h5>
//             <div className="d-flex flex-wrap">
//               {filterAttachments(attachments.start)?.map((attachment, index) => (
//                 <div key={index} className="m-2 text-center">
//                   <img
//                     src={attachment.file_path}
//                     alt="Attachment"
//                     className="img-fluid"
//                     style={{ maxWidth: "150px", maxHeight: "150px" }}
//                   />
//                 </div>
//               ))}
//             </div>
//             <h5 className="mt-3">End Job Attachments</h5>
//             <div className="d-flex flex-wrap">
//               {filterAttachments(attachments.end)?.map((attachment, index) => (
//                 <div key={index} className="m-2 text-center">
//                   <img
//                     src={attachment.file_path}
//                     alt="Attachment"
//                     className="img-fluid"
//                     style={{ maxWidth: "150px", maxHeight: "150px" }}
//                   />
//                 </div>
//               ))}
//             </div>
//           </>
//         ) : (
//           <p>No attachments available.</p>
//         )}
//       </ModalBody>
//       <ModalFooter>
//         <Button color="secondary" onClick={onClose}>
//           Close
//         </Button>
//       </ModalFooter>
//     </Modal>
//   );
// };

// export default AttachmentModal;


import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const AttachmentModal = ({ open, onClose, bookingId }) => {
  const [subBookings, setSubBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const hiddenTitles = ["Front Of Car", "Back Of Car", "Cook Photos", "Garden Photos"];

  useEffect(() => {
    const fetchAttachments = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
        const response = await axios.get(
          `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/bookings/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response?.data?.success) {
          const bookingData = response.data.data;
          setSubBookings(bookingData.sub_bookings || []);
        } else {
          toast.error(response.data.message || "Failed to fetch attachments");
        }
      } catch (error) {
        console.error("Error fetching attachments:", error);
        toast.error("Failed to load attachments. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (open && bookingId) {
      fetchAttachments();
    } else {
      setSubBookings([]); // Reset when closing
    }
  }, [open, bookingId]);

  const filterAttachments = (attachmentList) =>
    attachmentList?.filter(
      (attachment) => !hiddenTitles.includes(attachment.file_title)
    );

  const formatDate = (dateString) => {
    if (!dateString) return "No date available";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Modal isOpen={open} toggle={onClose} size="lg" centered>
      <ModalHeader>Attachments</ModalHeader>
      <ModalBody>
        {loading ? (
          <div className="text-center">Loading attachments...</div>
        ) : subBookings.length > 0 ? (
          <>
            <h5>Start Job Attachments</h5>
            {subBookings.map((subBooking, index) => (
              <div key={`start-${index}`} className="mb-4">
                <h6 className="text-muted">
                  {formatDate(subBooking.start_job)}
                </h6>
                <div style={{border:'1px solid gray',padding:'5px',backgroundColor:'#f7f7f7'}}>
                <div className="d-flex flex-wrap">
                  {filterAttachments(subBooking.start_job_attachments)?.length > 0 ? (
                    filterAttachments(subBooking.start_job_attachments).map((attachment, idx) => (
                      <div key={`start-attachment-${idx}`} className="m-2 text-center">
                        <img
                          src={attachment.file_path}
                          alt="Attachment"
                          className="img-fluid"
                          style={{ maxWidth: "150px", maxHeight: "150px" }}
                        />
                        <div>{attachment.file_title}</div>
                      </div>
                    ))
                  ) : (
                    <p>No start job attachments available</p>
                  )}
                </div>
                </div>
              </div>
            ))}

            <h5 className="mt-4">End Job Attachments</h5>
            {subBookings.map((subBooking, index) => (
              <div key={`end-${index}`} className="mb-4">
                <h6 className="text-muted">
                  {formatDate(subBooking.end_job)}
                </h6>
                <div style={{border:'1px solid gray',padding:'5px',backgroundColor:'#f7f7f7'}}>
                <div className="d-flex flex-wrap">
                  {filterAttachments(subBooking.end_job_attachments)?.length > 0 ? (
                    filterAttachments(subBooking.end_job_attachments).map((attachment, idx) => (
                      <div key={`end-attachment-${idx}`} className="m-2 text-center">
                        <img
                          src={attachment.file_path}
                          alt="Attachment"
                          className="img-fluid"
                          style={{ maxWidth: "150px", maxHeight: "150px" }}
                        />
                        <div>{attachment.file_title}</div>
                      </div>
                    ))
                  ) : (
                    <p>No end job attachments available</p>
                  )}
                </div>
              </div>
              </div>
            ))}
          </>
        ) : (
          <p>No attachments available for this booking.</p>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AttachmentModal;