import React, { useEffect, useState } from "react";

const SupplierRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRequests([
        { id: 1, name: "John Doe", email: "john@example.com", company: "Acme Corp", status: "Pending" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", company: "Beta Ltd", status: "Approved" },
        { id: 3, name: "Bob Brown", email: "bob@example.com", company: "Gamma Inc", status: "Rejected" }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAccept = (id) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id ? { ...req, status: "Approved" } : req
      )
    );
    alert("Approval email sent to supplier.");
  };

  const handleReject = (id) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id ? { ...req, status: "Rejected" } : req
      )
    );
    alert("Rejection email sent to supplier.");
  };

  const showDetails = (supplier) => {
    setSelectedSupplier(supplier);
  };

  const closeDetails = () => {
    setSelectedSupplier(null);
  };

  if (loading) return <div className="text-center mt-5">Loading supplier requests...</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-primary">Supplier Account Requests</h2>

      {requests.length === 0 ? (
        <div className="alert alert-info">No supplier requests found.</div>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Supplier Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id}>
                <td>{req.name}</td>
                <td>{req.email}</td>
                <td>{req.company}</td>
                <td>
                  <span className={`badge 
                    ${req.status === "Pending" ? "bg-warning text-dark" : ""} 
                    ${req.status === "Approved" ? "bg-success" : ""} 
                    ${req.status === "Rejected" ? "bg-danger" : ""}`}>
                    {req.status}
                  </span>
                </td>
                <td>
                  {req.status === "Pending" && (
                    <>
                      <button className="btn btn-sm btn-success me-2" onClick={() => handleAccept(req.id)}>Accept</button>
                      <button className="btn btn-sm btn-danger me-2" onClick={() => handleReject(req.id)}>Reject</button>
                    </>
                  )}
                  <button className="btn btn-sm btn-info" onClick={() => showDetails(req)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}    

      {/* Supplier Details Modal */}
      {selectedSupplier && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Supplier Details</h5>
                <button type="button" className="btn-close" onClick={closeDetails}></button>
              </div>
              <div className="modal-body">
                <p><strong>Name:</strong> {selectedSupplier.name}</p>
                <p><strong>Email:</strong> {selectedSupplier.email}</p>
                <p><strong>Company:</strong> {selectedSupplier.company}</p>
                <p><strong>Status:</strong> {selectedSupplier.status}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeDetails}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SupplierRequest;
