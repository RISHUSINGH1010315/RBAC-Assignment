import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LogOut, Shield, Users, CheckCircle, Clock, AlertTriangle, 
  Plus, Edit3, Trash2, Calendar, UserCheck, Activity, Search
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Form states for Create/Edit task
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskStatus, setTaskStatus] = useState('Pending');

  // Control tabs: 'tasks', 'users', 'logs'
  const [activeTab, setActiveTab] = useState('tasks');

  useEffect(() => {
    fetchTasks();
    if (user.role === 'Admin' || user.role === 'Manager') {
      fetchUsers();
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'logs' && user.role === 'Admin') {
      fetchAuditLogs();
    }
  }, [activeTab]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAllUsers(data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const response = await fetch(`${API_URL}/api/logs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAuditLogs(data);
      }
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    }
  };

  const handleCreateOrUpdateTask = async (e) => {
    e.preventDefault();
    const endpoint = isEditing ? `${API_URL}/api/tasks/${currentTaskId}` : `${API_URL}/api/tasks`;
    const method = isEditing ? 'PUT' : 'POST';

    const payload = {
      title: taskTitle,
      description: taskDesc,
      status: taskStatus,
      dueDate: taskDueDate
    };

    if (user.role === 'Admin' || user.role === 'Manager') {
      payload.assignedTo = taskAssignee;
    }

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setIsModalOpen(false);
        resetForm();
        fetchTasks();
        if (activeTab === 'logs') fetchAuditLogs();
      } else {
        const errData = await response.json();
        alert(errData.message || 'Action failed');
      }
    } catch (err) {
      console.error('Error submitting task form:', err);
    }
  };

  const handleUserRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(`${API_URL}/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (response.ok) {
        fetchUsers();
        if (activeTab === 'logs') fetchAuditLogs();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to update user role');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUserDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        fetchUsers();
        fetchTasks();
        if (activeTab === 'logs') fetchAuditLogs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (task) => {
    setIsEditing(true);
    setCurrentTaskId(task._id);
    setTaskTitle(task.title);
    setTaskDesc(task.description);
    setTaskAssignee(task.assignedTo?._id || '');
    setTaskDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    setTaskStatus(task.status);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setIsEditing(false);
    resetForm();
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setTaskTitle('');
    setTaskDesc('');
    setTaskAssignee(allUsers[0]?._id || '');
    setTaskDueDate('');
    setTaskStatus('Pending');
  };

  const deleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        fetchTasks();
        if (activeTab === 'logs') fetchAuditLogs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Stats calculation
  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  const pendingCount = tasks.filter(t => t.status === 'Pending').length;

  // Search & Filter Operations logic
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (task.assignedTo?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' ? true : task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      
      {/* Navbar Header - Official flat border */}
      <header className="glass-panel" style={{
        margin: '16px 20px 24px',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '0px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            fontSize: '18px', 
            fontWeight: '900', 
            letterSpacing: '0.05em', 
            color: '#2563eb', 
            fontFamily: 'monospace',
            padding: '4px 8px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#f8fafc'
          }}>
            RBAC
          </div>
          <div>
            <h1 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.025em' }}>RBAC Task Hub</h1>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Operator: {user.name} ({user.role})</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Dashboard Tab Navigation Options */}
          <div style={{ display: 'flex', border: '1px solid #cbd5e1', padding: '2px', backgroundColor: '#f1f5f9' }}>
            <button 
              onClick={() => setActiveTab('tasks')}
              style={{
                background: activeTab === 'tasks' ? '#ffffff' : 'transparent',
                border: 'none',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: activeTab === 'tasks' ? '600' : '400',
                color: '#0f172a',
                cursor: 'pointer'
              }}
            >
              Task Logs
            </button>
            {user.role === 'Admin' && (
              <>
                <button 
                  onClick={() => setActiveTab('users')}
                  style={{
                    background: activeTab === 'users' ? '#ffffff' : 'transparent',
                    border: 'none',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: activeTab === 'users' ? '600' : '400',
                    color: '#0f172a',
                    cursor: 'pointer'
                  }}
                >
                  User Access
                </button>
                <button 
                  onClick={() => setActiveTab('logs')}
                  style={{
                    background: activeTab === 'logs' ? '#ffffff' : 'transparent',
                    border: 'none',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: activeTab === 'logs' ? '600' : '400',
                    color: '#0f172a',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Activity size={12} />
                  System Logs
                </button>
              </>
            )}
          </div>

          <button className="btn btn-danger" onClick={logout} style={{ padding: '8px 12px', fontSize: '13px', borderRadius: '0px' }}>
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main panel */}
      <main style={{ flex: 1, padding: '0 20px 40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* User Access Management View */}
        {activeTab === 'users' && user.role === 'Admin' && (
          <div className="glass-panel" style={{ padding: '24px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>System Directory & Privilege Controls</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Manage access groups and role assignments for system operatives.
                </p>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #cbd5e1', color: '#475569', fontWeight: '600' }}>
                    <th style={{ padding: '10px 12px' }}>OPERATIVE NAME</th>
                    <th style={{ padding: '10px 12px' }}>EMAIL ADDRESS</th>
                    <th style={{ padding: '10px 12px' }}>SECURITY GROUP</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((u) => (
                    <tr key={u._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px', fontWeight: '600', color: '#0f172a' }}>{u.name}</td>
                      <td style={{ padding: '12px', color: '#334155' }}>{u.email}</td>
                      <td style={{ padding: '12px' }}>
                        <select
                          value={u.role}
                          onChange={(e) => handleUserRoleChange(u._id, e.target.value)}
                          disabled={u._id === user._id}
                          style={{ padding: '4px 8px', borderRadius: '0px', height: '30px' }}
                        >
                          <option value="Admin">Admin</option>
                          <option value="Manager">Manager</option>
                          <option value="User">User</option>
                        </select>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <button
                          className="btn btn-danger"
                          disabled={u._id === user._id}
                          onClick={() => handleUserDelete(u._id)}
                          style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '0px' }}
                        >
                          <Trash2 size={12} />
                          Revoke Access
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Audit Log Tracking List View */}
        {activeTab === 'logs' && user.role === 'Admin' && (
          <div className="glass-panel" style={{ padding: '24px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>System Audit Ledger</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  A secure trail of operations, status updates, logins, and permission switches.
                </p>
              </div>
              <button className="btn btn-secondary" onClick={fetchAuditLogs} style={{ padding: '6px 12px', fontSize: '12px' }}>
                Refresh Trails
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #cbd5e1', color: '#475569', fontWeight: '600' }}>
                    <th style={{ padding: '10px 12px' }}>OPERATION TYPE</th>
                    <th style={{ padding: '10px 12px' }}>ACTION RECORDED</th>
                    <th style={{ padding: '10px 12px' }}>OPERATIVE</th>
                    <th style={{ padding: '10px 12px' }}>TIMESTAMP</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No operation activities recorded yet. Try creating or updating a task to generate logs.
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map((log) => (
                      <tr key={log._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            padding: '2px 6px',
                            fontSize: '10px',
                            fontWeight: '700',
                            background: log.action.startsWith('TASK') ? '#eff6ff' : '#f1f5f9',
                            color: log.action.startsWith('TASK') ? '#1e40af' : '#334155',
                            border: `1px solid ${log.action.startsWith('TASK') ? '#bfdbfe' : '#cbd5e1'}`
                          }}>
                            {log.action}
                          </span>
                        </td>
                        <td style={{ padding: '12px', color: '#0f172a', fontWeight: '500' }}>{log.details}</td>
                        <td style={{ padding: '12px', color: '#475569' }}>
                          {log.performedBy ? `${log.performedBy.name} (${log.performedBy.role})` : 'System'}
                        </td>
                        <td style={{ padding: '12px', color: '#64748b' }}>
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Task Management View */}
        {activeTab === 'tasks' && (
          <>
            {/* Stats Metrics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#ffffff' }}>
                <div className="flex-center" style={{ width: '40px', height: '40px', background: '#f1f5f9', border: '1px solid #cbd5e1' }}>
                  <Shield size={20} color="#475569" />
                </div>
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '500' }}>TOTAL REGISTERED</p>
                  <h4 style={{ fontSize: '20px', fontWeight: '700', marginTop: '2px', color: '#0f172a' }}>{totalCount}</h4>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#ffffff' }}>
                <div className="flex-center" style={{ width: '40px', height: '40px', background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
                  <CheckCircle size={20} color="var(--success)" />
                </div>
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '500' }}>COMPLETED</p>
                  <h4 style={{ fontSize: '20px', fontWeight: '700', marginTop: '2px', color: 'var(--success)' }}>{completedCount}</h4>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#ffffff' }}>
                <div className="flex-center" style={{ width: '40px', height: '40px', background: '#fef9c3', border: '1px solid #fef08a' }}>
                  <Clock size={20} color="var(--warning)" />
                </div>
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '500' }}>IN PROGRESS</p>
                  <h4 style={{ fontSize: '20px', fontWeight: '700', marginTop: '2px', color: 'var(--warning)' }}>{inProgressCount}</h4>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#ffffff' }}>
                <div className="flex-center" style={{ width: '40px', height: '40px', background: '#fef2f2', border: '1px solid #fca5a5' }}>
                  <AlertTriangle size={20} color="var(--danger)" />
                </div>
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '500' }}>PENDING</p>
                  <h4 style={{ fontSize: '20px', fontWeight: '700', marginTop: '2px', color: 'var(--danger)' }}>{pendingCount}</h4>
                </div>
              </div>
            </div>

            {/* Task Area Table Card */}
            <div className="glass-panel" style={{ padding: '24px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
              
              {/* Search, Filters, and New Task Header Area */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Active Task Logs</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {user.role === 'User' ? 'View status logs of tasks assigned to your node.' : 'Create, assign, or modify tasks.'}
                    </p>
                  </div>

                  {(user.role === 'Admin' || user.role === 'Manager') && (
                    <button className="btn btn-primary" onClick={openCreateModal} style={{ borderRadius: '0px' }}>
                      <Plus size={14} />
                      New Task Entry
                    </button>
                  )}
                </div>

                {/* Filter and Search Bar Controls - Enterprise Layout */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                    <Search size={15} color="var(--text-secondary)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                    <input
                      type="text"
                      placeholder="Search tasks by title, description or assignee name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ width: '100%', paddingLeft: '32px', height: '36px' }}
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ minWidth: '150px', height: '36px' }}
                  >
                    <option value="All">Filter: All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Tasks List Table */}
              {loading ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>Retrieving server tasks...</div>
              ) : filteredTasks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)', border: '1px dashed #cbd5e1' }}>
                  No records matching the search/filter criteria.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #cbd5e1', color: '#475569', fontWeight: '600' }}>
                        <th style={{ padding: '10px 12px' }}>LOG DETAILS</th>
                        <th style={{ padding: '10px 12px' }}>STATUS</th>
                        <th style={{ padding: '10px 12px' }}>ASSIGNED OPERATIVE</th>
                        <th style={{ padding: '10px 12px' }}>DUE DATE</th>
                        <th style={{ padding: '10px 12px', textAlign: 'right' }}>OPERATIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTasks.map((task) => (
                        <tr key={task._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '14px 12px' }}>
                            <div style={{ fontWeight: '700', color: '#0f172a' }}>{task.title}</div>
                            <div style={{ fontSize: '12px', color: '#475569', marginTop: '3px' }}>{task.description}</div>
                          </td>
                          <td style={{ padding: '14px 12px' }}>
                            <span style={{
                              padding: '2px 8px',
                              fontSize: '11px',
                              fontWeight: '700',
                              background: task.status === 'Completed' ? '#d1fae5' : task.status === 'In Progress' ? '#fef9c3' : '#fee2e2',
                              color: task.status === 'Completed' ? '#065f46' : task.status === 'In Progress' ? '#854d0e' : '#991b1b',
                              border: `1px solid ${task.status === 'Completed' ? '#a7f3d0' : task.status === 'In Progress' ? '#fef08a' : '#fca5a5'}`
                            }}>
                              {task.status.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: '14px 12px', color: '#334155' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <UserCheck size={14} color="#64748b" />
                              <span>{task.assignedTo?.name || 'Unassigned'}</span>
                            </div>
                          </td>
                          <td style={{ padding: '14px 12px', color: '#334155' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Calendar size={14} />
                              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '6px' }}>
                              <button 
                                className="btn btn-secondary" 
                                style={{ padding: '4px 8px', fontSize: '12px', borderRadius: '0px' }}
                                onClick={() => openEditModal(task)}
                              >
                                <Edit3 size={12} />
                                {user.role === 'User' ? 'Status' : 'Edit'}
                              </button>

                              {(user.role === 'Admin' || user.role === 'Manager') && (
                                <button 
                                  className="btn btn-danger" 
                                  style={{ padding: '4px 8px', fontSize: '12px', borderRadius: '0px' }}
                                  onClick={() => deleteTask(task._id)}
                                >
                                  <Trash2 size={12} />
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Create / Edit Task Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '460px', padding: '24px 28px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.025em', color: '#0f172a' }}>
              {isEditing ? (user.role === 'User' ? 'Update Task Status' : 'Edit Task Record') : 'Record New Task'}
            </h3>

            <form onSubmit={handleCreateOrUpdateTask} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {(user.role === 'Admin' || user.role === 'Manager') ? (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Task Title</label>
                    <input
                      type="text"
                      placeholder="e.g., Run Client Audit"
                      required
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Log Description</label>
                    <textarea
                      rows={3}
                      placeholder="Describe the operations..."
                      required
                      value={taskDesc}
                      onChange={(e) => setTaskDesc(e.target.value)}
                      style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '8px 12px', fontSize: '14px' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Assign Operative</label>
                    <select
                      value={taskAssignee}
                      onChange={(e) => setTaskAssignee(e.target.value)}
                      required
                    >
                      <option value="">-- Choose User --</option>
                      {allUsers.map((u) => (
                        <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Due Date</label>
                    <input
                      type="date"
                      required
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <div style={{ padding: '12px', background: '#f8fafc', border: '1px solid #cbd5e1' }}>
                  <h4 style={{ fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>{taskTitle}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '4px' }}>{taskDesc}</p>
                </div>
              )}

              {/* Status Select */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Status Log</label>
                <select
                  value={taskStatus}
                  onChange={(e) => setTaskStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? 'Save Entry' : 'Add Entry'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
