import { defineStore } from 'pinia';
import { useCallApi } from '@/hooks/useCallApi';

export const useBalanceStore = defineStore('balance', {
  state: () => ({
    balance: '0.00000000',
  }),
  
  actions: {
    async getBalance() {
      const { callApi } = useCallApi();
      
      try {
        const response = await callApi('/balance', 'GET');
        if (response && response.balance.amount) {
          this.balance = parseFloat(response.balance.amount).toFixed(4);
        }
      } catch (error) {
        console.error('获取余额失败:', error);
      }
    }
  },
});
