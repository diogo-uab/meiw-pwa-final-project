<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { toast } from 'vue3-toastify';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import { useConfirm } from "primevue/useconfirm";
import type { UserDtoType } from '@pwa/shared';
import PageContainer from '../../components/page-container.vue';
import PageInnerContainer from '../../components/page-inner-container.vue';
import FetchError from '../../components/fetch-error.vue';
import LoadingSpinner from '../../components/loading-spinner.vue';
import { useAuthStore } from '../../stores/auth.store';
import { deleteUser, getAllUsers, getApiErrorMessage } from '../../api/api';

const router = useRouter();
const authStore = useAuthStore();

const queryClient = useQueryClient();
const { data, isPending, isError } = useQuery({
  queryKey: ['users'],
  queryFn: getAllUsers,
  select: (res) => res.data,
});

const handleDeleteUser = async (user: UserDtoType) => {
  try {
    await deleteUser(user._id);
    if (user._id === authStore.user?._id) {
      authStore.logout();
      router.replace({ name: 'home' });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['users'] });
  } catch (e) {
    const message =
      getApiErrorMessage(e, 'Something went wrong while deleting user. Please try again');
    toast(message, { type: 'error' });
  }
};

const handleEditUser = (user: UserDtoType) => {
  router.push({ name: 'update-user', params: { id: user._id } });
};

const confirm = useConfirm();
const confirmDelete = (user: UserDtoType) => {
  const message = user._id !== authStore.user?._id
    ? `Are you sure you want to delete user ${user.name}?`
    : `Are you sure you want to delete your account? You will be logged out after deleting.`;

  confirm.require({
    message,
    header: 'Delete user',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    accept: () => handleDeleteUser(user),
  });
};
</script>

<template>
  <PageContainer>
    <PageInnerContainer class="gap-6">
      <h1 class="text-2xl font-bold">Manage users</h1>
      <Button
        as="router-link"
        :to="{ name: 'create-user' }"
        icon="pi pi-plus"
        label="Create user"
        class="self-end">
      </Button>

      <Divider />

      <LoadingSpinner v-if="isPending" size="huge" class="self-center" />
      <FetchError v-else-if="isError" label="Oops, failed to get users data" />
      <DataTable v-else :value="data" stripedRows removableSort>
        <Column field="name" header="Name" sortable />
        <Column field="email" header="Email" sortable />
        <Column field="role" header="Role" sortable />
        <Column header="Actions">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <Button
                rounded
                icon='pi pi-pencil'
                variant="text"
                title="Edit"
                @click="handleEditUser(data)"
              ></Button>
              <Button
                rounded
                icon='pi pi-trash'
                variant="text"
                severity="danger"
                title="Delete"
                @click="confirmDelete(data)"
              ></Button>
            </div>
          </template>
        </Column>
      </DataTable>
    </PageInnerContainer>
  </PageContainer>
</template>
