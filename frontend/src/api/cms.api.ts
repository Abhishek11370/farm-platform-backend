import api from './axios';

export const cmsApi = {
  getBlogs: () => api.get('/cms/blogs').then(res => res.data),
  createBlog: (data: any) => api.post('/cms/blogs', data).then(res => res.data),
  updateBlog: (id: string, data: any) => api.put(`/cms/blogs/${id}`, data).then(res => res.data),
  deleteBlog: (id: string) => api.delete(`/cms/blogs/${id}`).then(res => res.data),

  getBanners: () => api.get('/cms/banners').then(res => res.data),
  createBanner: (data: any) => api.post('/cms/banners', data).then(res => res.data),
  updateBanner: (id: string, data: any) => api.put(`/cms/banners/${id}`, data).then(res => res.data),
  deleteBanner: (id: string) => api.delete(`/cms/banners/${id}`).then(res => res.data),

  getFAQs: () => api.get('/cms/faqs').then(res => res.data),
  createFAQ: (data: any) => api.post('/cms/faqs', data).then(res => res.data),
  updateFAQ: (id: string, data: any) => api.put(`/cms/faqs/${id}`, data).then(res => res.data),
  deleteFAQ: (id: string) => api.delete(`/cms/faqs/${id}`).then(res => res.data),
};
