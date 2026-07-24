import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export const AccessDeniedPage: React.FC = () => {
  return (
    <div className="container py-5 d-flex justify-content-center align-items-center min-vh-75">
      <div className="row justify-content-center w-100">
        <div className="col-12 col-md-8 col-lg-6 text-center">
          <div className="card card-corporate shadow-sm p-4 p-md-5 rounded-3 bg-white border-top border-4 border-danger">
            
            <div className="d-inline-flex align-items-center justify-content-center bg-danger-subtle text-danger rounded-circle p-3 mb-3 mx-auto" style={{ width: '72px', height: '72px' }}>
              <ShieldAlert size={40} />
            </div>

            <h3 className="fw-bold text-dark mb-2">403 - Access Denied</h3>
            <p className="text-secondary mb-4">
              You do not have administrative permissions required to access this resource or page. Your role has been restricted by Spring Security Role-Based Access Control (RBAC).
            </p>

            <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
              <Link to="/" className="btn btn-primary-corporate py-2 px-4 d-inline-flex align-items-center justify-content-center gap-2">
                <Home size={18} /> Return to Dashboard
              </Link>
              <Link to="/profile" className="btn btn-outline-secondary py-2 px-4 d-inline-flex align-items-center justify-content-center gap-2">
                <ArrowLeft size={18} /> View My Profile
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
