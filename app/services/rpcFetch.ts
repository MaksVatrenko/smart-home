import fetchClient from '@/composables/apiClient.ts'
import { BASE_URL } from '@/configs/global'
import type { Post } from '@/types/post'

// ========== Posts ==========

export async function getPosts(): Promise<Post[]> {
  return await fetchClient<Post[]>({
    baseUrl: BASE_URL,
    endpoint: '/posts',
    method: 'GET'
  })
}

export async function createPost(data: Omit<Post, 'id'>): Promise<Post> {
  return await fetchClient<Post>({
    baseUrl: BASE_URL,
    endpoint: '/posts',
    method: 'POST',
    body: data
  })
}

export async function updatePost(data: Post): Promise<Post> {
  return await fetchClient<Post>({
    baseUrl: BASE_URL,
    endpoint: `/posts/${data.id}`,
    method: 'PUT',
    body: data
  })
}

export async function deletePost(id: number): Promise<void> {
  return await fetchClient({
    baseUrl: BASE_URL,
    endpoint: `/posts/${id}`,
    method: 'DELETE'
  })
}
