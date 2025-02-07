import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import moment from "moment"; // Ensure moment.js is installed

const AttachmentModalPartner = ({ open, attachments, onClose }) => {
  if (!attachments) return null; // Ensure data exists

  // Remove empty and null fields & exclude unwanted keys
  const filteredData = Object.entries(attachments).filter(
    ([key, value]) =>
      value !== null &&
      value !== "" &&
      value !== undefined &&
      key !== "is_verify" &&
      key !== "registered_by_id" &&
      key !== "firebase_token"  &&
      key !== "category_id"  
  );

  // Function to format keys (remove underscores and capitalize words)
  const formatKey = (key) => {
    return key
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
  };

  // Function to format values (remove underscores and format dates)
  const formatValue = (key, value) => {
    if (typeof value === "string") {
      if (key === "dob") {
        return moment(value).format("MMMM D, YYYY"); // Show only date
      } else if (key.includes("date") || key === "created_at" || key === "updated_at") {
        return moment(value).format("MMMM D, YYYY, hh:mm A"); // Show full timestamp
      }
      return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize words
    }
    return value;
  };

  return (
    <Modal isOpen={open} toggle={onClose} size="lg" centered>
      <ModalHeader>Partner Details</ModalHeader>
      <ModalBody>
        {/* Partner Info Section */}
        <div className="mb-3 text-left">
          <h2 className="text-center">Personal Information</h2>
          {filteredData.map(([key, value]) =>
            key !== "attachments" ? ( // Exclude attachments from this section
              <p key={key}>
                <strong>{formatKey(key)}:</strong> {formatValue(key, value)}
              </p>
            ) : null
          )}
        </div>

        {/* Attachments Section */}
        {attachments.attachments?.length > 0 && (
          <>
            <h2 className="mt-3">Attachments</h2>
            <div className="d-flex flex-wrap justify-content-center">
              {attachments.attachments.map((attachment, index) => (
                <div key={index} className="m-2 text-center">
                  <h5>{formatValue("document_name", attachment.document_name)}</h5>
                  <a
                    href={attachment.file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <img
                      src={attachment.file_path}
                      alt={attachment.file_name}
                      className="img-fluid"
                      style={{ maxWidth: "150px", maxHeight: "150px", cursor: "pointer" }}
                    />
                  </a>
                  <p className="mt-2">{attachment.file_name}</p>
                </div>
              ))}
            </div>
          </>
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
