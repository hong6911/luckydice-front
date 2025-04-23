<template>
  <div class="game-container">
    <div class="balance-header mb-3">
      <div class="balance-card">
        <div class="balance-label">Balance</div>
        <div class="balance-amount">
          <span v-if="isLoadingBalance"><i class="fas fa-spinner fa-spin"></i></span>
          <span v-else>{{ userBalance }}</span>
          <i class="fas fa-bitcoin-sign crypto-icon ms-1"></i>
        </div>
        <button class="refresh-balance-btn" @click="fetchUserBalance">
          <i class="fas fa-sync-alt"></i>
        </button>
      </div>
    </div>
    <div class="card">
      <div class="tabs">
        <div class="tab" v-for="tab in tabs" :class="{ active: activeTab === tab.value }" @click="activeTab = tab.value">
            {{ tab.label }}
        </div>
      </div>
      
      <div class="p-4 pt-2">
        <div class="dice-form">
          <div class="row mb-3">
            <div class="col-md-6 col-12 mb-3">
              <label class="text-start d-block">Bet Amount</label>
              <div class="position-relative">
                <div class="input-group">
                  <input type="text" class="form-control" v-model="formData.betAmount" placeholder="0.00000000">
                  <button class="btn btn-outline-secondary has-hover-effect" @click="halfBetAmount">½</button>
                  <button class="btn btn-outline-secondary has-hover-effect" @click="doubleBetAmount">2×</button>
                </div>
                <span class="amount position-absolute">{{ `$${formData.betAmount}` }}</span>
              </div>
            </div>
            
            <div v-if="activeTab === 1" class="col-md-6 col-6 mb-3">
              <label class="text-start d-block">Profit on Win</label>
              <div class="position-relative">
                <div class="input-group">
                  <input type="text" class="form-control" v-model="formData.profitOnWin" placeholder="0.00000000" readonly>
                  <button class="btn btn-outline-secondary"><i class="fas fa-bitcoin-sign"></i></button>
                </div>
                <span class="amount position-absolute">{{ `$${formData.profitOnWin}` }}</span>
              </div>
            </div>
            
            <div v-if="activeTab === 2" class="col-md-6 col-6 mb-3">
              <label class="text-start d-block">Number of Bets</label>
              <div class="input-group">
                <input type="text" class="form-control" v-model="formData.numberOfBets" placeholder="0">
                <button class="btn btn-outline-secondary"><i class="fas fa-infinity"></i></button>
              </div>
            </div>
            
            <div class="col-md-4 col-6 mb-3">
              <label class="text-start d-block">{{ isRollOver ? 'Roll Over' : 'Roll Under' }}</label>
              <div class="input-group">
                <input
                  type="text"
                  class="form-control"
                  :value="isRollOver ? formData.rollOver : formData.winChance"
                  readonly
                >
                <button
                  class="btn btn-outline-secondary refresh-btn has-hover-effect"
                  :class="{ rotating: isRefreshing }"
                  @click="toggleRollType"
                >
                  <i class="fas fa-refresh"></i>
                </button>
              </div>
            </div>
            
            <div class="col-md-4 col-6 mb-3">
              <label class="text-start d-block">Multiplier</label>
              <div class="input-group">
                <input type="text" class="form-control" v-model="formData.multiplier" placeholder="1.2692" readonly>
                <button class="btn btn-outline-secondary no-hover-effect"><i class="fas fa-times"></i></button>
              </div>
            </div>
            
            <div class="col-md-4 col-6 mb-3">
              <label class="text-start d-block">Win Chance</label>
              <div class="input-group">
                <input type="number" class="form-control" v-model="formData.winChance" min="2" max="98" step="1" readonly />
                <button class="btn btn-outline-secondary no-hover-effect"><i class="fas fa-percent"></i></button>
              </div>
            </div>
            
            <template v-if="activeTab === 2">
              <div class="col-md-6 col-12 mb-3">
                <label class="text-start d-block">On Win</label>
                <div class="input-group">
                  <button class="btn btn-outline-secondary">Reset</button>
                  <button class="btn btn-outline-secondary">Increase by:</button>
                  <input type="text" class="form-control" v-model="formData.increaseOnWin" placeholder="0">
                  <span class="input-group-text">%</span>
                </div>
              </div>
              
              <div class="col-md-6 col-12 mb-3">
                <label class="text-start d-block">On Loss</label>
                <div class="input-group">
                  <button class="btn btn-outline-secondary">Reset</button>
                  <button class="btn btn-outline-secondary">Increase by:</button>
                  <input type="text" class="form-control" v-model="formData.increaseOnLoss" placeholder="0">
                  <span class="input-group-text">%</span>
                </div>
              </div>
              
              <div class="col-md-6 col-12 mb-3">
                <label class="text-start d-block">Stop on Profit</label>
                <div class="position-relative">
                  <div class="input-group">
                    <input type="text" class="form-control" v-model="formData.stopOnProfit" placeholder="0.00000000">
                  </div>
                  <span class="amount position-absolute">{{ `$${formData.stopOnProfit}` }}</span>
                </div>
              </div>
              
              <div class="col-md-6 col-12 mb-3">
                <label class="text-start d-block">Stop on Loss</label>
                <div class="position-relative">
                  <div class="input-group">
                    <input type="text" class="form-control" v-model="formData.stopOnLoss" placeholder="0.00000000">
                  </div>
                  <span class="amount position-absolute">{{ `$${formData.stopOnLoss}` }}</span>
                </div>
              </div>
            </template>
          </div>
          
          <button v-if="activeTab === 1" class="btn btn-warning btn-lg submit-btn" @click="onSubmit">ROLL DICE</button>
          <button v-else class="btn btn-warning btn-lg submit-btn" @click="onSubmit">Start Autobet</button>
        </div>
      </div>
    </div>

    <div class="slider-container mt-4 w-100">
      <span class="slider-variable">0</span>
      <input type="range" v-model="formData.roll" class="form-range" min="2" max="98" step="1" id="customRange" />
      <span class="slider-variable">100</span>
    </div>
    

  </div>

      <!-- Recent Bets Table -->
      <div class="recent-bets-container mt-4 w-100">
      <div class="bet-tabs">
        <div class="bet-tab active">All Bets</div>
        <div class="bet-tab">My Bets</div>
        <div class="bet-tab">High Rollers</div>
        <div class="bet-tab">Races</div>
        <div class="bet-count">10 <i class="fas fa-chevron-down"></i></div>
      </div>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th class="bet-id-col" style="  text-align: center;">Bet ID</th>
              <th class="user-col" style="  text-align: center;">User</th>
              <th class="time-col" style="  text-align: center;">Time</th>
              <th class="bet-col" style="  text-align: center;">Bet</th>
              <th class="multiplier-col" style="  text-align: center;">Multiplier</th>
              <th class="result-col" style="  text-align: center;">Result</th>
              <th class="payout-col" style="  text-align: center;">Payout</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="bet in recentBets" :key="bet.id">
              <td class="bet-id">{{ Math.floor(Math.random() * 900000000) + 100000000 }}.{{ Math.floor(Math.random() * 900000) + 100000 }}</td>
              <td>
                <span class="user-icon"><i class="fas fa-user-secret"></i></span>
                {{ Math.random() > 0.5 ? bet.user : 'Hidden' }}
              </td>
              <td>{{ new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</td>
              <td>
                <span class="bet-amount">{{ bet.betAmount }}</span>
                <i class="fas fa-bitcoin-sign crypto-icon"></i>
              </td>
              <td>{{ bet.multiplier }}x</td>
              <td>{{ bet.roll }}</td>
              <td :class="bet.isWin ? 'payout-win' : 'payout-loss'">
                <span>{{ bet.isWin ? bet.payout : '-' + bet.payout }}</span>
                <i class="fas fa-bitcoin-sign crypto-icon"></i>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useCallApi } from '@/hooks/useCallApi'

const toast = useToast()
const { callApi } = useCallApi()

// User balance state
const userBalance = ref('0.00000000')
const isLoadingBalance = ref(false)

// Function to fetch user balance
const fetchUserBalance = async () => {
  isLoadingBalance.value = true
  try {
    const response = await callApi('/wallet/balance', 'GET')
    if (response && response.balance.amount) {
      userBalance.value = parseFloat(response.balance.amount).toFixed(8)
    }
  } catch (error) {
    console.error('Error fetching balance:', error)
    toast.error('Failed to load balance')
  } finally {
    isLoadingBalance.value = false
  }
}

// Fetch balance on component mount
onMounted(() => {
  fetchUserBalance()
  
  // Initialize with a few bets
  for (let i = 0; i < 10; i++) {
    addNewBet()
  }
  
  // Add a new bet every 1-3 seconds
  betInterval = setInterval(() => {
    addNewBet()
  }, Math.random() * 2000 + 1000)
})


// 添加缺少的变量
const isRollOver = ref(true)
const isRefreshing = ref(false)

// Recent bets data
const recentBets = ref([])
let betInterval = null

// Generate random username
const generateUsername = () => {
  const prefixes = ['lucky', 'crypto', 'dice', 'bet', 'win', 'player', 'gambler', 'high', 'low']
  const suffixes = ['king', 'queen', 'master', '123', 'pro', 'winner', 'star', 'ace', 'x', 'y', 'z']
  const randomNumbers = Math.floor(Math.random() * 1000).toString()
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
  
  return `${prefix}${suffix}${randomNumbers}`
}

// Generate a random bet
const generateRandomBet = () => {
  const isWin = Math.random() > 0.5
  const rollType = Math.random() > 0.5 ? 'over' : 'under'
  const target = rollType === 'over' 
    ? Math.floor(Math.random() * 96) + 2 
    : Math.floor(Math.random() * 96) + 2
  const roll = Math.floor(Math.random() * 100)
  
  // Generate realistic bet amounts (mostly small with occasional large bets)
  let betAmount
  const betType = Math.random()
  if (betType > 0.98) { // High rollers (2%)
    betAmount = (Math.random() * 0.5 + 0.1).toFixed(8)
  } else if (betType > 0.8) { // Medium bets (18%)
    betAmount = (Math.random() * 0.05 + 0.01).toFixed(8)
  } else { // Small bets (80%)
    betAmount = (Math.random() * 0.01 + 0.0001).toFixed(8)
  }
  
  const multiplier = (Math.random() * 2 + 1).toFixed(2)
  const payout = (parseFloat(betAmount) * parseFloat(multiplier)).toFixed(8)
  
  return {
    id: Date.now() + Math.random(),
    user: generateUsername(),
    betAmount,
    multiplier,
    roll,
    target,
    rollType,
    payout,
    isWin,
    time: new Date()
  }
}

// Add a new bet to the table
const addNewBet = () => {
  const newBet = generateRandomBet()
  recentBets.value.unshift(newBet)
  
  // Keep only the last 10 bets
  if (recentBets.value.length > 10) {
    recentBets.value.pop()
  }
}

// Start generating fake bets
onMounted(() => {
  // Initialize with a few bets
  for (let i = 0; i < 10; i++) {
    addNewBet()
  }
  
  // Add a new bet every 1-3 seconds
  betInterval = setInterval(() => {
    addNewBet()
  }, Math.random() * 2000 + 1000)
})

// Clean up interval when component is unmounted
onUnmounted(() => {
  if (betInterval) {
    clearInterval(betInterval)
  }
})

// 添加切换 Roll 类型的方法
const toggleRollType = async () => {
  isRefreshing.value = true
  isRollOver.value = !isRollOver.value
  
  // 动画效果持续时间
  setTimeout(() => {
    isRefreshing.value = false
  }, 400)
}

function notifyWin(value) {
  toast.success(`+${value}`, {
    position: "top-center",
    timeout: 1000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: false,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: false,
    icon: false,
    rtl: false,
    toastClassName: 'custom-small-toast'
  })
}

function notifyLose(value) {
  toast.error(`-${value}`, {
    position: "top-center",
    timeout: 1000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: false,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: false,
    icon: false,
    rtl: false,
    toastClassName: 'custom-small-toast'
  })
}

const tabs = ref([
  { label: 'Manual', value: 1 },
  { label: 'Auto', value: 2 },
])

const activeTab = ref(1)

const formData = reactive({
  roll: 2,
  betAmount: '0.00000000',
  profitOnWin: '0.00000000',
  rollOver: '21.99',
  multiplier: '1.2692',
  winChance: '78.0000',
  numberOfBets: '0',
  increaseOnWin: '0',
  increaseOnLoss: '0',
  stopOnProfit: '0.00000000',
  stopOnLoss: '0.00000000'
})

const onSubmit = async () => {
  try {
    const data = {
      betAmount: parseFloat(formData.betAmount),
      targetValue: formData.roll
    };

    const response = await callApi('/game/dice', 'POST', data);

    if(response) {
      // Show roll result information
      toast.info(`Roll: ${response.roll} | Target: ${response.targetValue} | Type: ${response.rollType.toUpperCase()}`, {
        position: "top-center",
        timeout: 2000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: false,
        showCloseButtonOnHover: false,
        hideProgressBar: false,
        closeButton: false,
        icon: true,
        rtl: false
      });
      


      fetchUserBalance()
    }
  } catch (e) {
    console.error(e);
  }
}

// 添加 watch 监听 roll 的变化
// 移除之前在 roll watch 中的 profitOnWin 计算
watch(() => formData.roll, (newValue) => {
  const diceAmount = parseFloat(newValue) || 0
  const winChance = 100 - diceAmount
  
  formData.rollOver = (diceAmount - 0.01).toFixed(2)
  formData.winChance = winChance.toFixed(4)
  formData.multiplier = (99 / winChance).toFixed(4)
})

// 添加新的 watch 来计算 profitOnWin
watch(
  [() => formData.betAmount, () => formData.multiplier],
  ([newBetAmount, newMultiplier]) => {
    const betAmount = parseFloat(newBetAmount) || 0
    const multiplier = parseFloat(newMultiplier) || 0
    formData.profitOnWin = (betAmount * multiplier).toFixed(8)
  }
)
const halfBetAmount = () => {
  const currentAmount = parseFloat(formData.betAmount) || 0
  formData.betAmount = (currentAmount / 2).toFixed(8)
}

const doubleBetAmount = () => {
  const currentAmount = parseFloat(formData.betAmount) || 0
  formData.betAmount = (currentAmount * 2).toFixed(8)
}
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
  padding: 1rem;
  width: 100%;
  max-width: 800px;
}

.card {
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 32px 0 rgba(90,103,216,0.10), 0 1.5px 8px 0 rgba(127,156,245,0.08);
  overflow: hidden;
}

.tabs {
  display: flex;
  justify-content: space-between;
  background: linear-gradient(90deg, #5A67D8 0%, #7F9CF5 100%);
  overflow: hidden;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 0.75rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  color: #fff;
  background: transparent;
}

.tab.active {
  background: #fff;
  color: #5A67D8;
  font-weight: bold;
}

.btn-link {
  color: #5A67D8;
  text-decoration: none;
}

.btn-link.active {
  font-weight: bold;
  color: #434190;
}

.input-group-text {
  background-color: #E9ECF8;
}

.btn-warning {
  background: linear-gradient(90deg, #5A67D8 0%, #7F9CF5 100%);
  border: none;
  color: #fff;
}

.btn-warning:hover {
  background: linear-gradient(90deg, #434190 0%, #5A67D8 100%);
  color: #fff;
}

.amount {
  color: #5A67D8;
}

.slider-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 12px;
  background: #fff; /* 修改为更明显的浅灰色背景 */
  border-radius: 20px;
  padding: 10px 16px;
  box-sizing: border-box;
}

.slider-variable {
  width: 40px;
  min-width: 32px;
  text-align: center;
  color: #5A67D8;
  font-size: 16px;
  font-weight: 500;
  user-select: none;
}

.form-range {
  flex: 1;
  margin: 0 8px;
  min-width: 0;
  accent-color: #5A67D8;
  height: 8px;
}

.form-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  margin-top: -8px;
  width: 24px;
  height: 24px;
  background: url('data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="8" fill="%235A67D8"/><circle cx="16" cy="16" r="4" fill="white"/></svg>');
  background-size: 24px 24px;
  background-position: center;
  background-repeat: no-repeat;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(90,103,216,0.18);
  transition: box-shadow 0.2s;
}

.form-range::-moz-range-thumb {
  width: 24px;
  height: 24px;
  background: url('data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="8" fill="%235A67D8"/><circle cx="16" cy="16" r="4" fill="white"/></svg>');
  background-size: 24px 24px;
  background-position: center;
  background-repeat: no-repeat;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(90,103,216,0.18);
  transition: box-shadow 0.2s;
}
.form-range:focus::-moz-range-thumb {
  box-shadow: 0 0 0 4px rgba(127,156,245,0.18);
}

.form-range::-ms-thumb {
  width: 24px;
  height: 24px;
  background: url('data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="8" fill="%235A67D8"/><circle cx="16" cy="16" r="4" fill="white"/></svg>');
  background-size: 24px 24px;
  background-position: center;
  background-repeat: no-repeat;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(90,103,216,0.18);
  transition: box-shadow 0.2s;
}
.form-range:focus::-ms-thumb {
  box-shadow: 0 0 0 4px rgba(127,156,245,0.18);
}

/* 兼容性处理，去除默认样式 */
.form-range::-webkit-slider-thumb {
  border-radius: 8px;
}
.form-range::-moz-range-thumb {
  border-radius: 8px;
}
.form-range::-ms-thumb {
  border-radius: 8px;
}
.form-range::-ms-fill-lower {
  background: transparent;
}
.form-range::-ms-fill-upper {
  background: transparent;
}
.form-range:focus {
  outline: none;
}
.form-control:focus {
  background-color: #fff;
  border-color: #5A67D8;
  outline: none;
  box-shadow: none;
  color: #495057;
}
.tab.active {
  background-color: #ffffff;
  color: #495057;
}

.btn-link {
  color: #6c757d;
  text-decoration: none;
}

.btn-link.active {
  font-weight: bold;
  color: #495057;
}

.input-group-text {
  background-color: #e9ecef;
}

.btn-warning {
  background-color: #ffc107;
}

.btn-warning:hover {
  background-color: #e0a800;
}

.amount {
  z-index: 1; /* 设置不同的 z-index */
  right: 0; /* 确保在 div 的右边 */
  top: 50%; /* 确保在 div 的正中间 */
  transform: translateY(-80%);
  position: absolute;
  display: block;
  text-align: right;
  margin-top: -1.5rem; /* 调整位置以确保金额在输入框的右上角 */
  margin-right: 0.5rem; /* 确保与输入框保持一定距离 */
}

.input-group .btn-outline-secondary {
  border-color: #DEE2E6;
  color: #5A67D8;
  background: #fff;
  transition: none;
}
.input-group .btn-outline-secondary.no-hover-effect:hover,
.input-group .btn-outline-secondary.no-hover-effect:focus,
.input-group .btn-outline-secondary.no-hover-effect:active {
  border-color: #DEE2E6;
  color: #5A67D8;
  background: #fff;
  box-shadow: none;
}
.input-group .btn-outline-secondary:hover {
  border-color: #DEE2E6;
  color: #5A67D8;
  background: #fff;
}
.input-group .btn-outline-secondary.has-hover-effect:hover {
  border-color: #5A67D8;
  color: #fff;
  background: #5A67D8;
  box-shadow: none;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.game-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
  padding: 1rem;
  width: 100%;
  max-width: 800px;
}

/* Balance header styles */
.balance-header {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  width: auto;
  max-width: 250px;
}

.balance-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(90,103,216,0.1);
  padding: 10px 16px;
  display: flex;
  align-items: center;
  position: relative;
}

.balance-label {
  font-size: 14px;
  color: #6c757d;
  margin-right: 12px;
}

.balance-amount {
  font-size: 16px;
  font-weight: 600;
  color: #5A67D8;
  display: flex;
  align-items: center;
}

.refresh-balance-btn {
  margin-left: 10px;
  background: transparent;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.refresh-balance-btn:hover {
  color: #5A67D8;
  background-color: rgba(90,103,216,0.05);
}

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

.table {
  margin-bottom: 0;
  width: 100%;
  border-collapse: collapse;
}

.table th {
  font-weight: 500;
  color: #6c757d;
  padding: 12px 16px;
  font-size: 13px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
  background-color: #f8f9fa;
}

.table td {
  padding: 12px 16px;
  font-size: 13px;
  border-bottom: 1px solid #e9ecef;
  color: #495057;
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

.text-success {
  color: #48BB78 !important;
  font-weight: 600;
}

.text-danger {
  color: #F56565 !important;
  font-weight: 600;
}

/* 如果有特殊按钮需要保留 hover 效果，可单独加 class 处理 */
@media (max-width: 768px) {
  .container {
    padding: 0.5rem;
  }

  .card {
    width: 100%;
    box-shadow: none;
  }

  .game-container {
    padding: 0.5rem;
  }

  .tabs {
    flex-direction: row; /* 保持水平排列 */
  }

  .tab {
    padding: 0.5rem;
  }

  .submit-btn {
    width: 100%;
    min-width: auto;
  }

  /* 确保手机版下的栏位正确排列 */
  .manual-form .row {
    display: flex;
    flex-wrap: wrap;
  }

  .manual-form .col-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }

  .manual-form .col-12 {
    flex: 0 0 100%;
    max-width: 100%;
  }
  
  /* 调整手机版标签大小 */
  label {
    font-size: 0.85rem;
    margin-bottom: 0.25rem;
  }
  
  .amount {
    font-size: 0.8rem;
    margin-top: -1.75rem;
  }

  .auto-form .row {
    display: flex;
    flex-wrap: wrap;
  }

  .auto-form .col-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }

  .auto-form .col-12 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .recent-bets-container {
    padding: 0.5rem;
  }
  
  .table {
    font-size: 0.75rem;
  }
}
.refresh-btn.rotating i {
  animation: rotate-refresh 0.4s linear;
}
@keyframes rotate-refresh {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
</style>
