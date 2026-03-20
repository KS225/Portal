import { useEffect, useState } from "react";
import "../styles/adminDashboard.css";

function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/companies", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch((err) => console.error(err));
  }, []);

  /* ================= DELETE FUNCTION ================= */
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this company?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/company/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization:
              "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (res.ok) {
        setCompanies((prev) =>
          prev.filter((company) => company._id !== id)
        );
        alert("Company deleted successfully");
      } else {
        alert("Failed to delete company");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  /* ================= FILTERING ================= */

  const industries = [
    ...new Set(companies.map((c) => c.industry).filter(Boolean)),
  ];

  const sortedCompanies = [...companies].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const now = new Date();

  const filteredCompanies = sortedCompanies.filter((company, index) => {
    const createdDate = new Date(company.createdAt);

    const matchesSearch =
      company.companyName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesIndustry =
      industryFilter === "" ||
      company.industry === industryFilter;

    let matchesDate = true;

    if (dateFilter === "last5") {
      matchesDate = index < 5;
    } else if (dateFilter === "last10") {
      matchesDate = index < 10;
    } else if (dateFilter === "7days") {
      matchesDate =
        (now - createdDate) / (1000 * 60 * 60 * 24) <= 7;
    } else if (dateFilter === "30days") {
      matchesDate =
        (now - createdDate) / (1000 * 60 * 60 * 24) <= 30;
    } else if (dateFilter === "90days") {
      matchesDate =
        (now - createdDate) / (1000 * 60 * 60 * 24) <= 90;
    }

    return matchesSearch && matchesIndustry && matchesDate;
  });

  return (
    <div className="admin-dashboard-container">
      <div className="admin-card">
        <div className="admin-header">
          <h2>Registered Companies</h2>
          <span className="company-count">
            {filteredCompanies.length} Results
          </span>
        </div>

        {/* FILTER BAR */}
        <div className="filter-bar">
          <div className="filter-group">
            <input
              type="text"
              placeholder="Search company..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

            <select
              value={industryFilter}
              onChange={(e) =>
                setIndustryFilter(e.target.value)
              }
            >
              <option value="">All Industries</option>
              {industries.map((industry, index) => (
                <option key={index} value={industry}>
                  {industry}
                </option>
              ))}
            </select>

            <select
              value={dateFilter}
              onChange={(e) =>
                setDateFilter(e.target.value)
              }
            >
              <option value="">All Time</option>
              <option value="last5">Last 5</option>
              <option value="last10">Last 10</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>

          <button
            className="clear-btn"
            onClick={() => {
              setSearchTerm("");
              setIndustryFilter("");
              setDateFilter("");
            }}
          >
            Clear Filters
          </button>
        </div>

        {/* TABLE */}
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>CIN</th>
                <th>Industry</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    No companies found.
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((company) => (
                  <tr key={company._id}>
                    <td>{company.companyName}</td>
                    <td>
                      {company.registrationNumber}
                    </td>
                    <td>{company.industry}</td>
                    <td>
                      {company.contactPerson}
                    </td>
                    <td>{company.email}</td>
                    <td>{company.phone}</td>
                    <td>
                      {company.createdAt
                        ? new Date(
                            company.createdAt
                          ).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(company._id)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminCompanies;