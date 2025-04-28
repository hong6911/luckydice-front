<template>
  <header class="app-header">
    <div class="header-inner">
      <div class="logo-area">
        <!-- SVG Logo 开始 -->
        <span class="logo-svg">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect x="3" y="3" width="30" height="30" rx="8" fill="#5A67D8" stroke="#fff" stroke-width="2"/>
            <!-- 骰子点 -->
            <circle cx="11" cy="11" r="2" fill="#fff"/>
            <circle cx="25" cy="11" r="2" fill="#fff"/>
            <circle cx="11" cy="25" r="2" fill="#fff"/>
            <circle cx="25" cy="25" r="2" fill="#fff"/>
            <circle cx="18" cy="18" r="2.5" fill="#FFD700" stroke="#fff" stroke-width="1"/>
            <!-- 幸运星 -->
            <polygon points="18,8 19.2,12 23.5,12 20,14.5 21.2,18.5 18,16 14.8,18.5 16,14.5 12.5,12 16.8,12" fill="#FFD700" stroke="#fff" stroke-width="0.5"/>
          </svg>
        </span>
        <span class="logo-text">LuckyDice</span>
      </div>
      <div class="balance-area">
        <span class="balance-label">Balance:</span>
        <span class="balance-amount">${{ balanceStore.balance }}</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { onMounted } from 'vue'
import { useBalanceStore } from '@/store/balanceStore'

const balanceStore = useBalanceStore()

onMounted(() => {
  balanceStore.getBalance()
})
</script>

<style scoped>
.app-header {
  width: 100%;
  background: #fff;
  box-shadow: 0 2px 8px rgba(90,103,216,0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.5rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logo-area {
  display: flex;
  align-items: center;
}
.logo-svg {
  display: flex;
  align-items: center;
  margin-right: 10px;
}
.logo-text {
  font-size: 1.25rem;
  font-weight: bold;
  color: #5A67D8;
  letter-spacing: 1px;
}
.balance-area {
  display: flex;
  align-items: center;
  font-size: 1rem;
}
.balance-label {
  color: #6c757d;
  margin-right: 8px;
}
.balance-amount {
  color: #5A67D8;
  font-weight: 600;
  font-size: 1.1rem;
}
@media (max-width: 768px) {
  .header-inner {
    padding: 0.5rem 0.75rem;
  }
  .logo-text {
    font-size: 1rem;
  }
  .balance-area {
    font-size: 0.95rem;
  }
  .logo-svg svg {
    width: 28px;
    height: 28px;
  }
}
</style>