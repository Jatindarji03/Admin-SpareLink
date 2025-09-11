import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const SupplierRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axiosInstance.get('/api/supplier-requests/get-supplier-requests');
        console.log(response.data.data);
        setRequests(response.data.data);
      } catch (error) {
        console.log("error fetching supplier requests:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();

  }, []);

  // Simulate API call
  // setTimeout(() => {
  //   setRequests([
  //     { id: 1, name: "John Doe", email: "john@example.com", company: "Acme Corp", status: "Pending" },
  //     { id: 2, name: "Jane Smith", email: "jane@example.com", company: "Beta Ltd", status: "Approved" },
  //     { id: 3, name: "Bob Brown", email: "bob@example.com", company: "Gamma Inc", status: "Rejected" }
  //   ]);
  //   setLoading(false);
  // }, 1000);

  const handleAccept = async (id) => {
    try{
      await axiosInstance.put(`/api/supplier-requests/supplier-request-approvel/${id}`,{ status: "approved" });
      setRequests(prev =>
      prev.map(req =>
        req._id === id ? { ...req, status: "approved" } : req
      )
    );
    alert("Approval email sent to supplier.");
    }catch(error){
      console.log("Error approving supplier:", error);
    }
    
  };

  const handleReject = async(id) => {
    try{
      await axiosInstance.put(`/api/supplier-requests/supplier-request-approvel/${id}`,{ status: "rejected" });
      setRequests(prev =>
      prev.map(req =>
        req._id === id ? { ...req, status: "rejected" } : req
      )
    );
     alert("Rejection email sent to supplier.");
    }catch(error){
       console.log("Error approving supplier:", error);
    }
  };

  const showDetails = (supplier) => {
    setSelectedSupplier(supplier);
  };

  const closeDetails = () => {
    setSelectedSupplier(null);
  };

  if (loading) return <div className="text-center mt-5">Loading supplier requests...</div>;
  if(requests.length==0) return <div className="text-center mt-5">No supplier requests found</div>;


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
              <tr key={req._id}>
                <td>{req.userId.name}</td>
                <td>{req.userId.email}</td>
                <td>{req.storeName}</td>
                <td>
                  <span className={`badge 
                    ${req.status === "pending" ? "bg-warning text-dark" : ""} 
                    ${req.status === "approved" ? "bg-success" : ""} 
                    ${req.status === "rejected" ? "bg-danger" : ""}`}>
                    {req.status}
                  </span>
                </td>
                <td>
                  {req.status === "pending" && (
                    <>
                      <button className="btn btn-sm btn-success me-2" onClick={() => handleAccept(req._id)}>Accept</button>
                      <button className="btn btn-sm btn-danger me-2" onClick={() => handleReject(req._id)}>Reject</button>
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
                <p><strong>Name:</strong> {selectedSupplier.userId.name}</p>
                <p><strong>Email:</strong> {selectedSupplier.userId.email}</p>
                <p><strong>Company:</strong> {selectedSupplier.shopName}</p>
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
