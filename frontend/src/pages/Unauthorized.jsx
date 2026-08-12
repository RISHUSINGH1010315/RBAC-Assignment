import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-center" style={{ minHeight: '100vh', padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '40px', textAlign: 'center' }}>
        <div className="flex-center" style={{
          width: '64px',
          height: '64px',
          background: 'rgba(239, 68, 68, 0.1)',
          borderRadius: '50%',
          margin: '0 auto 24px',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }}>
          <ShieldAlert size={32} color="var(--danger)" />
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '12px' }}>Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '32px', lineHeight: '1.6' }}>
          You do not have the required permissions or roles to view this resource. Please contact your system administrator if you believe this is an error.
        </p>
        <button className="btn btn-secondary flex-center" style={{ margin: '0 auto' }} onClick={() => navigate('/')}>
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
