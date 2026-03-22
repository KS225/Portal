import { useNavigate } from "react-router-dom";

function ApplicationsList() {
  const navigate = useNavigate();

  const applications = [
    { id: 1, company: "ABC Pvt Ltd", status: "SUBMITTED" },
    { id: 2, company: "XYZ Ltd", status: "INVOICE_SENT" }
  ];

  return (
    <div className="operations-wrapper">
      <h2>Applications</h2>

      <table className="app-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td>{app.company}</td>

              <td>
                <span className={`status ${app.status.toLowerCase()}`}>
                  {app.status}
                </span>
              </td>

              <td>
                <button
                  onClick={() =>
                    navigate(`/internal/operations/application/${app.id}`)
                  }
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ApplicationsList;