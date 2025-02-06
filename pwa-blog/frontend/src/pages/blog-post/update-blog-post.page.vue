<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import { createZodPlugin } from '@formkit/zod';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { UpdateBlogPostDtoSchema } from '@pwa/shared';
import PageContainer from '../../components/page-container.vue';
import PageInnerContainer from '../../components/page-inner-container.vue';
import BlogPostForm from './components/blog-post-form.vue';
import FetchError from '../../components/fetch-error.vue';
import LoadingSpinner from '../../components/loading-spinner.vue';
import { getApiErrorMessage, getBlogPostById, updateBlogPost } from '../../api/api';

const route = useRoute();
const router = useRouter();
const postId = ref(String(route.params.id));

watch(
  () => route.params.id,
  () => { postId.value = String(route.params.id); },
);

const queryClient = useQueryClient();

const {
  data: blogPost,
  isError: isErrorBlogPost,
  isPending: isPendingBlogPost,
} = useQuery({
  queryKey: ['blog-post', { id: postId }],
  queryFn: () => getBlogPostById(postId.value),
  select: (res) => res.data,
});

const [zodPlugin, submitHandler] = createZodPlugin(
  UpdateBlogPostDtoSchema,
  async (data) => {
    try {
      await updateBlogPost(postId.value, data);
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog-post', { id: postId.value }] });
      router.replace({ name: 'blog-post-details', params: { id: postId.value } });
    } catch (e) {
      const message =
        getApiErrorMessage(e, 'Something went wrong while updating blog post. Please try again');
      toast(message, { type: 'error' });
    }
  },
);

const handleCancel = () =>
  router.replace({ name: 'blog-post-details', params: { id: postId.value } });
</script>

<template>
  <PageContainer>
    <PageInnerContainer>
      <h1 class="text-2xl font-bold my-4">Update blog post</h1>
      <LoadingSpinner v-if="isPendingBlogPost" size="huge" class="self-center" />
      <FetchError v-else-if="isErrorBlogPost" label="Oops, failed to get post data" />
      <BlogPostForm
        v-else-if="blogPost"
        :zodPlugin="zodPlugin"
        :submitHandler="submitHandler"
        :initialValues="blogPost"
        submitLabel="Update"
        @onCancel="handleCancel"
      />
    </PageInnerContainer>
  </PageContainer>
</template>
