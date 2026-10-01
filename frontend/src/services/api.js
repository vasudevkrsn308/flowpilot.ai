const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const token = localStorage.getItem('flowpilot_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    const data = await res.json();

    if (!res.ok) {
      const err = new Error(data.message || `Request failed with status ${res.status}`);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (err) {
    console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Auth
  auth: {
    login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    demoLogin: (role) => request('/auth/demo-login', { method: 'POST', body: JSON.stringify({ role }) }),
    me: () => request('/auth/me')
  },

  // Requests
  requests: {
    list: () => request('/requests'),
    getById: (id) => request(`/requests/${id}`),
    create: (data) => request('/requests', { method: 'POST', body: JSON.stringify(data) }),
    analyzePreview: (rawText) => request('/requests/analyze-preview', { method: 'POST', body: JSON.stringify({ rawText }) }),
    approve: (id, decisionData) => request(`/requests/${id}/approve`, { method: 'POST', body: JSON.stringify(decisionData) })
  },

  // Approvals
  approvals: {
    getPending: () => request('/approvals/pending'),
    getHistory: () => request('/approvals/history')
  },

  // Tasks
  tasks: {
    list: () => request('/tasks'),
    updateStatus: (id, status) => request(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) })
  },

  // Audit Logs
  auditLogs: {
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/audit-logs${query ? `?${query}` : ''}`);
    }
  },

  // Notifications
  notifications: {
    list: () => request('/notifications'),
    markRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
    markAllRead: () => request('/notifications/read-all', { method: 'PATCH' })
  },

  // Workflow Templates (AI Workflow Generator)
  workflows: {
    generate: (description) => request('/workflow-templates/generate', { method: 'POST', body: JSON.stringify({ description }) }),
    create: (templateData) => request('/workflow-templates', { method: 'POST', body: JSON.stringify(templateData) }),
    list: () => request('/workflow-templates'),
    getById: (id) => request(`/workflow-templates/${id}`),
    toggleActive: (id) => request(`/workflow-templates/${id}/activate`, { method: 'POST' })
  }
};
