import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { ToastMessage, ToastNotification } from '../components/ui/ToastNotification';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token') || 'demo_security_token';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const validatePassword = (pass: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/;
    return passwordRegex.test(pass);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(newPassword)) {
      addToast(
        'error',
        'Security Criteria Required',
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      addToast('error', 'Mismatch Error', 'New Password and Confirm Password do not match.');
      return;
    }

    setLoading(true);

    try {
      const msg = await authService.resetPassword(resetToken, newPassword, confirmPassword);
      addToast('success', 'Password Updated', msg);
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (err: any) {
      addToast('error', 'Reset Failed', err.message || 'Unable to update password.');
    } finally {
      setLoading(false);
    }
  };

  const isLengthValid = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>/?]/.test(newPassword);

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center min-vh-80">
      <ToastNotification toasts={toasts} onDismiss={removeToast} />

      <div className="row justify-content-center w-100">
        <div className="col-12 col-sm-10 col-md-8 col-lg-5">
          <div className="card card-corporate shadow-sm p-4 rounded-3 bg-white">
            
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-3 p-3 mb-2 shadow-sm" style={{ backgroundColor: '#1976D2', width: '52px', height: '52px' }}>
                <ShieldCheck size={28} />
              </div>
              <h4 className="fw-bold text-dark mb-1">Set New Password</h4>
              <p className="text-muted small">
                Choose a strong new password for your corporate account
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              
              {/* New Password */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">
                  New Security Password <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-secondary border-end-0">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control border-start-0 border-end-0 ps-0"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="input-group-text bg-light text-secondary border-start-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">
                  Confirm New Password <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-secondary border-end-0">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="form-control border-start-0 border-end-0 ps-0"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="input-group-text bg-light text-secondary border-start-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Password Requirements Checklist */}
              {newPassword && (
                <div className="mb-3 p-3 bg-light rounded-2 border">
                  <div className="small fw-semibold text-dark mb-2">Password Security Criteria:</div>
                  <div className="row g-2 small">
                    <div className={`col-6 ${isLengthValid ? 'text-success' : 'text-muted'}`}>
                      <CheckCircle2 size={14} className="me-1 inline" /> 8+ Characters
                    </div>
                    <div className={`col-6 ${hasUpper ? 'text-success' : 'text-muted'}`}>
                      <CheckCircle2 size={14} className="me-1 inline" /> Uppercase Letter
                    </div>
                    <div className={`col-6 ${hasLower ? 'text-success' : 'text-muted'}`}>
                      <CheckCircle2 size={14} className="me-1 inline" /> Lowercase Letter
                    </div>
                    <div className={`col-6 ${hasNumber ? 'text-success' : 'text-muted'}`}>
                      <CheckCircle2 size={14} className="me-1 inline" /> Number (0-9)
                    </div>
                    <div className={`col-6 ${hasSpecial ? 'text-success' : 'text-muted'}`}>
                      <CheckCircle2 size={14} className="me-1 inline" /> Special Character
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary-corporate w-100 py-2.5 mt-2 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                style={{ backgroundColor: '#1976D2', borderColor: '#1976D2' }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <span>Update Account Password</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

            </form>

            <div className="text-center mt-4 pt-3 border-top">
              <Link to="/login" className="small fw-bold text-decoration-none text-primary">
                Return to Login Page
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
