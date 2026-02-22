import { useEffect, useState } from "react";
import "../styles/adminDashboard.css";

function AdminCompanies() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/companies", {
      headers: {
        Authorization:
          "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => setCompanies(data));
  }, []);

  return (
    <div className="admin-dashboard-container">
      <h2>Registered Companies</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Company Name</th>
            <th>CIN</th>
            <th>Industry</th>
            <th>Contact Person</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Registered On</th>
          </tr>
        </thead>
        <tbody>
          {companies.length === 0 ? (
            <tr>
              <td colSpan="7">
                No companies registered yet.
              </td>
            </tr>
          ) : (
            companies.map((company) => (
              <tr key={company._id}>
                <td>{company.companyName}</td>
                <td>{company.registrationNumber}</td>
                <td>{company.industry}</td>
                <td>{company.contactPerson}</td>
                <td>{company.email}</td>
                <td>{company.phone}</td>
                <td>
                  {company.createdAt
                    ? new Date(
                        company.createdAt
                      ).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminCompanies;