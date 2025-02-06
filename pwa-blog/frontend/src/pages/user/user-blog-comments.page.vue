<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import Divider from 'primevue/divider';
import PageContainer from '../../components/page-container.vue';
import PageInnerContainer from '../../components/page-inner-container.vue';
import EmptyList from '../../components/empty-list.vue';
import FetchError from '../../components/fetch-error.vue';
import LoadingSpinner from '../../components/loading-spinner.vue';
import BlogCommentItem from '../blog-post/components/blog-comment-item.vue';
import { useAuthStore } from '../../stores/auth.store';
import { getBlogCommentsByUserId } from '../../api/api';

const authStore = useAuthStore();

const { data: comments, isPending, error } = useQuery({
  queryKey: ['blog-comments-user', { id: authStore.user?._id }],
  queryFn: () => getBlogCommentsByUserId(authStore.user!._id),
  select: (res) => res.data,
});
</script>

<template>
  <PageContainer>
    <PageInnerContainer>
      <h1 class="font-bold text-2xl">Your comments</h1>
      <Divider />
      <LoadingSpinner v-if="isPending" size="huge" class="self-center" />
      <FetchError v-else-if="error" label="Oops, failed to get comments" />
      <EmptyList v-else-if="comments && !comments.length" label="No comments yet" />
      <div v-else-if="comments" class="flex flex-col gap-4">
        <BlogCommentItem
          v-for="comment in comments"
          :key="comment._id"
          :comment="comment"
          :canManageComment="true"
          :displayCommentPost="true"
        />
      </div>
    </PageInnerContainer>
  </PageContainer>
</template>
