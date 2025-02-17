import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import moment from "moment"; // Ensure moment.js is installed
import { FaFilePdf } from "react-icons/fa"; // PDF icon
import './AttachmentModalPartner.css'

const AttachmentModalPartner = ({ open, attachments, onClose }) => {
  const [selectedPdf, setSelectedPdf] = useState(null); // For full-screen PDF preview

  if (!attachments) return null;

  // Remove empty fields & exclude unwanted keys
  const filteredData = Object.entries(attachments).filter(
    ([key, value]) =>
      value !== null &&
      value !== "" &&
      value !== undefined &&
      key !== "is_verify" &&
      key !== "registered_by_id" &&
      key !== "firebase_token" &&
      key !== "category_id"
  );

  const formatKey = (key) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

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
          <h2 className="text-center">Personal Information</h2>
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
          <div
            className="fullscreen-pdf"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.8)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                padding: "10px",
                borderRadius: "5px",
                position: "relative",
                width: "80%",
                height: "90%",
              }}
            >
              <button
                onClick={() => setSelectedPdf(null)}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                  borderRadius: "3px",
                }}
              >
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
