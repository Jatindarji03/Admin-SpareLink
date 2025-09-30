import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light text-dark px-4">
      

      {/* Title */}
      <h1 className="display-1 fw-bold text-primary mb-2">
        404
      </h1>

      {/* Subtitle */}
      <h2 className="h3 fw-semibold text-secondary mb-3">
        Page Not Found
      </h2>

      {/* Description */}
      <p className="text-muted text-center mb-4" style={{ maxWidth: '400px' }}>
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>

      {/* Button */}
      <Link
        to="/"
        className="btn btn-primary btn-lg px-4 py-2 rounded-pill shadow-sm"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
