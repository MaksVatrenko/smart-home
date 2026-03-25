import { defineStore } from 'pinia'
import {
  getPosts,
  createPost,
  updatePost,
  deletePost
} from '@/services/rpcFetch'
import type { Post, CreatePostDto } from '@/types/post'

export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: [] as Post[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    setError(error: string | null) {
      this.error = error
    },

    async fetchPosts() {
      this.loading = true
      this.error = null
      try {
        const data = await getPosts()
        this.posts = data.slice(0, 3)
      } catch (err) {
        this.error = (err as Error).message
      } finally {
        this.loading = false
      }
    },

    async addPost(postData: CreatePostDto) {
      this.loading = true
      this.error = null

      try {
        const newPost = await createPost(postData)
        this.posts.push(newPost)
      } catch (error: any) {
        this.setError(error.message || 'Failed to create post')
      } finally {
        this.loading = false
      }
    },

    async updatePost(updatedPost: Post) {
      this.loading = true
      this.error = null

      try {
        const post = await updatePost(updatedPost)
        const index = this.posts.findIndex((p) => p.id === post.id)
        if (index !== -1) {
          this.posts[index] = post
        }
      } catch (error: any) {
        this.setError(error.message || 'Failed to update post')
      } finally {
        this.loading = false
      }
    },

    async deletePost(deletedId: number | string) {
      this.loading = true
      this.error = null

      try {
        await deletePost(Number(deletedId))
        this.posts = this.posts.filter((p) => p.id !== deletedId)
      } catch (error: any) {
        this.setError(error.message || 'Failed to delete post')
      } finally {
        this.loading = false
      }
    }
  }
})
