const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('lcc_auth_token') || localStorage.getItem('lcc_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Generic fetcher with JSON handling and timeout
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const customHeaders = (options.headers as Record<string, string>) || {};
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...customHeaders
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err: any) {
    // Resilient offline fallback without console spam
    throw err;
  }
}

export const api = {
  // Auth API
  auth: {
    register: (body: { name: string; email: string; phone: string; password: string; targetClass?: string }) =>
      request<{ success: boolean; message: string; token: string; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(body)
      }),
    login: (body: { email: string; password: string }) =>
      request<{ success: boolean; message: string; token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(body)
      }),
    adminLogin: (body: { email: string; password: string }) =>
      request<{ success: boolean; message: string; token: string; admin: any }>('/auth/admin-login', {
        method: 'POST',
        body: JSON.stringify(body)
      }),
    forgotPassword: (phone: string) =>
      request<{ success: boolean; message: string; sessionMobile: string; devOtpHint?: string }>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ phone })
      }),
    verifyOTP: (mobile: string, otp: string) =>
      request<{ success: boolean; message: string; resetToken: string }>('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ mobile, otp })
      }),
    resetPassword: (resetToken: string, newPassword: string) =>
      request<{ success: boolean; message: string }>('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ resetToken, newPassword })
      }),
    getUsers: () => request<{ success: boolean; data: any[] }>('/auth/users'),
    toggleUser: (id: string) => request<{ success: boolean; message: string; user: any }>(`/auth/users/${id}/toggle`, {
      method: 'PATCH'
    }),
    deleteUser: (id: string) => request<{ success: boolean; message: string }>(`/auth/users/${id}`, {
      method: 'DELETE'
    })
  },

  // Courses API
  courses: {
    get: () => request<{ success: boolean; data: any[] }>('/courses'),
    create: (course: any) => request<{ success: boolean; message: string; data: any }>('/courses', {
      method: 'POST',
      body: JSON.stringify(course)
    }),
    update: (id: string, course: any) => request<{ success: boolean; message: string; data: any }>(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(course)
    }),
    delete: (id: string) => request<{ success: boolean; message: string }>(`/courses/${id}`, {
      method: 'DELETE'
    })
  },

  // Ads API
  ads: {
    get: (params?: { placement?: string; all?: boolean }) => {
      const query = new URLSearchParams();
      if (params?.placement) query.append('placement', params.placement);
      if (params?.all) query.append('all', 'true');
      return request<{ success: boolean; data: any[] }>(`/ads?${query.toString()}`);
    },
    create: (ad: any) => request<{ success: boolean; message: string; data: any }>('/ads', {
      method: 'POST',
      body: JSON.stringify(ad)
    }),
    update: (id: string, ad: any) => request<{ success: boolean; message: string; data: any }>(`/ads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ad)
    }),
    toggle: (id: string) => request<{ success: boolean; message: string; data: any }>(`/ads/${id}/toggle`, {
      method: 'PATCH'
    }),
    delete: (id: string) => request<{ success: boolean; message: string }>(`/ads/${id}`, {
      method: 'DELETE'
    }),
    trackClick: (id: string) => request<{ success: boolean }>(`/ads/click/${id}`, {
      method: 'POST'
    })
  },

  // Media (PDFs & Videos)
  media: {
    getPDFs: () => request<{ success: boolean; data: any[] }>('/media/pdfs'),
    createPDF: (pdf: any) => request<{ success: boolean; message: string; data: any }>('/media/pdfs', {
      method: 'POST',
      body: JSON.stringify(pdf)
    }),
    deletePDF: (id: string) => request<{ success: boolean; message: string }>(`/media/pdfs/${id}`, {
      method: 'DELETE'
    }),
    getVideos: (all = false) => request<{ success: boolean; data: any[] }>(`/media/videos${all ? '?all=true' : ''}`),
    createVideo: (video: any) => request<{ success: boolean; message: string; data: any }>('/media/videos', {
      method: 'POST',
      body: JSON.stringify(video)
    }),
    toggleVideo: (id: string) => request<{ success: boolean; message: string; data: any }>(`/media/videos/${id}/toggle`, {
      method: 'PATCH'
    }),
    deleteVideo: (id: string) => request<{ success: boolean; message: string }>(`/media/videos/${id}`, {
      method: 'DELETE'
    })
  },

  // Notices API
  notices: {
    get: () => request<{ success: boolean; data: any[] }>('/notices'),
    create: (notice: any) => request<{ success: boolean; message: string; data: any }>('/notices', {
      method: 'POST',
      body: JSON.stringify(notice)
    }),
    delete: (id: string) => request<{ success: boolean; message: string }>(`/notices/${id}`, {
      method: 'DELETE'
    })
  },

  // Gallery API
  gallery: {
    get: () => request<{ success: boolean; data: any[] }>('/gallery'),
    create: (item: any) => request<{ success: boolean; message: string; data: any }>('/gallery', {
      method: 'POST',
      body: JSON.stringify(item)
    }),
    delete: (id: string) => request<{ success: boolean; message: string }>(`/gallery/${id}`, {
      method: 'DELETE'
    })
  },

  // Instagram API
  instagram: {
    get: () => request<{ success: boolean; data: any[] }>('/instagram'),
    create: (post: any) => request<{ success: boolean; message: string; data: any }>('/instagram', {
      method: 'POST',
      body: JSON.stringify(post)
    }),
    update: (id: string, post: any) => request<{ success: boolean; message: string; data: any }>(`/instagram/${id}`, {
      method: 'PUT',
      body: JSON.stringify(post)
    }),
    delete: (id: string) => request<{ success: boolean; message: string }>(`/instagram/${id}`, {
      method: 'DELETE'
    })
  },

  // Syllabus API
  syllabus: {
    get: () => request<{ success: boolean; data: any[] }>('/syllabus'),
    create: (item: any) => request<{ success: boolean; message: string; data: any }>('/syllabus', {
      method: 'POST',
      body: JSON.stringify(item)
    }),
    delete: (id: string) => request<{ success: boolean; message: string }>(`/syllabus/${id}`, {
      method: 'DELETE'
    })
  },

  // Reviews
  reviews: {
    get: (all = false) => request<{ success: boolean; data: any[] }>(`/reviews${all ? '?all=true' : ''}`),
    submit: (review: { studentName: string; studentClass?: string; rating: number; comment: string }) =>
      request<{ success: boolean; message: string; data: any }>('/reviews', {
        method: 'POST',
        body: JSON.stringify(review)
      }),
    moderate: (id: string, status: 'approved' | 'rejected') =>
      request<{ success: boolean; message: string; data: any }>(`/reviews/${id}/moderate`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }),
    delete: (id: string) => request<{ success: boolean; message: string }>(`/reviews/${id}`, {
      method: 'DELETE'
    })
  },

  // Socials
  socials: {
    get: () => request<{ success: boolean; data: any[] }>('/socials'),
    update: (id: string, body: any) => request<{ success: boolean; message: string; data: any }>(`/socials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    })
  },

  // Settings
  settings: {
    get: () => request<{ success: boolean; data: any }>('/settings'),
    update: (body: any) => request<{ success: boolean; message: string; data: any }>(`/settings`, {
      method: 'PUT',
      body: JSON.stringify(body)
    })
  },

  // Inquiries
  inquiries: {
    submit: (body: any) => request<{ success: boolean; message: string; data: any }>('/inquiries', {
      method: 'POST',
      body: JSON.stringify(body)
    }),
    get: () => request<{ success: boolean; data: any[] }>('/inquiries'),
    updateStatus: (id: string, status: string) => request<{ success: boolean; message: string; data: any }>(`/inquiries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    })
  }
};
