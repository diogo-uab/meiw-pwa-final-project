<script setup lang="ts">
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import { createZodPlugin } from '@formkit/zod';
import { useQueryClient } from '@tanstack/vue-query';
import { CreateBlogPostDtoSchema } from '@pwa/shared';
import PageContainer from '../../components/page-container.vue';
import PageInnerContainer from '../../components/page-inner-container.vue';
import BlogPostForm from './components/blog-post-form.vue';
import { useAuthStore } from '../../stores/auth.store';
import { createBlogPost, getApiErrorMessage } from '../../api/api';

const INITIAL_BODY_VALUE = `## Welcome to Markdown!

This is a **bold** statement and this is an *italic* one.

## Lists
- Item 1
- Item 2
    - Subitem 1
    - Subitem 2

## Links & Images
[Google](https://google.com)

![Github](https://github.com/favicon.ico)
![Example image](https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg)

## Code
Here's an inline \`code\` example. And below a code block:

\`\`\`
function helloWorld() {
  console.log('Hello, world!');
}
\`\`\`

## Blockquote

> Markdown is a lightweight markup language.

### Horizontal Rule
---

## Table

| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
`;

const router = useRouter();
const authStore = useAuthStore();
const queryClient = useQueryClient();

const [zodPlugin, submitHandler] = createZodPlugin(
  CreateBlogPostDtoSchema.omit({ author: true }),
  async (data) => {
    try {
      const { data: createdPost } = await createBlogPost({
        ...data,
        author: authStore.user!,
      });
      router.replace({ name: 'blog-post-details', params: { id: createdPost._id } });
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    } catch (e) {
      const message =
        getApiErrorMessage(e, 'Something went wrong while creating blog post. Please try again');
      toast(message, { type: 'error' });
    }
  },
);

const handleCancel = () => router.replace({ name: 'home' });
</script>

<template>
  <PageContainer>
    <PageInnerContainer>
      <h1 class="text-2xl font-bold my-4">Create blog post</h1>
      <BlogPostForm
        :zodPlugin="zodPlugin"
        :submitHandler="submitHandler"
        :initialValues="{ body: INITIAL_BODY_VALUE }"
        @onCancel="handleCancel"
      />
    </PageInnerContainer>
  </PageContainer>
</template>
