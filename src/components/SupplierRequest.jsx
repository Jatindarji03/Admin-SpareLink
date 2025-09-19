import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import AOS from "aos";
import "aos/dist/aos.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SupplierRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    const fetchRequests = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/supplier-requests/get-supplier-requests"
        );
        setRequests(response.data.data);
      } catch (error) {
        console.error("Error fetching supplier requests:", error);
        toast.error("Failed to fetch supplier requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleAccept = async (id) => {
    try {
      await axiosInstance.put(
        `/api/supplier-requests/supplier-request-approvel/${id}`,
        { status: "approved" }
      );
      setRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: "approved" } : req
        )
      );
      toast.success("Supplier approved ✅ Email sent.");
    } catch (error) {
      console.error("Error approving supplier:", error);
      toast.error("Failed to approve supplier");
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosInstance.put(
        `/api/supplier-requests/supplier-request-approvel/${id}`,
        { status: "rejected" }
      );
      setRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: "rejected" } : req
        )
      );
      toast.info("Supplier rejected ❌ Email sent.");
    } catch (error) {
      console.error("Error rejecting supplier:", error);
      toast.error("Failed to reject supplier");
    }
  };

  const showDetails = (supplier) => {
    setSelectedSupplier(supplier);
  };

  const closeDetails = () => {
    setSelectedSupplier(null);
  };

  if (loading)
    return (
      <div className="text-center mt-5" data-aos="fade-up">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2">Loading supplier requests...</p>
      </div>
    );

  if (requests.length === 0)
    return (
      <div className="text-center mt-5" data-aos="fade-up">
        <h5 className="text-muted">No supplier requests found</h5>
      </div>
    );

  return (
    <div className="container mt-4">
      <h2 className="mb-4  fw-bold" data-aos="fade-down">
        Supplier Account Requests
      </h2>

      <div className="row g-4">
        {requests.map((req, index) => (
          <div
            key={req._id}
            className="col-md-3"
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="fw-bold text-dark">Mechanic name : {req.userId?.name}</h5>
                <p className="mb-1 text-muted">Mechanic email : {req.userId?.email}</p>
                <p className="mb-1">
                  <strong>Service center : </strong> {req.storeName}
                </p>
                <p>Status :  
                  <span
                
                  className={`badge px-3 py-2 text-uppercase fw-semibold ${
                    req.status === "pending"
                      ? "bg-warning text-dark"
                      : req.status === "approved"
                      ? "bg-success"
                      : "bg-danger"
                  }`}
                >
                  {req.status}
                </span>
                </p>
              </div>
              <div className="card-footer bg-light text-center">
                {req.status === "pending" && (
                  <>
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => handleAccept(req._id)}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-sm btn-danger me-2"
                      onClick={() => handleReject(req._id)}
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  className="btn btn-sm btn-info"
                  onClick={() => showDetails(req)}
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Supplier Details Modal */}
      {selectedSupplier && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document" data-aos="zoom-in">
            <div className="modal-content shadow-lg border-0 rounded-4">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Supplier Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeDetails}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="card shadow-sm border-0">
                      <div className="card-body">
                        <h6 className="fw-bold text-primary mb-2">Profile</h6>
                        <p><strong>Name:</strong> {selectedSupplier.userId?.name}</p>
                        <p><strong>Email:</strong> {selectedSupplier.userId?.email}</p>
                        <p><strong>Company:</strong> {selectedSupplier.storeName}</p>
                        <p><strong>Status:</strong> 
                          <span className="text-capitalize ms-1">
                            {selectedSupplier.status}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card shadow-sm border-0">
                      <div className="card-body">
                        <h6 className="fw-bold text-primary mb-2">Address</h6>
                        <p>{selectedSupplier.address?.street}, {selectedSupplier.address?.city}</p>
                        <p>{selectedSupplier.address?.state}, {selectedSupplier.address?.country}</p>
                        <p><strong>Pincode:</strong> {selectedSupplier.address?.pincode}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeDetails}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierRequest;
