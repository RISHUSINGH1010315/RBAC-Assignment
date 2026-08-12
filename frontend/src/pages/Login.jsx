import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [btnLoading, setBtnLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBtnLoading(true);

    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Invalid credentials');
    }
    setBtnLoading(false);
  };

  const loadCredentials = (roleEmail) => {
    setEmail(roleEmail);
    setPassword('password123');
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', padding: '20px', backgroundColor: '#f1f5f9' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '36px 32px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ 
            fontSize: '22px', 
            fontWeight: '900', 
            letterSpacing: '0.1em', 
            color: '#2563eb', 
            fontFamily: 'monospace',
            marginBottom: '12px'
          }}>
            RBAC
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.025em', color: '#0f172a' }}>Portal Access Control</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>Enterprise Task Management System</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            padding: '10px 14px',
            borderRadius: '0px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#991b1b',
            fontSize: '13px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>User Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="email"
                placeholder="email@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', paddingLeft: '36px', height: '40px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Account Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', paddingLeft: '36px', height: '40px' }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary flex-center" 
            disabled={btnLoading}
            style={{ width: '100%', padding: '10px', marginTop: '6px', fontSize: '14px', height: '40px' }}
          >
            {btnLoading ? 'Verifying Credentials...' : 'Sign In'}
          </button>
        </form>

        {/* Sandbox accounts helper */}
        <div style={{
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid #e2e8f0',
          fontSize: '13px'
        }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '10px', textAlign: 'center', fontWeight: '500' }}>
            Select Sandbox Account to Sign In:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'space-between', padding: '6px 12px', fontSize: '12px' }} onClick={() => loadCredentials('admin@braviching.com')}>
              <span>Rishu Singh (Admin)</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>admin@braviching.com</span>
            </button>
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'space-between', padding: '6px 12px', fontSize: '12px' }} onClick={() => loadCredentials('manager@braviching.com')}>
              <span>Abhinit Kumar (Manager)</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>manager@braviching.com</span>
            </button>
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'space-between', padding: '6px 12px', fontSize: '12px' }} onClick={() => loadCredentials('user@braviching.com')}>
              <span>Amit Sharma (User)</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>user@braviching.com</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
