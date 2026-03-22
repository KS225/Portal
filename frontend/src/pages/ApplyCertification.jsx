import { useState } from "react";
import API from "../services/api";
import "../styles/applyCertification.css";

function ApplyCertification() {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    legal_name: "",
    brand_name: "",
    website: "",
    hq_location: "",
    contact_name: "",
    contact_email: "",
    service_scope: "",
    customer_count: "",
    employee_count: "",
    years_in_business: "",
    items: [{ name: "", package_type: "VERIFICATION" }],
    evidences: []
  });

  // ================= INPUT =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ================= ITEMS =================
  const handleItemChange = (index, field, value) => {
    const updated = [...formData.items];
    updated[index][field] = value;
    setFormData({ ...formData, items: updated });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: "", package_type: "VERIFICATION" }]
    });
  };

  const removeItem = (index) => {
    const updated = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updated });
  };

  // ================= FILE =================
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const updatedFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setFormData({
      ...formData,
      evidences: [...formData.evidences, ...updatedFiles]
    });
  };

  const removeFile = (index) => {
    const updated = [...formData.evidences];
    updated.splice(index, 1);
    setFormData({ ...formData, evidences: updated });
  };

  // ================= VALIDATION =================
  const validateStep = () => {
    let newErrors = {};

    if (step === 1) {
      if (!formData.legal_name) newErrors.legal_name = "Required";
      if (!formData.contact_name) newErrors.contact_name = "Required";
      if (!formData.contact_email) newErrors.contact_email = "Required";
    }

    if (step === 2) {
      if (!formData.service_scope) newErrors.service_scope = "Required";
      if (!formData.customer_count) newErrors.customer_count = "Required";
      if (!formData.employee_count) newErrors.employee_count = "Required";
    }

    if (step === 3) {
      formData.items.forEach((item, index) => {
        if (!item.name) {
          newErrors[`item_${index}`] = "Item name required";
        }
      });
    }

    if (step === 4) {
      if (formData.evidences.length === 0) {
        newErrors.evidences = "Upload at least one file";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!validateStep()) return;

    try {
      const form = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key !== "items" && key !== "evidences") {
          form.append(key, formData[key]);
        }
      });

      form.append("items", JSON.stringify(formData.items));

      formData.evidences.forEach((item) => {
        form.append("files", item.file);
      });

      await API.post("/applications", form, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Application submitted successfully");

    } catch (err) {
      alert("Submission failed");
    }
  };

  return (
    <div className="apply-wrapper">
      <div className="apply-card">

        <h2>Apply for CIO Certification</h2>

        {/* PROGRESS BAR */}
        <div className="progress-container">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="progress-step">
              <div className={`circle ${step >= s ? "active" : ""}`}>
                {s}
              </div>
              <span className={step >= s ? "active-text" : ""}>
                {["Company", "Business", "Items", "Evidence"][s - 1]}
              </span>
            </div>
          ))}

          <div
            className="progress-line"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></div>
        </div>

        <p className="step-text">Step {step} of 4</p>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h3 className="section-title">Company Profile</h3>

            <input
              name="legal_name"
              placeholder="Legal Name"
              onChange={handleChange}
              className={errors.legal_name ? "input-error" : ""}
            />
            {errors.legal_name && <p className="error">{errors.legal_name}</p>}

            <input name="brand_name" placeholder="Brand Name" onChange={handleChange} />
            <input name="website" placeholder="Website" onChange={handleChange} />
            <input name="hq_location" placeholder="HQ Location" onChange={handleChange} />

            <input
              name="contact_name"
              placeholder="Contact Name"
              onChange={handleChange}
              className={errors.contact_name ? "input-error" : ""}
            />
            {errors.contact_name && <p className="error">{errors.contact_name}</p>}

            <input
              name="contact_email"
              placeholder="Contact Email"
              onChange={handleChange}
              className={errors.contact_email ? "input-error" : ""}
            />
            {errors.contact_email && <p className="error">{errors.contact_email}</p>}
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h3 className="section-title">Business Details</h3>

            <input
              name="service_scope"
              placeholder="Service Scope"
              onChange={handleChange}
              className={errors.service_scope ? "input-error" : ""}
            />
            {errors.service_scope && <p className="error">{errors.service_scope}</p>}

            <input
              type="number"
              name="customer_count"
              placeholder="Customer Count"
              onChange={handleChange}
              className={errors.customer_count ? "input-error" : ""}
            />
            {errors.customer_count && <p className="error">{errors.customer_count}</p>}

            <input
              type="number"
              name="employee_count"
              placeholder="Employee Count"
              onChange={handleChange}
              className={errors.employee_count ? "input-error" : ""}
            />
            {errors.employee_count && <p className="error">{errors.employee_count}</p>}
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <h3 className="section-title">Items & Packages</h3>

            {formData.items.map((item, index) => (
              <div key={index}>
                <input
                  placeholder="Item name"
                  value={item.name}
                  onChange={(e) =>
                    handleItemChange(index, "name", e.target.value)
                  }
                />
                {errors[`item_${index}`] && (
                  <p className="error">{errors[`item_${index}`]}</p>
                )}

                <select
                  value={item.package_type}
                  onChange={(e) =>
                    handleItemChange(index, "package_type", e.target.value)
                  }
                >
                  <option value="VERIFICATION">Verification</option>
                  <option value="VERIFICATION_CERTIFICATION">
                    Verification + Certification
                  </option>
                  <option value="FULL_PACKAGE">
                    Full Package
                  </option>
                </select>

                {index > 0 && (
                  <button onClick={() => removeItem(index)}>Remove</button>
                )}
              </div>
            ))}

            <button onClick={addItem}>+ Add Item</button>
          </>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <>
            <h3 className="section-title">Upload Evidence</h3>

            <label className="file-upload">
              <input type="file" multiple onChange={handleFileChange} />
              <div>📁 Click to upload or drag files</div>
            </label>

            {errors.evidences && (
              <p className="error">{errors.evidences}</p>
            )}

            <div className="file-list">
              {formData.evidences.map((item, index) => (
                <div key={index} className="file-item">
                  {item.file.type.startsWith("image") ? (
                    <img src={item.preview} alt="preview" />
                  ) : (
                    <div className="file-icon">📄</div>
                  )}

                  <span>{item.file.name}</span>

                  <button onClick={() => removeFile(index)}>✕</button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* BUTTONS */}
        <div className="button-group">
          {step > 1 && (
            <button className="btn btn-back" onClick={() => setStep(step - 1)}>
              Back
            </button>
          )}

          {step < 4 ? (
            <button
              className="btn btn-primary"
              onClick={() => {
                if (validateStep()) setStep(step + 1);
              }}
            >
              Next
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleSubmit}>
              Submit Application
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default ApplyCertification;