function ApplicationDetails() {
  return (
    <div className="operations-wrapper">
      <h2>Application Details</h2>

      {/* SUMMARY */}
      <div className="summary-cards">
        <div className="card">
          <h4>Status</h4>
          <p>SUBMITTED</p>
        </div>

        <div className="card">
          <h4>Total Amount</h4>
          <p>₹50,000</p>
        </div>
      </div>

      {/* COMPANY INFO */}
      <div className="card">
        <h3>Company Info</h3>
        <p>ABC Pvt Ltd</p>
        <p>abc.com</p>
      </div>

      {/* ITEMS */}
      <div className="card">
        <h3>Items</h3>
        <ul>
          <li>Product A - FULL PACKAGE</li>
          <li>Product B - VERIFICATION</li>
        </ul>
      </div>

      {/* INVOICE */}
      <div className="card">
        <h3>Invoice</h3>
        <p>Total: ₹50,000</p>
        <button>Send Invoice</button>
      </div>

      {/* NEGOTIATION */}
      <div className="card">
        <h3>Negotiation</h3>

        <div className="chat">
          <p><b>Company:</b> Price is high</p>
          <p><b>Ops:</b> Reduced to ₹45,000</p>
        </div>

        <input placeholder="Type message..." />
        <button>Send</button>
      </div>
    </div>
  );
}

export default ApplicationDetails;