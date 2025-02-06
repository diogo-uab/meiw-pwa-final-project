<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import Button from 'primevue/button';
import BlogPostsList from './blog-post/components/blog-posts-list.vue';
import PageContainer from '../components/page-container.vue';
import PageInnerContainer from '../components/page-inner-container.vue';
import FetchError from '../components/fetch-error.vue';
import LoadingSpinner from '../components/loading-spinner.vue';
import { getBlogPosts } from '../api/api';

const route = useRoute();
const router = useRouter();

const search = ref(typeof route.query.search === 'string' ? route.query.search : undefined);
const searchInputRef = ref<HTMLInputElement | null>(null);
const onSearchSubmit = () => {
  search.value = searchInputRef?.value?.value || undefined;
  router.push({ query: search.value ? { search: search.value } : {} });
};

const { data, isPending, isError } = useQuery({
  queryKey: ['blog-posts', { search }],
  queryFn: () => getBlogPosts(search.value),
  select: (res) => res.data,
});
</script>

<template>
  <PageContainer>
    <PageInnerContainer>
      <form class="flex flex-row flex-wrap py-2 gap-2 md:gap-4 items-end mb-10" @submit.prevent="onSearchSubmit">
        <div class="flex flex-col flex-1 gap-2">
          <label for="search" class="text-2xl font-bold">Search posts</label>
          <input
            id="search"
            name="search"
            placeholder="Search"
            ref="searchInputRef"
            :value="search"
            class="flex flex-1 p-3 border rounded-md focus:outline-primary"
          />
        </div>
        <Button type="submit" icon="pi pi-search" rounded></Button>
      </form>
      <LoadingSpinner v-if="isPending" size="huge" class="self-center" />
      <FetchError v-else-if="isError" label="Oops, failed to get posts" />
      <BlogPostsList v-else :posts="data" />
    </PageInnerContainer>
  </PageContainer>
</template>
