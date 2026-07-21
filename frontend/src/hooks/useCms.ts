import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cmsApi } from '../api/cms.api';

export function useCms() {
  const queryClient = useQueryClient();

  const blogs = useQuery({ queryKey: ['blogs'], queryFn: cmsApi.getBlogs });
  const createBlog = useMutation({
    mutationFn: cmsApi.createBlog,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] }),
  });
  const updateBlog = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => cmsApi.updateBlog(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] }),
  });
  const deleteBlog = useMutation({
    mutationFn: cmsApi.deleteBlog,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] }),
  });

  const banners = useQuery({ queryKey: ['banners'], queryFn: cmsApi.getBanners });
  const createBanner = useMutation({
    mutationFn: cmsApi.createBanner,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['banners'] }),
  });
  const updateBanner = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => cmsApi.updateBanner(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['banners'] }),
  });
  const deleteBanner = useMutation({
    mutationFn: cmsApi.deleteBanner,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['banners'] }),
  });

  const faqs = useQuery({ queryKey: ['faqs'], queryFn: cmsApi.getFAQs });
  const createFAQ = useMutation({
    mutationFn: cmsApi.createFAQ,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['faqs'] }),
  });
  const updateFAQ = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => cmsApi.updateFAQ(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['faqs'] }),
  });
  const deleteFAQ = useMutation({
    mutationFn: cmsApi.deleteFAQ,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['faqs'] }),
  });

  return {
    blogs, createBlog, updateBlog, deleteBlog,
    banners, createBanner, updateBanner, deleteBanner,
    faqs, createFAQ, updateFAQ, deleteFAQ,
  };
}
