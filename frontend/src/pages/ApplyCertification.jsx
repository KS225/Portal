import { useState } from "react";
import "../styles/certification.css";

function ApplyCertification() {
  const [formData, setFormData] = useState({
    businessType: "",
    otherBusinessType: "",
    offeringType: "",
    otherOfferingType: "",
    remarksDescription: "",
    businessDescription: "",
    numberOfCustomers: "",
    yearsInOperation: "",
    annualTurnover: "",
    revenueToDate: "",
    otherBusinesses: "",
    declaration: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const isLessThanOneYear =
    formData.yearsInOperation &&
    (formData.yearsInOperation === "0" ||
      formData.yearsInOperation.toLowerCase() === "less than 1");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        "http://localhost:5000/api/certification/apply",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Application submitted successfully");
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="cert-container">
      <div className="cert-card">
        <h2>Apply for Certification</h2>

        <form onSubmit={handleSubmit}>

          {/* Business Category */}
          <label>Business Category</label>
          <select
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Software">Software</option>
            <option value="Hardware">Hardware</option>
            <option value="Product">Product</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Other">Other</option>
          </select>

          {formData.businessType === "Other" && (
            <input
              type="text"
              name="otherBusinessType"
              placeholder="Please specify business category"
              value={formData.otherBusinessType}
              onChange={handleChange}
              required
            />
          )}

          {/* Offering Type */}
          <label>Offering Type</label>
          <select
            name="offeringType"
            value={formData.offeringType}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Service">Service</option>
            <option value="Product">Product</option>
            <option value="Both">Both</option>
            <option value="Other">Other</option>
          </select>

          {formData.offeringType === "Other" && (
            <input
              type="text"
              name="otherOfferingType"
              placeholder="Please specify offering type"
              value={formData.otherOfferingType}
              onChange={handleChange}
              required
            />
          )}

          {/* Years in Operation */}
          <label>Years in Operation</label>
          <input
            type="text"
            name="yearsInOperation"
            placeholder="e.g. 0, 2, 5, 5+"
            value={formData.yearsInOperation}
            onChange={handleChange}
            required
          />

          {/* Annual Turnover */}
          <label>Annual Turnover</label>
          <input
            type="text"
            name="annualTurnover"
            placeholder="e.g. 1 Cr, 50 Lakhs"
            value={formData.annualTurnover}
            onChange={handleChange}
            disabled={isLessThanOneYear}
            style={{
              backgroundColor: isLessThanOneYear ? "#f3f4f6" : "white",
              cursor: isLessThanOneYear ? "not-allowed" : "text",
            }}
          />

          {/* Revenue Generated to Date (for <1 year companies) */}
          {isLessThanOneYear && (
            <>
              <label>Revenue Generated to Date</label>
              <input
                type="text"
                name="revenueToDate"
                placeholder="Enter total revenue generated so far"
                value={formData.revenueToDate}
                onChange={handleChange}
                required
              />
            </>
          )}

          {/* Number of Customers */}
          <label>Number of Customers</label>
          <input
            type="number"
            name="numberOfCustomers"
            min="0"
            value={formData.numberOfCustomers}
            onChange={handleChange}
            required
          />

          {/* Business Description */}
          <label>Business Description</label>
          <textarea
            name="businessDescription"
            value={formData.businessDescription}
            onChange={handleChange}
            placeholder="Describe your Business in Brief"
            required
          />

          {/* Quotation Description */}
          <label>Any Remarks</label>
          <textarea
            name="remarksDescription"
            value={formData.remarksDescription}
            onChange={handleChange}
            placeholder="(if any)"
            
          />

          {/* Other Businesses */}
          <label>Any Other Businesses?</label>
          <textarea
            name="otherBusinesses"
            value={formData.otherBusinesses}
            onChange={handleChange}
            placeholder="(if any)"
          />

          {/* Declaration */}
          <div className="declaration">
            <input
              type="checkbox"
              name="declaration"
              checked={formData.declaration}
              onChange={handleChange}
              required
            />
            <span>
              I hereby declare that the information provided above is true and
              accurate to the best of my knowledge. I understand that I will be
              held accountable if any information is found to be false or misleading.
            </span>
          </div>

          <button type="submit">Submit Application</button>
        </form>
      </div>
    </div>
  );
}

export default ApplyCertification;