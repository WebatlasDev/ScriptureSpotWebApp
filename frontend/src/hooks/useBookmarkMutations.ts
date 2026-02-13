'use client';

import { useState, useCallback } from 'react';
import agent from '@/app/api/agent';
import { CreateBookmarkRequest, DeleteBookmarkRequest } from '@/types/bookmark';
import { toast } from 'react-toastify';
import { useAuth } from '@clerk/nextjs';
import { env } from '@/types/env';
import { useMutation } from '@tanstack/react-query';

/**
 * Shared helper to handle authenticated requests with Clerk token
 */
const useAuthedRequest = () => {
  const { getToken } = useAuth();

  const requestWithToken = useCallback(async <T>(
    fn: (token: string) => Promise<T>
  ): Promise<T> => {
    try {
      const token = await getToken({ template: env.clerkJwtTemplate });
      if (!token) throw new Error('Authentication token not found');
      return await fn(token);
    } catch (err) {
      throw err;
    }
  }, [getToken]);

  return requestWithToken;
};

export function useCreateBookmark() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestWithToken = useAuthedRequest();

  const createBookmark = async (data: CreateBookmarkRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await requestWithToken(token =>
        agent.User.createBookmark(token, data)
      );
      toast.success('Bookmark created successfully');
      return result;
    } catch (error: any) {
      const message = error?.message || 'Failed to create bookmark';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createBookmark,
    isLoading,
    error,
  };
}

export function useDeleteBookmark() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestWithToken = useAuthedRequest();

  const deleteBookmark = async (data: DeleteBookmarkRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await requestWithToken(token =>
        agent.User.deleteBookmark(token, data)
      );
      toast.success('Bookmark removed successfully');
      return result;
    } catch (error: any) {
      const message = error?.message || 'Failed to remove bookmark';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteBookmark,
    isLoading,
    error,
  };
}

interface CreateBookmarkInput {
  id: string;
  type: string;
  userId: string;
}

export function useCreateBookmarkNew() {
  const { getToken } = useAuth();

  return useMutation<any, Error, CreateBookmarkInput>({
    mutationFn: async ({ id, type, userId }) => {
      const token = await getToken({ template: env.clerkJwtTemplate });
      return await agent.User.createBookmark(token || '', {
        Id: id,
        Type: type,
        UserId: userId,
      });
    }
  });
}