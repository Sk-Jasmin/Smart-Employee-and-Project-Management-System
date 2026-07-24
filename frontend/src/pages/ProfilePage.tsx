import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FormInput } from '../components/ui/FormInput';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Shield, 
  Briefcase, 
  MapPin, 
  CheckCircle2, 
  Camera, 
  Award, 
  Trophy, 
  Medal, 
  Plus,
  Check
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('user_profile_data');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      firstName: 'Aarav',
      lastName: 'Sharma',
      email: 'aarav.sharma@smartcorp.in',
      phone: '+91 98765 43210',
      department: 'Engineering',
      designation: 'Senior Java Backend Specialist',
      employeeCode: 'EMP-101',
      address: '123 Knowledge Park, Bengaluru, Karnataka'
    };
  });

  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    return localStorage.getItem('user_avatar') || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
  });

  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [certifications, setCertifications] = useState([
    { id: 1, name: 'AWS Certified Solutions Architect - Associate', issuer: 'Amazon Web Services', issueDate: '2025-03-15', status: 'ACTIVE', credentialId: 'AWS-99201' },
    { id: 2, name: 'Oracle Certified Professional: Java SE 21', issuer: 'Oracle Corporation', issueDate: '2024-11-10', status: 'ACTIVE', credentialId: 'OCP-88219' },
    { id: 3, name: 'Certified ScrumMaster (CSM)', issuer: 'Scrum Alliance', issueDate: '2023-06-20', status: 'ACTIVE', credentialId: 'CSM-44120' }
  ]);

  const [achievements, setAchievements] = useState([
    { id: 1, title: 'Sprint MVP Q2 2026 🏆', badge: 'MVP', category: 'PERFORMANCE', awardedBy: 'Engineering Leadership', date: '2026-06-30', notes: 'Delivered core API migration 3 days ahead of deadline with zero bugs.' },
    { id: 2, title: 'Code Quality Champion 💻', badge: 'CHAMPION', category: 'EXCELLENCE', awardedBy: 'CTO Office', date: '2026-05-15', notes: 'Achieved 98% unit test code coverage across spring boot microservices.' }
  ]);

  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certForm, setCertForm] = useState({
    name: '',
    issuer: '',
    issueDate: '2026-01-15',
    credentialId: ''
  });

  const [msg, setMsg] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarUrl(base64String);
        localStorage.setItem('user_avatar', base64String);
        setMsg('Profile photo updated successfully!');
        setTimeout(() => setMsg(''), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    const newCert = {
      id: Date.now(),
      name: certForm.name,
      issuer: certForm.issuer,
      issueDate: certForm.issueDate,
      status: 'ACTIVE',
      credentialId: certForm.credentialId || `CRED-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setCertifications(prev => [...prev, newCert]);
    setIsCertModalOpen(false);
    setCertForm({ name: '', issuer: '', issueDate: '2026-01-15', credentialId: '' });
    setMsg('New professional certification added!');
    setTimeout(() => setMsg(''), 3000);
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('user_profile_data', JSON.stringify(profile));
    setMsg('Profile contact details updated and saved to database successfully.');
    setTimeout(() => setMsg(''), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      alert('New passwords do not match.');
      return;
    }
    setMsg('Security credentials updated successfully.');
    setPasswordState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="page-title text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <User className="page-title-icon text-indigo-600 dark:text-indigo-400" /> Employee Profile Dossier
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage corporate credentials, photo upload, skill certifications, wall of fame achievements, and security settings.
        </p>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 rounded text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {msg}
        </div>
      )}

      {/* Main Profile Info Card */}
      <Card>
        <CardBody className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
            
            {/* Interactive Profile Photo Upload */}
            <div className="relative group shrink-0">
              <img
                src={avatarUrl}
                alt={profile.firstName}
                className="w-24 h-24 rounded-full object-cover border-4 border-indigo-600 dark:border-indigo-500 shadow-md"
              />
              <label
                htmlFor="profile-photo-input"
                style={{ display: 'flex', alignItems: 'center', justify: 'center' }}
                className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-md border-2 border-white dark:border-slate-900 transition-transform active:scale-95 z-10"
                title="Upload New Profile Photo"
              >
                <span className="flex items-center justify-center w-full h-full">
                  <Camera className="w-4 h-4 text-white shrink-0" style={{ margin: '0 auto', display: 'block' }} />
                </span>
                <input
                  id="profile-photo-input"
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageUpload}
                  className="sr-only"
                />
              </label>
            </div>

            <div className="text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{profile.firstName} {profile.lastName}</h2>
                <Badge variant="blue">{profile.employeeCode}</Badge>
              </div>
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{profile.designation}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs text-slate-500">
                <Badge variant="green">{profile.department}</Badge>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {profile.address}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleProfileUpdate} className="mt-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider text-xs">
              Contact & Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="First Name"
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
              />
              <FormInput
                label="Last Name"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Email Address"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                icon={<Mail className="w-4 h-4" />}
              />
              <FormInput
                label="Phone Number"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                icon={<Phone className="w-4 h-4" />}
              />
            </div>

            <FormInput
              label="Office Location Address"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            />

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" className="bg-indigo-600 hover:bg-indigo-700">
                Save Contact Details
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Certifications Card */}
      <Card>
        <CardHeader action={
          <Button
            variant="outline"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsCertModalOpen(true)}
            className="text-xs"
          >
            Add Certification
          </Button>
        }>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Professional Certifications & Credentials ({certifications.length})</span>
          </div>
        </CardHeader>
        <CardBody className="p-4 space-y-3">
          {certifications.map((c) => (
            <div key={c.id} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{c.name}</h4>
                  <Badge variant="green" size="sm">{c.status}</Badge>
                </div>
                <p className="text-[11px] text-slate-500">{c.issuer} • Issued: {c.issueDate}</p>
                <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-bold block">ID: {c.credentialId}</span>
              </div>
              <Award className="w-8 h-8 text-amber-500 shrink-0" />
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Achievements Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>Wall of Fame Achievements & Honors ({achievements.length})</span>
          </div>
        </CardHeader>
        <CardBody className="p-4 space-y-3">
          {achievements.map((a) => (
            <div key={a.id} className="p-3 bg-amber-50/50 dark:bg-slate-950 rounded-lg border border-amber-200 dark:border-amber-900/60 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-xs text-amber-900 dark:text-amber-300">{a.title}</h4>
                  <Badge variant="yellow" size="sm">{a.category}</Badge>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300">{a.notes}</p>
                <span className="text-[10px] text-slate-400 font-mono block">Awarded by: {a.awardedBy} on {a.date}</span>
              </div>
              <Medal className="w-8 h-8 text-amber-500 shrink-0" />
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Security Credentials Card */}
      <Card>
        <CardHeader>
          Security Credentials & Password
        </CardHeader>
        <CardBody className="p-6">
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <FormInput
              label="Current Password"
              type="password"
              value={passwordState.currentPassword}
              onChange={(e) => setPasswordState({ ...passwordState, currentPassword: e.target.value })}
              icon={<Lock className="w-4 h-4" />}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="New Password"
                type="password"
                value={passwordState.newPassword}
                onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                required
              />
              <FormInput
                label="Confirm New Password"
                type="password"
                value={passwordState.confirmPassword}
                onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
                required
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="success" className="bg-emerald-600 hover:bg-emerald-700">
                Update Security Credentials
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Add Certification Modal */}
      {isCertModalOpen && (
        <Modal
          isOpen={isCertModalOpen}
          onClose={() => setIsCertModalOpen(false)}
          title="Add Professional Certification"
          maxWidth="md"
        >
          <form onSubmit={handleAddCert} className="space-y-4 text-xs">
            <FormInput
              label="Certification Name"
              value={certForm.name}
              onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
              placeholder="e.g. AWS Certified Solutions Architect"
              required
            />
            <FormInput
              label="Issuing Organization"
              value={certForm.issuer}
              onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
              placeholder="e.g. Amazon Web Services / Oracle"
              required
            />
            <FormInput
              label="Issue Date"
              type="date"
              value={certForm.issueDate}
              onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
              required
            />
            <FormInput
              label="Credential ID / License #"
              value={certForm.credentialId}
              onChange={(e) => setCertForm({ ...certForm, credentialId: e.target.value })}
              placeholder="e.g. AWS-99201"
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setIsCertModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="bg-indigo-600 hover:bg-indigo-700">
                Add Certification
              </Button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
