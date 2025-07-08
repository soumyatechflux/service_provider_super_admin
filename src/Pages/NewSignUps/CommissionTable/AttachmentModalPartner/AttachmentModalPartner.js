import moment from "moment";
import { useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import './AttachmentModalPartner.css';

const AttachmentModalPartner = ({ open, attachments, onClose }) => {
  const [selectedPdf, setSelectedPdf] = useState(null);

  if (!attachments) return null;

  // Remove empty fields & exclude unwanted keys including 'id'
  const filteredData = Object.entries(attachments).filter(
    ([key, value]) =>
      value !== null &&
      value !== "" &&
      value !== undefined &&
      key !== "id" &&  // Explicitly exclude id
      key !== "is_verify" &&
      key !== "registered_by_id" &&
      key !== "firebase_token" &&
      key !== "category_id" &&
      key !== "uid" // We'll handle uid separately
  );

  const formatKey = (key) => {
    return key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatValue = (key, value) => {
    if (typeof value === "string") {
      if (key === "dob") return moment(value).format("MMMM D, YYYY");
      if (key.includes("date") || key === "created_at" || key === "updated_at")
        return moment(value).format("MMMM D, YYYY, hh:mm A");
      return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
    }
    return value;
  };

  const isPDF = (filePath) => filePath?.toLowerCase().endsWith(".pdf");

  return (
    <Modal isOpen={open} toggle={onClose} size="lg" centered>
      <ModalHeader>Partner Details</ModalHeader>
      <ModalBody>
        {/* Partner Info Section */}
        <div className="mb-3 text-left">
          {/* <h2 className="text-center">Personal Information</h2> */}
          
          {/* Partner ID at the very top */}
          {attachments.uid && (
            <p key="partner-id">
              <strong>Partner ID :</strong> {formatValue("uid", attachments.uid)}
            </p>
          )}

          {/* Rest of the fields */}
          {filteredData.map(([key, value]) =>
            key !== "attachments" ? (
              <p key={key}>
                <strong>{formatKey(key)} :</strong> {formatValue(key, value)}
              </p>
            ) : null
          )}
        </div>

        {/* Attachments Section */}
        {attachments.attachments?.length > 0 && (
          <>
            <h2 className="mt-3">Attachments</h2>
            <div className="attachments-container">
              {attachments.attachments.map((attachment, index) => (
                <div key={index} className="attachment-box">
                  <h5>{formatValue("document_name", attachment.document_name)}</h5>

                  {isPDF(attachment.file_path) ? (
                    <div onClick={() => setSelectedPdf(attachment.file_path)}>
                      <FaFilePdf className="pdf-icon" />
                      <iframe src={attachment.file_path} width="100%" height="180px" title="PDF Preview"></iframe>
                    </div>
                  ) : (
                    <a href={attachment.file_path} target="_blank" rel="noopener noreferrer">
                      <img src={attachment.file_path} alt={attachment.file_name} />
                    </a>
                  )}

                  <p>{attachment.file_name}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Full-Screen PDF Preview */}
        {selectedPdf && (
          <div className="fullscreen-pdf">
            <div className="pdf-preview-container">
              <button onClick={() => setSelectedPdf(null)} className="close-pdf-btn">
                ✖ Close
              </button>
              <iframe src={selectedPdf} width="100%" height="100%" title="PDF Full Preview" />
            </div>
          </div>
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

export default AttachmentModalPartner;