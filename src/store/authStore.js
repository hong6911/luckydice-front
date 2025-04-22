// import { defineStore } from 'pinia';
// import { ref, computed } from 'vue';
// import { useRouter } from 'vue-router';
// export const useAuthStore = defineStore('auth', () => {
//   const router = useRouter();

//   // State
//   const user = ref(null); 
//   const token = ref(localStorage.getItem('token') || null);
//   const isAuthenticated = computed(() => !!token.value);
//   const idleTimeout = ref(null);
//   const idleInterval = ref(null);


//   // Actions
//   const login = (userData, authToken) => {
//     user.value = { ...userData, accessPageIds: userData.accessPageIds || [] };
//     token.value = authToken;
//     localStorage.setItem('token', authToken);
//     localStorage.setItem('user', JSON.stringify(userData));
//   };

//   const updateUser = (userData, authToken) => {
//     user.value = { ...userData, accessPageIds: userData.accessPageIds || [] };
//     token.value = authToken;
//     localStorage.setItem('token', authToken);
//     localStorage.setItem('user', JSON.stringify(userData));
//   };

//   const logout = () => {
//     user.value = null;
//     token.value = null;
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');

//     if (typeof router !== 'undefined' && router.push) {
//         router.push('/login');
//     } else {
//         window.location.href = '/login';
//     }
// };


//   const restoreSession = () => {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       user.value = JSON.parse(storedUser);
//     }
//   };




// // Helper function to get user data from localStorage if user.value is not defined
// const getUserData = () => {
//   return user.value || JSON.parse(localStorage.getItem('user'));
// };



//   return {
//     user,
//     token,
//     isAuthenticated,
//     login,
//     logout,
//     restoreSession,
//     updateUser,
//   };
// });
