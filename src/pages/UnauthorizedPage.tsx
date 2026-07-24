import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, LogIn } from 'lucide-react';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="container py-5 d-flex justify-content-center align-items-center min-vh-75">
      <div className="row justify-content-center w-100">
        <div className="col-12 col-md-8 col-lg-6 text-center">
          <div className="card card-corporate shadow-sm p-4 p-md-5 rounded-3 bg-white border-top border-4 border-warning">
            
            <div className="d-inline-flex align-items-center justify-content-center bg-warning-subtle text-warning rounded-circle p-3 mb-3 mx-auto" style={{ width: '72px', height: '72px' }}>
              <Lock size={40} />
            </div>

            <h3 className="fw-bold text-dark mb-2">401 - Authentication Required</h3>
            <p className="text-secondary mb-4">
              Your active session has expired or you are not currently authenticated. Please sign in with valid corporate credentials to access protected system routes.
            </p>

            <div className="d-flex justify-content-center">
              <Link to="/login" className="btn btn-primary-corporate py-2 px-4 d-inline-flex align-items-center justify-content-center gap-2">
                <LogIn size={18} /> Sign In to Portal
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
