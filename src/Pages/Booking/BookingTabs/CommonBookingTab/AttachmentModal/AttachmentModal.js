// import React from "react";
// import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

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
//                     alt={attachment.file_title}
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
//                     alt={attachment.file_title}
//                     className="img-fluid"
//                     style={{ maxWidth: "150px", maxHeight: "150px" }}
//                   />
//                   <p>
//                     {attachment.file_title
//                       .replace(/_/g, " ")
//                       .replace(/\b\w/g, (char) => char.toUpperCase())}
//                   </p>
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


import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const AttachmentModal = ({ open, attachments, onClose }) => {
  const hiddenTitles = ["Front Of Car", "Back Of Car", "Cook Photos", "Garden Photos"];

  const filterAttachments = (attachmentList) =>
    attachmentList?.filter(
      (attachment) => !hiddenTitles.includes(attachment.file_title)
    );

  return (
    <Modal isOpen={open} toggle={onClose} size="lg" centered>
      <ModalHeader>Attachments</ModalHeader>
      <ModalBody>
        {attachments ? (
          <>
            <h5>Start Job Attachments</h5>
            <div className="d-flex flex-wrap">
              {filterAttachments(attachments.start)?.map((attachment, index) => (
                <div key={index} className="m-2 text-center">
                  <img
                    src={attachment.file_path}
                    alt="Attachment"
                    className="img-fluid"
                    style={{ maxWidth: "150px", maxHeight: "150px" }}
                  />
                </div>
              ))}
            </div>
            <h5 className="mt-3">End Job Attachments</h5>
            <div className="d-flex flex-wrap">
              {filterAttachments(attachments.end)?.map((attachment, index) => (
                <div key={index} className="m-2 text-center">
                  <img
                    src={attachment.file_path}
                    alt="Attachment"
                    className="img-fluid"
                    style={{ maxWidth: "150px", maxHeight: "150px" }}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>No attachments available.</p>
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


