import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Settings.css';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    // Profile settings
    profile: {
      name: '',
      email: '',
      department: '',
      regNo: '',
      bio: '',
      avatar: '',
      skills: [],
      socialLinks: {
        linkedin: '',
        github: '',
        portfolio: ''
      }
    },
    // Theme settings
    theme: {
      mode: 'light',
      primaryColor: '#3498db',
      accentColor: '#e74c3c',
      fontSize: 'medium',
      animations: true,
      compactMode: false
    },
    // Notification settings
    notifications: {
      email: {
        projectUpdates: true,
        collaborationRequests: true,
        systemAnnouncements: true,
        weeklyDigest: false
      },
      push: {
        newMessages: true,
        deadlineReminders: true,
        projectInvites: true,
        achievementBadges: true
      },
      inApp: {
        soundEnabled: true,
        desktopNotifications: true,
        autoHide: false
      }
    },
    // Privacy settings
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showDepartment: true,
      showProjects: true,
      allowMessaging: true,
      dataSharing: false,
      analyticsTracking: true
    },
    // Security settings
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 30,
      loginAlerts: true,
      passwordChangeRequired: false,
      trustedDevices: []
    },
    // Accessibility settings
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: true,
      fontSize: 'medium',
      colorBlindMode: false
    },
    // Data management
    data: {
      autoBackup: true,
      exportFrequency: 'monthly',
      retentionPeriod: 365,
      dataEncryption: true
    }
  });

  useEffect(() => {
    fetchUserData();
    loadSettings();
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get('http://localhost:5000/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
      setSettings(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          name: response.data.user.name || '',
          email: response.data.user.email || '',
          department: response.data.user.department || '',
          regNo: response.data.user.regNo || ''
        }
      }));
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('colabsphere_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
        applyTheme(parsed.theme);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      localStorage.setItem('colabsphere_settings', JSON.stringify(settings));
      applyTheme(settings.theme);

      // Save to backend if needed
      const token = localStorage.getItem('token');
      if (token) {
        await axios.put('http://localhost:5000/auth/settings', settings, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      showNotification('Settings saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      showNotification('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const applyTheme = (theme) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme.mode);
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--accent-color', theme.accentColor);
    root.style.setProperty('--font-size', theme.fontSize === 'small' ? '0.9rem' : theme.fontSize === 'large' ? '1.2rem' : '1rem');

    if (theme.animations === false) {
      root.style.setProperty('--animation-duration', '0s');
    }
  };

  const showNotification = (message, type) => {
    // Simple notification system
    const notification = document.createElement('div');
    notification.className = `settings-notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const updateSetting = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const updateNestedSetting = (section, subsection, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [key]: value
        }
      }
    }));
  };

  const exportData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/auth/export-data', {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'colabsphere-data.json');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      showNotification('Failed to export data', 'error');
    }
  };

  const resetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      const defaultSettings = {
        theme: { mode: 'light', primaryColor: '#3498db', accentColor: '#e74c3c', fontSize: 'medium', animations: true, compactMode: false },
        notifications: { email: { projectUpdates: true, collaborationRequests: true, systemAnnouncements: true, weeklyDigest: false }, push: { newMessages: true, deadlineReminders: true, projectInvites: true, achievementBadges: true }, inApp: { soundEnabled: true, desktopNotifications: true, autoHide: false } },
        privacy: { profileVisibility: 'public', showEmail: false, showDepartment: true, showProjects: true, allowMessaging: true, dataSharing: false, analyticsTracking: true },
        security: { twoFactorEnabled: false, sessionTimeout: 30, loginAlerts: true, passwordChangeRequired: false, trustedDevices: [] },
        accessibility: { highContrast: false, reducedMotion: false, screenReader: false, keyboardNavigation: true, fontSize: 'medium', colorBlindMode: false },
        data: { autoBackup: true, exportFrequency: 'monthly', retentionPeriod: 365, dataEncryption: true }
      };
      setSettings(prev => ({ ...prev, ...defaultSettings }));
      applyTheme(defaultSettings.theme);
      showNotification('Settings reset to default', 'success');
    }
  };

  const themes = [
    { name: 'Light', mode: 'light', primary: '#3498db', accent: '#e74c3c' },
    { name: 'Dark', mode: 'dark', primary: '#2980b9', accent: '#c0392b' },
    { name: 'Blue Ocean', mode: 'light', primary: '#1e3a8a', accent: '#06b6d4' },
    { name: 'Forest Green', mode: 'light', primary: '#059669', accent: '#dc2626' },
    { name: 'Purple Dream', mode: 'light', primary: '#7c3aed', accent: '#f59e0b' },
    { name: 'Sunset Orange', mode: 'light', primary: '#ea580c', accent: '#3b82f6' }
  ];

  const renderProfileSection = () => (
    <div className="settings-section">
      <h2>👤 Profile Settings</h2>
      <div className="settings-grid">
        <div className="setting-group">
          <h3>Basic Information</h3>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={settings.profile.name}
              onChange={(e) => updateSetting('profile', 'name', e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={settings.profile.email}
              onChange={(e) => updateSetting('profile', 'email', e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              value={settings.profile.department}
              onChange={(e) => updateSetting('profile', 'department', e.target.value)}
              placeholder="Your department"
            />
          </div>
          <div className="form-group">
            <label>Registration Number</label>
            <input
              type="text"
              value={settings.profile.regNo}
              onChange={(e) => updateSetting('profile', 'regNo', e.target.value)}
              placeholder="Your registration number"
            />
          </div>
        </div>

        <div className="setting-group">
          <h3>Professional Details</h3>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={settings.profile.bio}
              onChange={(e) => updateSetting('profile', 'bio', e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>
          <div className="form-group">
            <label>Skills (comma-separated)</label>
            <input
              type="text"
              value={settings.profile.skills.join(', ')}
              onChange={(e) => updateSetting('profile', 'skills', e.target.value.split(',').map(s => s.trim()))}
              placeholder="React, Node.js, Python..."
            />
          </div>
        </div>

        <div className="setting-group">
          <h3>Social Links</h3>
          <div className="form-group">
            <label>LinkedIn</label>
            <input
              type="url"
              value={settings.profile.socialLinks.linkedin}
              onChange={(e) => updateNestedSetting('profile', 'socialLinks', 'linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
          <div className="form-group">
            <label>GitHub</label>
            <input
              type="url"
              value={settings.profile.socialLinks.github}
              onChange={(e) => updateNestedSetting('profile', 'socialLinks', 'github', e.target.value)}
              placeholder="https://github.com/yourusername"
            />
          </div>
          <div className="form-group">
            <label>Portfolio</label>
            <input
              type="url"
              value={settings.profile.socialLinks.portfolio}
              onChange={(e) => updateNestedSetting('profile', 'socialLinks', 'portfolio', e.target.value)}
              placeholder="https://yourportfolio.com"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderThemeSection = () => (
    <div className="settings-section">
      <h2>🎨 Theme & Appearance</h2>
      <div className="settings-grid">
        <div className="setting-group">
          <h3>Theme Presets</h3>
          <div className="theme-grid">
            {themes.map((theme, index) => (
              <div
                key={index}
                className={`theme-card ${settings.theme.mode === theme.mode && settings.theme.primaryColor === theme.primary ? 'active' : ''}`}
                onClick={() => {
                  updateSetting('theme', 'mode', theme.mode);
                  updateSetting('theme', 'primaryColor', theme.primary);
                  updateSetting('theme', 'accentColor', theme.accent);
                }}
              >
                <div className="theme-preview" style={{
                  background: theme.mode === 'dark' ? '#2c3e50' : '#f8f9fa',
                  border: `2px solid ${theme.primary}`
                }}>
                  <div className="theme-colors">
                    <div style={{ background: theme.primary }}></div>
                    <div style={{ background: theme.accent }}></div>
                  </div>
                </div>
                <span>{theme.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="setting-group">
          <h3>Display Options</h3>
          <div className="toggle-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.theme.animations}
                onChange={(e) => updateSetting('theme', 'animations', e.target.checked)}
              />
              <span className="toggle-slider"></span>
              Enable Animations
            </label>
          </div>
          <div className="toggle-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.theme.compactMode}
                onChange={(e) => updateSetting('theme', 'compactMode', e.target.checked)}
              />
              <span className="toggle-slider"></span>
              Compact Mode
            </label>
          </div>
        </div>

        <div className="setting-group">
          <h3>Typography</h3>
          <div className="radio-group">
            {['small', 'medium', 'large'].map(size => (
              <label key={size} className="radio-label">
                <input
                  type="radio"
                  name="fontSize"
                  value={size}
                  checked={settings.theme.fontSize === size}
                  onChange={(e) => updateSetting('theme', 'fontSize', e.target.value)}
                />
                {size.charAt(0).toUpperCase() + size.slice(1)} Text
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="settings-section">
      <h2>🔔 Notification Preferences</h2>
      <div className="settings-grid">
        <div className="setting-group">
          <h3>📧 Email Notifications</h3>
          <div className="checkbox-group">
            {Object.entries(settings.notifications.email).map(([key, value]) => (
              <label key={key} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => updateNestedSetting('notifications', 'email', key, e.target.checked)}
                />
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>
            ))}
          </div>
        </div>

        <div className="setting-group">
          <h3>📱 Push Notifications</h3>
          <div className="checkbox-group">
            {Object.entries(settings.notifications.push).map(([key, value]) => (
              <label key={key} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => updateNestedSetting('notifications', 'push', key, e.target.checked)}
                />
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>
            ))}
          </div>
        </div>

        <div className="setting-group">
          <h3>💻 In-App Notifications</h3>
          <div className="checkbox-group">
            {Object.entries(settings.notifications.inApp).map(([key, value]) => (
              <label key={key} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => updateNestedSetting('notifications', 'inApp', key, e.target.checked)}
                />
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySection = () => (
    <div className="settings-section">
      <h2>🔒 Privacy & Security</h2>
      <div className="settings-grid">
        <div className="setting-group">
          <h3>Profile Visibility</h3>
          <div className="radio-group">
            {['public', 'friends', 'private'].map(level => (
              <label key={level} className="radio-label">
                <input
                  type="radio"
                  name="profileVisibility"
                  value={level}
                  checked={settings.privacy.profileVisibility === level}
                  onChange={(e) => updateSetting('privacy', 'profileVisibility', e.target.value)}
                />
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div className="setting-group">
          <h3>Data Sharing</h3>
          <div className="checkbox-group">
            {Object.entries(settings.privacy).slice(1).map(([key, value]) => (
              <label key={key} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => updateSetting('privacy', key, e.target.checked)}
                />
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>
            ))}
          </div>
        </div>

        <div className="setting-group">
          <h3>Security Settings</h3>
          <div className="toggle-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.security.twoFactorEnabled}
                onChange={(e) => updateSetting('security', 'twoFactorEnabled', e.target.checked)}
              />
              <span className="toggle-slider"></span>
              Two-Factor Authentication
            </label>
          </div>
          <div className="toggle-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.security.loginAlerts}
                onChange={(e) => updateSetting('security', 'loginAlerts', e.target.checked)}
              />
              <span className="toggle-slider"></span>
              Login Alerts
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccessibilitySection = () => (
    <div className="settings-section">
      <h2>♿ Accessibility</h2>
      <div className="settings-grid">
        <div className="setting-group">
          <h3>Visual Preferences</h3>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.accessibility.highContrast}
                onChange={(e) => updateSetting('accessibility', 'highContrast', e.target.checked)}
              />
              High Contrast Mode
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.accessibility.reducedMotion}
                onChange={(e) => updateSetting('accessibility', 'reducedMotion', e.target.checked)}
              />
              Reduced Motion
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.accessibility.colorBlindMode}
                onChange={(e) => updateSetting('accessibility', 'colorBlindMode', e.target.checked)}
              />
              Color Blind Friendly
            </label>
          </div>
        </div>

        <div className="setting-group">
          <h3>Navigation</h3>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.accessibility.keyboardNavigation}
                onChange={(e) => updateSetting('accessibility', 'keyboardNavigation', e.target.checked)}
              />
              Keyboard Navigation
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.accessibility.screenReader}
                onChange={(e) => updateSetting('accessibility', 'screenReader', e.target.checked)}
              />
              Screen Reader Support
            </label>
          </div>
        </div>

        <div className="setting-group">
          <h3>Text Size</h3>
          <div className="radio-group">
            {['small', 'medium', 'large'].map(size => (
              <label key={size} className="radio-label">
                <input
                  type="radio"
                  name="accessibilityFontSize"
                  value={size}
                  checked={settings.accessibility.fontSize === size}
                  onChange={(e) => updateSetting('accessibility', 'fontSize', e.target.value)}
                />
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataSection = () => (
    <div className="settings-section">
      <h2>💾 Data Management</h2>
      <div className="settings-grid">
        <div className="setting-group">
          <h3>Data Export & Backup</h3>
          <div className="action-buttons">
            <button onClick={exportData} className="export-btn">
              📤 Export My Data
            </button>
            <button onClick={() => showNotification('Backup feature coming soon!', 'info')} className="backup-btn">
              💾 Create Backup
            </button>
          </div>
          <p className="help-text">
            Export all your data including projects, collaborations, and profile information.
          </p>
        </div>

        <div className="setting-group">
          <h3>Auto-Backup Settings</h3>
          <div className="toggle-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.data.autoBackup}
                onChange={(e) => updateSetting('data', 'autoBackup', e.target.checked)}
              />
              <span className="toggle-slider"></span>
              Enable Auto-Backup
            </label>
          </div>
          <div className="form-group">
            <label>Backup Frequency</label>
            <select
              value={settings.data.exportFrequency}
              onChange={(e) => updateSetting('data', 'exportFrequency', e.target.value)}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
        </div>

        <div className="setting-group">
          <h3>Data Retention</h3>
          <div className="form-group">
            <label>Retention Period (days)</label>
            <input
              type="number"
              value={settings.data.retentionPeriod}
              onChange={(e) => updateSetting('data', 'retentionPeriod', parseInt(e.target.value))}
              min="30"
              max="3650"
            />
          </div>
          <div className="toggle-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.data.dataEncryption}
                onChange={(e) => updateSetting('data', 'dataEncryption', e.target.checked)}
              />
              <span className="toggle-slider"></span>
              Enable Data Encryption
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuickActions = () => (
    <div className="settings-section">
      <div className="welcome-section">
        <h2>🏠 Welcome to Advanced Settings</h2>
        <p>Customize your ColabSphere experience with powerful features and preferences</p>
      </div>

      <div className="settings-summary">
        <h3>Current Configuration</h3>
        <div className="summary-cards">
          <div className="summary-card">
            <span className="summary-icon">🎨</span>
            <div className="summary-content">
              <h4>Theme</h4>
              <p>{settings.theme.mode === 'light' ? 'Light Mode' : 'Dark Mode'}</p>
            </div>
          </div>
          <div className="summary-card">
            <span className="summary-icon">🔔</span>
            <div className="summary-content">
              <h4>Notifications</h4>
              <p>{Object.values(settings.notifications.email).filter(Boolean).length} email prefs</p>
            </div>
          </div>
          <div className="summary-card">
            <span className="summary-icon">🔒</span>
            <div className="summary-content">
              <h4>Privacy</h4>
              <p>{settings.privacy.profileVisibility}</p>
            </div>
          </div>
          <div className="summary-card">
            <span className="summary-icon">♿</span>
            <div className="summary-content">
              <h4>Accessibility</h4>
              <p>{settings.accessibility.highContrast ? 'High Contrast' : 'Standard'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="quick-actions-section">
        <h3>⚡ Quick Actions</h3>
        <div className="quick-actions-grid">
          <div className="quick-action-card" onClick={() => setActiveSection('profile')}>
            <div className="action-icon">👤</div>
            <h3>Edit Profile</h3>
            <p>Update your personal information and professional details</p>
          </div>
          <div className="quick-action-card" onClick={() => setActiveSection('theme')}>
            <div className="action-icon">🎨</div>
            <h3>Visual Themes</h3>
            <p>Choose from multiple themes and customize colors</p>
          </div>
          <div className="quick-action-card" onClick={() => setActiveSection('notifications')}>
            <div className="action-icon">🔔</div>
            <h3>Smart Notifications</h3>
            <p>Control email, push, and in-app notifications</p>
          </div>
          <div className="quick-action-card" onClick={() => setActiveSection('privacy')}>
            <div className="action-icon">🔒</div>
            <h3>Privacy Controls</h3>
            <p>Manage data sharing and security preferences</p>
          </div>
          <div className="quick-action-card" onClick={() => setActiveSection('accessibility')}>
            <div className="action-icon">♿</div>
            <h3>Accessibility</h3>
            <p>Screen reader, high contrast, and navigation options</p>
          </div>
          <div className="quick-action-card" onClick={() => setActiveSection('data')}>
            <div className="action-icon">💾</div>
            <h3>Data Management</h3>
            <p>Export data, backups, and retention settings</p>
          </div>
          <div className="quick-action-card" onClick={() => window.location.href = '/admin/insights'}>
            <div className="action-icon">📊</div>
            <h3>View Analytics</h3>
            <p>Check collaboration insights and statistics</p>
          </div>
          <div className="quick-action-card" onClick={() => window.open('https://colabsphere-docs.example.com', '_blank')}>
            <div className="action-icon">📚</div>
            <h3>Help & Docs</h3>
            <p>Access user guides and support resources</p>
          </div>
        </div>
      </div>

      <div className="advanced-features">
        <h3>🚀 Advanced Features</h3>
        <div className="feature-grid">
          <div className="feature-item">
            <div className="feature-icon">🎯</div>
            <div className="feature-content">
              <h4>AI-Powered Recommendations</h4>
              <p>Get personalized project suggestions based on your interests</p>
              <button className="feature-btn" onClick={() => showNotification('AI recommendations coming soon!', 'info')}>
                Enable
              </button>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🤖</div>
            <div className="feature-content">
              <h4>Smart Scheduling</h4>
              <p>Automated meeting scheduling and deadline reminders</p>
              <button className="feature-btn" onClick={() => showNotification('Smart scheduling available in premium!', 'info')}>
                Upgrade
              </button>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🔗</div>
            <div className="feature-content">
              <h4>Integration Hub</h4>
              <p>Connect with GitHub, Slack, and other productivity tools</p>
              <button className="feature-btn" onClick={() => showNotification('Integration hub launching soon!', 'info')}>
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="settings">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings">
      <div className="settings-header">
        <h1>⚙️ Advanced Settings</h1>
        <div className="header-actions">
          <button onClick={resetSettings} className="reset-btn">
            🔄 Reset to Default
          </button>
          <button onClick={saveSettings} disabled={saving} className="save-btn">
            {saving ? '💾 Saving...' : '💾 Save Settings'}
          </button>
        </div>
      </div>

      <div className="settings-container">
        <div className="settings-sidebar">
          <nav className="settings-nav">
            {[
              { id: 'overview', label: 'Overview', icon: '🏠' },
              { id: 'profile', label: 'Profile', icon: '👤' },
              { id: 'theme', label: 'Theme', icon: '🎨' },
              { id: 'notifications', label: 'Notifications', icon: '🔔' },
              { id: 'privacy', label: 'Privacy', icon: '🔒' },
              { id: 'accessibility', label: 'Accessibility', icon: '♿' },
              { id: 'data', label: 'Data', icon: '💾' }
            ].map(section => (
              <button
                key={section.id}
                className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="nav-icon">{section.icon}</span>
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="settings-content">
          {activeSection === 'overview' && renderQuickActions()}
          {activeSection === 'profile' && renderProfileSection()}
          {activeSection === 'theme' && renderThemeSection()}
          {activeSection === 'notifications' && renderNotificationsSection()}
          {activeSection === 'privacy' && renderPrivacySection()}
          {activeSection === 'accessibility' && renderAccessibilitySection()}
          {activeSection === 'data' && renderDataSection()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
