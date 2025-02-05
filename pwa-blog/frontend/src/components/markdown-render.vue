<script setup lang="ts">
import { shallowRef, computed } from 'vue';
import MarkdownIt, { type Options } from 'markdown-it';
import { markdownItStylePlugin } from '../utils/markdown-styles';

type MarkdownRenderProps = {
  source: string,
  options?: Options,
};

const { source, options = {} } = defineProps<MarkdownRenderProps>();

const plugins = [markdownItStylePlugin];

const md = shallowRef(new MarkdownIt(options));

for (const plugin of plugins)
  md.value.use(plugin);

const content = computed(() => md.value.render(source));
</script>

<template>
  <div
    v-html="content"
    v-tw-merge
    class="[&_pre]:my-5 [&_pre]:p-2 [&_pre]:bg-slate-100 [&_pre]:rounded-md first:*:mt-0 last:*:mb-0"
  ></div>
</template>

