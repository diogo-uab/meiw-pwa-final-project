<script setup lang="ts">
import type { BlogPostResponseDtoType } from '@pwa/shared';
import { Icon } from '@iconify/vue';
import EmptyList from '../../../components/empty-list.vue';
import { getFormattedDateFromTimestamp } from '../../../utils/date';

type BlogPostsListProps = {
  posts?: BlogPostResponseDtoType[],
};

defineProps<BlogPostsListProps>();
</script>

<template>
  <EmptyList v-if="!posts?.length" label="No blog posts found" />
  <ul v-else class="flex flex-col gap-6">
    <li v-for="blogPost in posts" :key="blogPost._id" class="flex flex-col w-full">
      <RouterLink
        :to="{ name: 'blog-post-details', params: { id: blogPost._id } }"
        class="flex flex-col rounded-md overflow-hidden shadow-md hover:shadow-lg hover:outline outline-primary transition-all"
      >
        <div class="flex w-full p-4 pt-14 text-white font-bold text-lg bg-gradient-to-r from-primary to-primary-400">
          <span>
            {{ blogPost.title }}
          </span>
        </div>
        <div class="flex flex-col w-full border-t py-2 px-4 gap-3">
          <span v-if="blogPost.description" class="text-start">{{ blogPost.description }}</span>
          <div
            v-if="typeof blogPost.author === 'object'"
            class="flex flex-row flex-wrap gap-2 justify-between py-2"
          >
            <div class="flex flex-row items-center gap-2">
              <Icon icon="mdi:user" class="text-primary" />
              <span class="text-sm font-semibold">{{ blogPost.author.name }}</span>
            </div>
            <span class="text-xs">{{ getFormattedDateFromTimestamp(blogPost.createdAt) }}</span>
          </div>
        </div>
      </RouterLink>
    </li>
  </ul>
</template>
