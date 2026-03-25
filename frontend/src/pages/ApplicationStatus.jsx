import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/applicationStatus.css";

const steps = [
  { key: "SUBMITTED", label: "Application Submitted", msg: "Your application has been received." },
  { key: "UNDER_REVIEW_OPS", label: "Under Initial Review", msg: "Our team is reviewing your details." },
  { key: "PRICING_DEFINED", label: "Pricing Finalized", msg: "Pricing has been determined." },
  { key: "INVOICE_SENT", label: "Invoice Sent", msg: "Invoice has been shared with you." },
  { key: "PAID", label: "Payment Completed", msg: "Payment received successfully." },
  { key: "AUDITOR_ASSIGNED", label: "Assessor Assigned", msg: "An assessor has been assigned." },
  { key: "AUDIT_COMPLETED", label: "Assessment Completed", msg: "Assessment process completed." },
  { key: "FINAL_REVIEW", label: "Final Review", msg: "Waiting for final approval." },
  { key: "FINAL_APPROVED", label: "Approved", msg: "Your application has been approved 🎉" }
];

export default function ApplicationStatus() {
  const [applications, setApplications] = useState([]);
  const [openId, setOpenId] = useState(null); // 🔥 controls collapse

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get("/application/my");

        const sorted = res.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setApplications(sorted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchApplications();
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const toggleCard = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="status-page">
      <h2>Application Status</h2>

      {applications.map((app) => {
        const isOpen = openId === app.id;

        const currentIndex = steps.findIndex(
          (s) => s.key === app.status?.toUpperCase()
        );

        const currentStep = steps[currentIndex];

        const timeline = [
          {
            status: "SUBMITTED",
            date: formatDate(app.created_at)
          },
          {
            status: app.status,
            date: formatDate(app.last_updated_at)
          }
        ];

        return (
          <div key={app.id} className="application-card">

            {/* 🔥 HEADER (CLICKABLE) */}
            <div className="card-header" onClick={() => toggleCard(app.id)}>
  
  <div className="card-left">
    <p className="app-id">Application #{app.id}</p>
    
    <span className={`status-badge ${app.status.toLowerCase()}`}>
      {app.status.replaceAll("_", " ")}
    </span>
  </div>

  <div className={`arrow ${isOpen ? "open" : ""}`}>
    ▼
  </div>

</div>

            {/* 🔥 COLLAPSIBLE CONTENT */}
            {isOpen && (
              <div className="card-body">

                {currentStep && (
                  <div className="status-message">
                    {currentStep.msg}
                  </div>
                )}

                <div className="status-header">
                  <h3>Progress Timeline</h3>
                </div>

                <div className="status-container">
                  {steps.map((step, index) => {
                    const timelineItem = timeline.find(
                      (t) => t.status === step.key
                    );

                    return (
                      <div key={step.key} className="status-step">

                        {timelineItem && index <= currentIndex && (
                          <div className="step-date">
                            {timelineItem.date}
                          </div>
                        )}

                        <div
                          className={`circle 
                            ${index < currentIndex ? "done" : ""}
                            ${index === currentIndex ? "active" : ""}
                          `}
                        >
                          {index < currentIndex && "✔"}
                        </div>

                        <span>{step.label}</span>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}