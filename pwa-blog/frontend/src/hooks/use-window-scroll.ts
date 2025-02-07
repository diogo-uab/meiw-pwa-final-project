import { onBeforeMount, onBeforeUnmount } from 'vue';

export const useWindowScroll = (listenner: EventListenerOrEventListenerObject) => {
  onBeforeMount(() => {
    window.addEventListener('scroll', listenner);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', listenner);
  });
};
