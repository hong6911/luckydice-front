import axios from 'axios';
import { ref, computed } from 'vue';
// import { useLoadingStore } from '@/store/loadingStore'; 
// import { useAuthStore } from '@/store/authStore'; 

export const useCallApi = () => {
  // const loadingStore = useLoadingStore();
  // const authStore = useAuthStore();
  const error = ref(null);

  const callApi = async (url, method = 'GET', data = null, params = null, isLoading = true) => {
    // if(isLoading){

    //   loadingStore.startLoading();
    // }
    error.value = null;

    
    try {
      const headers = {
        'x-api-key': import.meta.env.VITE_API_KEY,
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtOXN3Z2ZlYjAwMDA3eTBsdDA5cjZueGMiLCJpYXQiOjE3NDUzNTE4Mjd9.zV8kJ4SpQisIfvEZuxH0h5GkZDv1iTxEsQSANFJ192s`
      };

      // if (authStore.isAuthenticated) {
      //   headers['x-user-token'] = authStore.token;
      // }

      headers['x-user-token'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtOXN3Z2ZlYjAwMDA3eTBsdDA5cjZueGMiLCJpYXQiOjE3NDUzNTE4Mjd9.zV8kJ4SpQisIfvEZuxH0h5GkZDv1iTxEsQSANFJ192s';

      const response = await axios({
        url: `${import.meta.env.VITE_API_URL}${url}`,
        method,
        data,
        params, // Pass the query parameters here
        headers,
        withCredentials: false
      });

      return response.data;
    } catch (err) {
      error.value = err.response ? err.response.data : err.message;
      throw err;
    } finally {
      // loadingStore.stopLoading();
    }
  };

  return {
    // loading: computed(() => loadingStore.isLoading),
    error,
    callApi,
  };
};
