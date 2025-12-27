import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Collaborations.css';

const Collaborations = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [messageModal, setMessageModal] = useState({ show: false, requestId: null, action: null, message: '' });

  useEffect(() => {
    fetchJoinRequests();
  }, []);

  const fetchJoinRequests = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to view collaboration requests');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/admin/join-requests', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRequests(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching collaboration requests:', err);
      if (err.response) {
        // Server responded with error status
        if (err.response.status === 401) {
          setError('Unauthorized access. Please login again.');
        } else if (err.response.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(`Failed to load collaboration requests: ${err.response.data?.message || err.response.statusText}`);
        }
      } else if (err.request) {
        // Network error
        setError('Network error. Please check if the server is running.');
      } else {
        // Other error
        setError('Failed to load collaboration requests. Please try again.');
      }
      setLoading(false);
    }
  };

  const refreshRequests = () => {
    setLoading(true);
    setError('');
    fetchJoinRequests();
  };

  const getStats = () => {
    const total = requests.length;
    const pending = requests.filter(req => req.status === 'pending').length;
    const accepted = requests.filter(req => req.status === 'accepted').length;
    const rejected = requests.filter(req => req.status === 'rejected').length;
    return { total, pending, accepted, rejected };
  };

  const openMessageModal = (requestId, action) => {
    setMessageModal({ show: true, requestId, action, message: '' });
  };

  const closeMessageModal = () => {
    setMessageModal({ show: false, requestId: null, action: null, message: '' });
  };

  const handleRequestAction = async (requestId, action, message = '') => {
    const token = localStorage.getItem('token');
    setProcessing(requestId);

    try {
      await axios.put(
        `http://localhost:5000/admin/join-requests/${requestId}`,
        { status: action, message },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update the request status locally
      setRequests(requests.map(req =>
        req._id === requestId
          ? { ...req, status: action, respondedAt: new Date(), responseMessage: message }
          : req
      ));

      alert(`Request ${action} successfully!${message ? ' Message sent.' : ''}`);
      closeMessageModal();
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${action} request`);
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'status-pending', text: 'Pending' },
      accepted: { class: 'status-accepted', text: 'Accepted' },
      rejected: { class: 'status-rejected', text: 'Rejected' }
    };
    return badges[status] || badges.pending;
  };

  if (loading) return <div className="loading">Loading collaboration requests...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="collaborations">
      <div className="collaborations-header">
        <h1>All Collaboration Requests</h1>
        <div className="header-actions">
          <button className="refresh-btn" onClick={refreshRequests} disabled={loading}>
            🔄 Refresh
          </button>
          <button className="stats-btn" onClick={() => setShowStats(!showStats)}>
            📊 {showStats ? 'Hide' : 'Show'} Stats
          </button>
        </div>
      </div>

      {showStats && (
        <div className="stats-container">
          <div className="stats-grid">
            <div className="stat-card total">
              <h3>{getStats().total}</h3>
              <p>Total Requests</p>
            </div>
            <div className="stat-card pending">
              <h3>{getStats().pending}</h3>
              <p>Pending</p>
            </div>
            <div className="stat-card accepted">
              <h3>{getStats().accepted}</h3>
              <p>Accepted</p>
            </div>
            <div className="stat-card rejected">
              <h3>{getStats().rejected}</h3>
              <p>Rejected</p>
            </div>
          </div>
        </div>
      )}

      {requests.length === 0 ? (
        <div className="no-requests">No collaboration requests found</div>
      ) : (
        <div className="requests-list">
          {requests.map((request) => (
            <div key={request._id} className="request-card">
              <div className="request-header">
                <div className="user-info">
                  <h3>{request.userId?.name || 'Unknown User'}</h3>
                  <p>{request.userId?.email} • {request.userId?.department}</p>
                  <p className="reg-no">Reg No: {request.userId?.regNo}</p>
                </div>
                <div className={`status-badge ${getStatusBadge(request.status).class}`}>
                  {getStatusBadge(request.status).text}
                </div>
              </div>

              <div className="project-info">
                <h4>Project: {request.projectId?.domain || 'Unknown Project'}</h4>
                <p><strong>Admin:</strong> {request.projectId?.adminName}</p>
                <p><strong>Department:</strong> {request.projectId?.department}</p>
                <p><strong>Description:</strong> {request.projectId?.projectDescription}</p>
                {request.message && (
                  <p><strong>Message:</strong> {request.message}</p>
                )}
                {request.responseMessage && (
                  <p><strong>Response:</strong> {request.responseMessage}</p>
                )}
              </div>

              {/* Timeline Section */}
              <div className="timeline-section">
                <h4>Timeline</h4>
                <div className="timeline">
                  <div className="timeline-item">
                    <div className="timeline-marker applied"></div>
                    <div className="timeline-content">
                      <h5>Applied</h5>
                      <p>{new Date(request.requestedAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                    </div>
                  </div>

                  {request.status !== 'pending' && (
                    <div className="timeline-item">
                      <div className={`timeline-marker ${request.status === 'accepted' ? 'accepted' : 'rejected'}`}></div>
                      <div className="timeline-content">
                        <h5>{request.status === 'accepted' ? 'Accepted' : 'Rejected'}</h5>
                        <p>{new Date(request.respondedAt).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</p>
                      </div>
                    </div>
                  )}

                  {request.projectId?.startDate && (
                    <div className="timeline-item">
                      <div className="timeline-marker project-start"></div>
                      <div className="timeline-content">
                        <h5>Project Start</h5>
                        <p>{new Date(request.projectId.startDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</p>
                      </div>
                    </div>
                  )}

                  {request.projectId?.endDate && (
                    <div className="timeline-item">
                      <div className="timeline-marker project-end"></div>
                      <div className="timeline-content">
                        <h5>Project End</h5>
                        <p>{new Date(request.projectId.endDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="request-footer">
                <div className="timestamp">
                  Requested: {new Date(request.requestedAt).toLocaleDateString()}
                  {request.respondedAt && (
                    <span> • Responded: {new Date(request.respondedAt).toLocaleDateString()}</span>
                  )}
                </div>

                {request.status === 'pending' && (
                  <div className="action-buttons">
                    <button
                      className="accept-btn"
                      onClick={() => openMessageModal(request._id, 'accepted')}
                      disabled={processing === request._id}
                    >
                      {processing === request._id ? 'Processing...' : 'Accept'}
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => openMessageModal(request._id, 'rejected')}
                      disabled={processing === request._id}
                    >
                      {processing === request._id ? 'Processing...' : 'Reject'}
                    </button>
                  </div>
                )}

                {request.status === 'accepted' && (
                  <div className="status-indicator accepted">
                    <span className="status-icon">✅</span>
                    <span className="status-text">Accepted - Ready for Collaboration</span>
                  </div>
                )}

                {request.status === 'rejected' && (
                  <div className="status-indicator rejected">
                    <span className="status-icon">❌</span>
                    <span className="status-text">Rejected</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {messageModal.show && (
        <div className="modal-overlay">
          <div className="message-modal">
            <h3>{messageModal.action === 'accepted' ? 'Accept' : 'Reject'} Request</h3>
            <p>Add an optional message to the {messageModal.action === 'accepted' ? 'accepted' : 'rejected'} request:</p>
            <textarea
              className="message-input"
              placeholder={`Enter a message for the ${messageModal.action} request...`}
              value={messageModal.message}
              onChange={(e) => setMessageModal({...messageModal, message: e.target.value})}
              rows={4}
            />
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={closeMessageModal}
              >
                Cancel
              </button>
              <button
                className={messageModal.action === 'accepted' ? 'confirm-accept-btn' : 'confirm-reject-btn'}
                onClick={() => handleRequestAction(messageModal.requestId, messageModal.action, messageModal.message)}
                disabled={processing === messageModal.requestId}
              >
                {processing === messageModal.requestId ? 'Processing...' :
                 messageModal.action === 'accepted' ? 'Accept Request' : 'Reject Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collaborations;
