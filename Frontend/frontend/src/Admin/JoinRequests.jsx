import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JoinRequests.css';

const JoinRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchJoinRequests();
  }, []);

  const fetchJoinRequests = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login as admin');
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
      setError('Failed to load join requests');
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    const token = localStorage.getItem('token');
    setProcessing(requestId);

    try {
      await axios.put(
        `http://localhost:5000/admin/join-requests/${requestId}`,
        { status: action },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update the request status locally
      setRequests(requests.map(req =>
        req._id === requestId
          ? { ...req, status: action, respondedAt: new Date() }
          : req
      ));

      alert(`Request ${action} successfully!`);
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

  if (loading) return <div className="loading">Loading join requests...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="join-requests">
      <h1>Join Requests Management</h1>

      {requests.length === 0 ? (
        <div className="no-requests">No join requests found</div>
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
                      onClick={() => handleRequestAction(request._id, 'accepted')}
                      disabled={processing === request._id}
                    >
                      {processing === request._id ? 'Processing...' : 'Accept'}
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleRequestAction(request._id, 'rejected')}
                      disabled={processing === request._id}
                    >
                      {processing === request._id ? 'Processing...' : 'Reject'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JoinRequests;