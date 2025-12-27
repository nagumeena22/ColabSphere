import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Insights.css';

const Insights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to view insights');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/admin/insights', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setInsights(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching insights:', err);
      if (err.response) {
        if (err.response.status === 401) {
          setError('Unauthorized access. Please login again.');
        } else {
          setError(`Failed to load insights: ${err.response.data?.message || err.response.statusText}`);
        }
      } else if (err.request) {
        setError('Network error. Please check if the server is running.');
      } else {
        setError('Failed to load insights. Please try again.');
      }
      setLoading(false);
    }
  };

  const renderOverviewCards = () => {
    if (!insights) return null;

    const { overview } = insights;
    const total = overview.totalRequests;

    return (
      <div className="overview-cards">
        <div className="metric-card total">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <h3>{total}</h3>
            <p>Total Applications</p>
          </div>
        </div>
        <div className="metric-card pending">
          <div className="metric-icon">⏳</div>
          <div className="metric-content">
            <h3>{overview.pendingRequests}</h3>
            <p>Pending</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${total > 0 ? (overview.pendingRequests / total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="metric-card accepted">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <h3>{overview.acceptedRequests}</h3>
            <p>Accepted</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${total > 0 ? (overview.acceptedRequests / total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="metric-card rejected">
          <div className="metric-icon">❌</div>
          <div className="metric-content">
            <h3>{overview.rejectedRequests}</h3>
            <p>Rejected</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${total > 0 ? (overview.rejectedRequests / total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProjectStatsChart = () => {
    if (!insights?.projectStats) return null;

    const maxTotal = Math.max(...insights.projectStats.map(p => p.total));

    return (
      <div className="chart-container">
        <h3>Project Applications</h3>
        <div className="bar-chart">
          {insights.projectStats.map((project, index) => (
            <div key={index} className="chart-item">
              <div className="chart-label">
                <span className="project-name">{project.projectName}</span>
                <span className="project-stats">
                  {project.accepted}/{project.total} ({project.acceptanceRate.toFixed(1)}%)
                </span>
              </div>
              <div className="chart-bar">
                <div
                  className="bar-fill total"
                  style={{ width: `${(project.total / maxTotal) * 100}%` }}
                ></div>
                <div
                  className="bar-fill accepted"
                  style={{ width: `${(project.accepted / maxTotal) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTopCollaborators = () => {
    if (!insights?.topCollaborators) return null;

    return (
      <div className="collaborators-container">
        <h3>Top Collaborators</h3>
        <div className="collaborators-list">
          {insights.topCollaborators.map((collaborator, index) => (
            <div key={index} className="collaborator-item">
              <div className="rank">#{index + 1}</div>
              <div className="collaborator-info">
                <h4>{collaborator.name}</h4>
                <p>{collaborator.regNo} • {collaborator.department}</p>
              </div>
              <div className="accepted-count">
                <span className="count">{collaborator.acceptedCount}</span>
                <span className="label">Accepted</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDayWiseChart = () => {
    if (!insights?.dayWiseData) return null;

    const maxTotal = Math.max(...insights.dayWiseData.map(d => d.total));

    return (
      <div className="chart-container">
        <h3>Daily Collaboration Trends (Last 30 Days)</h3>
        <div className="line-chart">
          {insights.dayWiseData.map((day, index) => (
            <div key={index} className="day-item">
              <div className="day-label">{new Date(day._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
              <div className="day-bars">
                <div
                  className="day-bar accepted"
                  style={{ height: `${maxTotal > 0 ? (day.accepted / maxTotal) * 100 : 0}%` }}
                  title={`Accepted: ${day.accepted}`}
                ></div>
                <div
                  className="day-bar pending"
                  style={{ height: `${maxTotal > 0 ? (day.pending / maxTotal) * 100 : 0}%` }}
                  title={`Pending: ${day.pending}`}
                ></div>
                <div
                  className="day-bar rejected"
                  style={{ height: `${maxTotal > 0 ? (day.rejected / maxTotal) * 100 : 0}%` }}
                  title={`Rejected: ${day.rejected}`}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color accepted"></div>
            <span>Accepted</span>
          </div>
          <div className="legend-item">
            <div className="legend-color pending"></div>
            <span>Pending</span>
          </div>
          <div className="legend-item">
            <div className="legend-color rejected"></div>
            <span>Rejected</span>
          </div>
        </div>
      </div>
    );
  };

  const renderAcceptanceRatio = () => {
    if (!insights?.highestAcceptanceRatio) return null;

    return (
      <div className="acceptance-ratio-container">
        <h3>Highest Acceptance Ratios</h3>
        <div className="ratio-list">
          {insights.highestAcceptanceRatio.map((project, index) => (
            <div key={index} className="ratio-item">
              <div className="ratio-info">
                <h4>{project.projectName}</h4>
                <p>{project.department} • {project.domain}</p>
              </div>
              <div className="ratio-stats">
                <div className="ratio-bar">
                  <div
                    className="ratio-fill"
                    style={{ width: `${project.acceptanceRate}%` }}
                  ></div>
                </div>
                <span className="ratio-text">{project.acceptanceRate.toFixed(1)}%</span>
                <span className="ratio-count">({project.accepted}/{project.total})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="insights">
        <div className="loading">Loading insights...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="insights">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="insights">
      <div className="insights-header">
        <h1>Collaboration Insights</h1>
        <button onClick={fetchInsights} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      <div className="insights-tabs">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={activeTab === 'projects' ? 'active' : ''}
          onClick={() => setActiveTab('projects')}
        >
          Projects
        </button>
        <button
          className={activeTab === 'collaborators' ? 'active' : ''}
          onClick={() => setActiveTab('collaborators')}
        >
          Collaborators
        </button>
        <button
          className={activeTab === 'trends' ? 'active' : ''}
          onClick={() => setActiveTab('trends')}
        >
          Trends
        </button>
      </div>

      <div className="insights-content">
        {activeTab === 'overview' && (
          <div className="tab-content">
            {renderOverviewCards()}
            {renderAcceptanceRatio()}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="tab-content">
            {renderProjectStatsChart()}
          </div>
        )}

        {activeTab === 'collaborators' && (
          <div className="tab-content">
            {renderTopCollaborators()}
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="tab-content">
            {renderDayWiseChart()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Insights;
