import { computed, ref, Ref } from 'vue';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import { FrontendEnvironment } from '@backend/api-front/routes/env';

export const getSystemStore = defineStore('system', () => {
  const apiJwtToken = useLocalStorage<string>('apiJwtToken', '');

  const frontendEnvironmentQueried = ref(false);

  // Explicit typed default prevents runtime/TS issues
  const frontendEnvironment: Ref<FrontendEnvironment> = ref({
    cognitoLoginUrl: '',
  } as FrontendEnvironment);

  const cognitoLoginUrlWithRedirect = computed(() => {
    const env = frontendEnvironment.value;
    const baseUrl = env.cognitoLoginUrl || '';

    const redirect = encodeURIComponent(`${window.location.origin}/login_callback`);
    let fullUrl = `${baseUrl}&redirect_uri=${redirect}`;

    // Append state when query params exist
    const query = window.location.search.replace('?', '');
    if (query) {
      fullUrl += '&state=' + encodeURIComponent(encodeURIComponent(query));
    }

    return fullUrl;
  });

  return {
    apiJwtToken,
    frontendEnvironmentQueried,
    frontendEnvironment,
    cognitoLoginUrlWithRedirect,
  };
});
