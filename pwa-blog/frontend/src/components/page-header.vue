<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { MenuItem } from 'primevue/menuitem';
import Menu from 'primevue/menu';
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';
import Logo from './logo.vue';
import { useAuthStore } from '../stores/auth.store';
import { useWindowScroll } from '../hooks/use-window-scroll';

const router = useRouter();
const authStore = useAuthStore();

const menu = ref();
const items = computed<MenuItem[]>(() => [
  {
    label: authStore.user?.name,
    items: [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => router.push({ name: 'profile' }),
      },
      {
        label: 'My comments',
        icon: 'pi pi-comments',
        command: () => router.push({ name: 'my-comments' }),
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
          authStore.logout();
          router.push({ name: 'home' });
        },
      },
    ],
  },
  ...(authStore.isAdmin ? [
    {
      label: 'Admin',
      items: [
        {
          label: 'Manage users',
          icon: 'pi pi-lock',
          command: () => router.push({ name: 'manage-users' }),
        },
        {
          label: 'Create post',
          icon: 'pi pi-plus',
          command: () => router.push({ name: 'blog-post-create' }),
        }
      ],
    },
  ] : []),
]);

const toggleMenu = (event: MouseEvent) => {
  menu.value.toggle(event);
};

// Hide the menu on scroll
useWindowScroll(() => {
  if (!menu.value.overlayVisible) return;
  menu.value.hide();
});
</script>

<template>
  <div class="fixed top-0 left-0 w-full bg-primary h-16 px-6 py-2 shadow-lg z-10" v-tw-merge>
    <div class="flex flex-row w-full h-full justify-between items-center">
      <RouterLink to="/">
        <Logo variant="secondary" />
      </RouterLink>
      <Button
        v-if="!authStore.isAuthenticated"
        as="router-link"
        :to="{ name: 'login' }"
        severity="secondary"
        pt:root:class="!py-1"
      >
        Login
      </Button>
      <button
        v-else
        class="rounded-full"
        @click="toggleMenu"
        aria-haspopup="true"
        aria-controls="overlay_menu"
      >
        <Avatar
          size="normal"
          shape="circle"
          icon="pi pi-user"
          pt:root:class="!bg-white"
          pt:icon:class="text-primary"
        />
      </button>
      <Menu
        ref="menu"
        id="overlay_menu"
        :model="items"
        :popup="true"
      ></Menu>
    </div>
  </div>
</template>
