function Dashboard() {
  const status = localStorage.getItem("status");

  return (
    <div style={{ padding: "40px" }}>
      <h2>Company Dashboard</h2>

      {status === "approved" ? (
        <p style={{ color: "green" }}>
          ✅ Your certification has been approved.
        </p>
      ) : (
        <p style={{ color: "orange" }}>
          ⏳ Your application is under review.
        </p>
      )}
    </div>
  );
}

export default Dashboard;
