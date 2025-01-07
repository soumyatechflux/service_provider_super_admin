import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditDiscountModal = ({
  show,
  onClose,
  onSave,
  initialData,
  fetchDiscountData,
}) => {
  const [formData, setFormData] = useState({
    sub_category_name: "",
    price: "",
    limit: "",
    minimum_price: "",
    discount_code: "",
    start_date: "",
    end_date: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        sub_category_name: initialData.discount_type || "",
        price: initialData.discount_value || "",
        limit: initialData.usage_limit || "",
        minimum_price: initialData.minimum_order_amount || "",
        discount_code: initialData.voucher_code || "",
        start_date: initialData.start_date || "",
        end_date: initialData.end_date || "",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    const today = new Date().toISOString().split("T")[0];
  
    // Validate form data
    if (!formData.sub_category_name) {
      toast.error("Please select a discount type.");
      return;
    }
    if (!formData.price || formData.price <= 0) {
      toast.error("Discount value must be greater than 0.");
      return;
    }
    if (!formData.limit || formData.limit <= 0) {
      toast.error("Usage limit must be greater than 0.");
      return;
    }
    if (formData.minimum_price < 0) {
      toast.error("Minimum price must be greater than or equal to 0.");
      return;
    }
    if (formData.start_date && formData.start_date < today) {
      toast.error("Start date cannot be in the past.");
      return;
    }
    if (formData.end_date && formData.end_date < today) {
      toast.error("End date cannot be in the past.");
      return;
    }
    if (formData.start_date && formData.end_date && formData.start_date > formData.end_date) {
      toast.error("Start date cannot be later than the end date.");
      return;
    }
  
    setLoading(true);
  
    try {
      const token = sessionStorage.getItem(
        "TokenForSuperAdminOfServiceProvider"
      );
  
      const payload = {
        discount: {
          voucher_id: initialData.voucher_id,
          voucher_code: formData.discount_code || null,
          discount_type: formData.sub_category_name || null,
          discount_value: formData.price || null,
          minimum_order_amount: formData.minimum_price || null,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          usage_limit: formData.limit || null,
          description: formData.description || null,
        },
      };
  
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVICE_PROVIDER_SUPER_ADMIN_BASE_API_URL}/api/admin/discount`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response?.status === 200) {
        toast.success("Discount updated successfully!");
        await fetchDiscountData();
        onClose();
      } else {
        throw new Error(response.data?.message || "Failed to update the discount.");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.message || "An error occurred while updating the discount.");
    } finally {
      setLoading(false);
    }
  };
  

  if (!show) return null;

  return (
    <>
      <div className="modal-overlay">
        <div
          className="modal-content"
          style={{ height: "80%", overflowY: "auto" }}
        >
          <h2>Edit Discount</h2>
          <div className="form-group">
            <label htmlFor="sub-category-name">Discount Type:</label>
            <select
              id="sub-category-name"
              name="sub_category_name"
              value={formData.sub_category_name}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px" }}
            >
              <option value="">Select Discount Type</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="discount-price">Discount Value:</label>
            <input
              id="discount-price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter discount value"
            />
          </div>
          <div className="form-group">
            <label htmlFor="limit">Usage Limit:</label>
            <input
              id="limit"
              name="limit"
              type="number"
              value={formData.limit}
              onChange={handleChange}
              placeholder="Enter usage limit"
            />
          </div>
          <div className="form-group">
            <label htmlFor="minimum-price">Minimum Price:</label>
            <input
              id="minimum-price"
              name="minimum_price"
              type="number"
              value={formData.minimum_price}
              onChange={handleChange}
              placeholder="Enter minimum price"
            />
          </div>
          <div className="form-group">
            <label htmlFor="discount-code">Voucher Code:</label>
            <input
              id="discount-code"
              name="discount_code"
              value={formData.discount_code}
              onChange={handleChange}
              placeholder="Enter voucher code"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a description"
            />
          </div>
          <div className="form-group">
            <label htmlFor="start-date">Start Date:</label>
            <input
              id="start-date"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="end-date">End Date:</label>
            <input
              id="end-date"
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={handleChange}
            />
          </div>
          <div className="modal-actions">
            <button
              onClick={handleSave}
              className="btn btn-primary"
              disabled={loading}
            >
              Save
            </button>
            <button onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default EditDiscountModal;
