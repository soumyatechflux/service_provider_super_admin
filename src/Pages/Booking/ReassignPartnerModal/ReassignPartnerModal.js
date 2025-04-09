import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";


const ReassignPartnerModal = ({
  show,
  onClose,
  onSave,
  bookingData,
  getCommissionData,
}) => {
  const [formData, setFormData] = useState({
    booking_id: "",
    partner_id: "",
    current_partner_name: "",
    new_partner_id: "",
    reason: "",
  });

  const [partnerOptions, setPartnerOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    if (bookingData) {
      setFormData({
        booking_id: bookingData.booking_id || "",
        partner_id: bookingData.partner_id || "",
        current_partner_name: bookingData.partner?.name || "",
        new_partner_id: "",
        reason: bookingData.note || "",
      });
    }
  };
  

  useEffect(() => {
    if (bookingData) {
      setFormData({
        booking_id: bookingData.booking_id || "",
        partner_id: bookingData.partner_id || "",
        current_partner_name: bookingData.partner?.name || "",
        new_partner_id: "",
        reason:bookingData.note || "",
      });
    }
  }, [bookingData]);

  // Fetch dropdown partners using category_id
  useEffect(() => {
    const fetchPartnersByCategory = async () => {
      try {
        const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
        const categoryId = bookingData?.category_id;
        if (!categoryId) return;

        const response = await axios.get(
          `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/bookings/partners/${categoryId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data?.success !== false) {
          setPartnerOptions(response.data.data || []);
        } else {
          toast.error("Failed to fetch partners.");
        }
      } catch (error) {
        console.error("Error fetching partners by category:", error);
        toast.error("Failed to load partner list.");
      }
    };

    if (show && bookingData?.category_id) {
      fetchPartnersByCategory();
    }
  }, [show, bookingData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.new_partner_id) {
      toast.error("Please select the new partner.");
      return;
    }
    // if (!formData.reason) {
    //   toast.error("Please provide a reason for reassignment.");
    //   return;
    // }
  
    setLoading(true);
    try {
      const token = sessionStorage.getItem("TokenForSuperAdminOfServiceProvider");
  
      const payload = {
        booking_id: Number(formData.booking_id),
        partner_id: Number(formData.new_partner_id),
        note: formData.reason,
      };
  
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/bookings/partners/assign`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200 && response.data?.success !== false) {
        toast.success("Partner reassigned successfully!");
        await getCommissionData();
        onClose();
      } else {
        throw new Error(response.data?.message || "Failed to reassign partner.");
      }
    } catch (error) {
      console.error("Reassignment error:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  
  if (!show) return null;

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content" style={{ height: "90%", overflowY: "auto" }}
        >
          <h2>Reassign Partner</h2>

          <div className="form-group">
            <label>Booking ID:</label>
            <input type="text" value={formData.booking_id} readOnly />
          </div>

          <div className="form-group">
            <label>Partner ID:</label>
            <input type="text" value={formData.partner_id} readOnly />
          </div>

          <div className="form-group">
            <label>Current Partner:</label>
            <input type="text" value={formData.current_partner_name} readOnly />
          </div>

          {/* <div className="form-group">
            <label>Assign to Another Partner:</label>
            <select
              name="new_partner_id"
              value={formData.new_partner_id}
              onChange={handleChange}
            >
              <option value="">Select a partner</option>
              {partnerOptions
                .filter((partner) => partner.id !== formData.partner_id)
                .map((partner) => (
                  <option key={partner.id} value={partner.id}>
                    {partner.name}
                  </option>
                ))}
            </select>
          </div> */}

<div className="form-group">
  <label>Assign to Another Partner:</label>
  <Select
    options={partnerOptions
      .filter((partner) => partner.id !== formData.partner_id)
      .map((partner) => ({
        value: partner.id,
        label: partner.name,
      }))
    }
    onChange={(selectedOption) =>
      setFormData((prev) => ({
        ...prev,
        new_partner_id: selectedOption?.value || "",
      }))
    }
    placeholder="Select a partner"
    isClearable
  />
</div>

          <div className="form-group">
            <label>Reason for Reassignment:</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Why are you reassigning this booking?"
            />
          </div>

          <div className="modal-actions">
            <button
              onClick={handleSave}
              className="btn btn-primary"
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading ? "Reassigning..." : "Reassign"}
            </button>
            <button onClick={() => {resetForm(); onClose(); }}        
            className="btn btn-secondary"
              style={{ width: "100%" }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default ReassignPartnerModal;
