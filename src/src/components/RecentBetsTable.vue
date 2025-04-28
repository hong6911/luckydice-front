<template>
  <div class="recent-bets-container mt-4 w-100">
    <div class="bet-tabs">
      <div
        class="bet-tab"
        :class="{ active: activeTab === 'all' }"
        @click="handleTab('all')"
      >All Bets</div>
      <div
        class="bet-tab"
        :class="{ active: activeTab === 'my' }"
        @click="handleTab('my')"
      >My Bets</div>
      <div
        class="bet-tab"
        :class="{ active: activeTab === 'high' }"
        @click="handleTab('high')"
      >High Rollers</div>
      <!-- <div class="bet-tab">Races</div> -->
      <!-- <div class="bet-count">10 <i class="fas fa-chevron-down"></i></div> -->
    </div>
    <div class="table-responsive" v-if="activeTab === 'all'">
      <table class="table">
        <thead>
          <tr>
            <th class="bet-id-col" style="text-align: center;">Bet ID</th>
            <th class="user-col" style="text-align: center;">User</th>
            <th class="time-col" style="text-align: center;">Time</th>
            <th class="bet-col" style="text-align: center;">Bet</th>
            <th class="multiplier-col" style="text-align: center;">Multiplier</th>
            <th class="result-col" style="text-align: center;">Result</th>
            <th class="payout-col" style="text-align: center;">Payout</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bet in recentBets" :key="bet.betId">
            <td class="bet-id">{{ bet.betId }}</td>
            <td>
              <span
                class="user-icon"
                :style="{ visibility: bet.user === 'Hidden' ? 'visible' : 'hidden' }"
              >
                <i class="fas fa-user-secret"></i>
              </span>
              {{ bet.user }}
            </td>
            <td>{{ bet.time }}</td>
            <td>
              <span class="bet-amount">{{ bet.bet }}</span>
            </td>
            <td>{{ bet.multiplier }}</td>
            <td>{{ bet.result }}</td>
            <td :class="bet.isWin ? 'payout-win' : 'payout-loss'">
              <span>{{ bet.payout }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- My Bets Table -->
    <div class="table-responsive" v-if="activeTab === 'my'">
      <table class="table">
        <thead>
          <tr>
            <th style="text-align: center;">Bet</th>
            <th style="text-align: center;">Multiplier</th>
            <th style="text-align: center;">Status</th>
            <th style="text-align: center;">Payout</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(bet, idx) in myBets" :key="idx">
            <td>{{ bet.betAmount }}</td>
            <td>{{ bet.multiplier }}</td>
            <td>
              <span :class="bet.status ? 'payout-win' : 'payout-loss'">
                {{ bet.status ? 'Win' : 'Lose' }}
              </span>
            </td>
            <td>{{ bet.payout }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- High Rollers Table -->
    <div class="table-responsive" v-if="activeTab === 'high'">
      <table class="table">
        <thead>
          <tr>
            <th class="bet-id-col" style="text-align: center;">Bet ID</th>
            <th class="user-col" style="text-align: center;">User</th>
            <th class="time-col" style="text-align: center;">Time</th>
            <th class="bet-col" style="text-align: center;">Bet</th>
            <th class="multiplier-col" style="text-align: center;">Multiplier</th>
            <th class="result-col" style="text-align: center;">Result</th>
            <th class="payout-col" style="text-align: center;">Payout</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bet in highRollersBets" :key="bet.betId">
            <td class="bet-id">{{ bet.betId }}</td>
            <td>
              <span
                class="user-icon"
                :style="{ visibility: bet.user === 'Hidden' ? 'visible' : 'hidden' }"
              >
                <i class="fas fa-user-secret"></i>
              </span>
              {{ bet.user }}
            </td>
            <td>{{ bet.time }}</td>
            <td>
              <span class="bet-amount">{{ bet.bet }}</span>
            </td>
            <td>{{ bet.multiplier }}</td>
            <td>{{ bet.result }}</td>
            <td :class="bet.isWin ? 'payout-win' : 'payout-loss'">
              <span>{{ bet.payout }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useCallApi } from '@/hooks/useCallApi'

const { callApi } = useCallApi()
const recentBets = ref([])
const allBetsCache = ref([])
let betIndex = 0
let betTimeout = null

const activeTab = ref('all')
const myBets = ref([])
// 新增 High Rollers 数据
const highRollersBets = ref([])

const fetchAllBets = async () => {
  try {
    const data = await callApi('/bet-records', 'GET')
    if (Array.isArray(data)) {
      allBetsCache.value = data
      betIndex = 0
      recentBets.value = []
      for (let i = 0; i < 10 && betIndex < allBetsCache.value.length; i++, betIndex++) {
        recentBets.value.unshift(allBetsCache.value[betIndex])
      }
      pushNextBet() // 然后进入循环推送
    }
  } catch (e) {
    allBetsCache.value = []
    recentBets.value = []
  }
}

// 修改：High Rollers 只取前10条
const fetchHighRollersBets = async () => {
  try {
    const data = await callApi('/bet-records', 'GET')
    if (Array.isArray(data)) {
      highRollersBets.value = data.slice(0, 10)
    }
  } catch (e) {
    highRollersBets.value = []
  }
}

const fetchMyBets = async () => {
  try {
    const data = await callApi('/history', 'GET')
    if (Array.isArray(data)) {
      myBets.value = data
    }
  } catch (e) {
    myBets.value = []
  }
}

const pushNextBet = () => {
  if (allBetsCache.value.length === 0) return
  if (betIndex >= allBetsCache.value.length) {
    fetchAllBets()
    return
  }
  recentBets.value.unshift(allBetsCache.value[betIndex])
  if (recentBets.value.length > 10) {
    recentBets.value.pop()
  }
  betIndex++
  betTimeout = setTimeout(() => {
    pushNextBet()
  }, Math.random() * 500 + 500)
}

onMounted(async () => {
  await fetchAllBets()
  await fetchMyBets()
})

onUnmounted(() => {
  if (betTimeout) clearTimeout(betTimeout)
})

// Tab 切换处理
function handleTab(tab) {
  activeTab.value = tab
  if (tab === 'my') {
    fetchMyBets()
  }
  if (tab === 'high') {
    fetchHighRollersBets()
  }
}
</script>

<style scoped>
/* Recent bets table styles */
.recent-bets-container {
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow: hidden;
  width: 100%;
}

.table-responsive {
  overflow-x: auto;
  width: 100%;
}

.table {
  margin-bottom: 0;
  width: 100%;
  table-layout: fixed; /* Fixed table layout for consistent column widths */
  border-collapse: collapse;
}

/* Column width standardization */
.bet-id-col { width: 18%; }
.user-col { width: 15%; }
.time-col { width: 10%; }
.bet-col { width: 15%; }
.multiplier-col { width: 10%; }
.result-col { width: 10%; }
.payout-col { width: 15%; text-align: right; }

.table th {
  font-weight: 500;
  color: #6c757d;
  padding: 12px 16px;
  font-size: 13px;
  border-bottom: 1px solid #e9ecef;
  background-color: #f8f9fa;
  white-space: nowrap;
}

.table td {
  padding: 12px 16px;
  font-size: 13px;
  border-bottom: 1px solid #e9ecef;
  color: #495057;
  white-space: nowrap;
  min-height: 24px;
}

/* Ensure the bet tabs are properly styled */
.bet-tabs {
  display: flex;
  border-bottom: 1px solid #e9ecef;
  background-color: #f8f9fa;
  width: 100%;
}

.bet-tab {
  padding: 12px 16px;
  font-size: 14px;
  cursor: pointer;
  color: #6c757d;
  position: relative;
  white-space: nowrap;
}

.bet-tab.active {
  color: #5A67D8;
  font-weight: 500;
}

.bet-tab.active:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #5A67D8;
}

.bet-count {
  margin-left: auto;
  padding: 12px 16px;
  font-size: 14px;
  color: #6c757d;
  display: flex;
  align-items: center;
  gap: 5px;
}

.bet-id {
  color: #6c757d;
  font-size: 12px;
}

.user-icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  background-color: #e9ecef;
  border-radius: 50%;
  text-align: center;
  line-height: 24px;
  margin-right: 8px;
  color: #6c757d;
}

.bet-amount {
  margin-right: 4px;
}

.crypto-icon {
  font-size: 12px;
  color: #f7931a;
  margin-left: 4px; 
}

.payout-win {
  color: #48BB78;
  font-weight: 500;
}

.payout-loss {
  color: #F56565;
  font-weight: 500;
}

tr:hover {
  background-color: #f8f9fa;
}

.table th {
  font-weight: 600;
  color: #5A67D8;
  border-top: none;
  border-bottom: 2px solid #E9ECF8;
}

.table td {
  vertical-align: middle;
  border-color: #E9ECF8;
}

.win-row {
  background-color: rgba(72, 187, 120, 0.1);
}

.lose-row {
  background-color: rgba(245, 101, 101, 0.1);
}

@media (max-width: 768px) {
  .recent-bets-container {
    padding: 0.5rem;
  }
  
  .table {
    font-size: 0.75rem;
  }
}
</style>