<template>
  <div class="game-container">
    
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
                  <input type="text" class="form-control" v-model="formData.betAmount" placeholder="0.0000" :disabled="isAutoBetting">
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
                  <input type="text" class="form-control" :value="profitOnWin" placeholder="0.0000" readonly>
                  <button class="btn btn-outline-secondary"><i class="fas fa-bitcoin-sign"></i></button>
                </div>
                <span class="amount position-absolute">{{ `$${profitOnWin}` }}</span>
              </div>
            </div>
            
            <div v-if="activeTab === 2" class="col-md-6 col-6 mb-3">
              <label class="text-start d-block">Number of Bets</label>
              <div class="input-group">
                <input type="text" class="form-control" v-model="formData.numberOfBets" placeholder="0" :disabled="isAutoBetting">
                <button class="btn btn-outline-secondary"><i class="fas fa-infinity"></i></button>
              </div>
            </div>
            
            <!-- 修改模板部分 rollOver/rollUnder 显示 -->
            <div class="col-md-4 col-6 mb-3">
              <label class="text-start d-block">{{ formData.rollType === 'over' ? 'Roll Over' : 'Roll Under' }}</label>
              <div class="input-group">
                <input
                  type="text"
                  class="form-control"
                  :value="roll"
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
                <input type="text" class="form-control" :value="multiplier" placeholder="1.2692" readonly>
                <button class="btn btn-outline-secondary no-hover-effect"><i class="fas fa-times"></i></button>
              </div>
            </div>
            
            <div class="col-md-4 col-6 mb-3">
              <label class="text-start d-block">Win Chance</label>
              <div class="input-group">
                <input type="text" class="form-control" :value="winChance" readonly />
                <button class="btn btn-outline-secondary no-hover-effect"><i class="fas fa-percent"></i></button>
              </div>
            </div>
            
            <template v-if="activeTab === 2">
              <div class="col-md-6 col-12 mb-3">
                <label class="text-start d-block">On Win</label>
                <div class="input-group">
                  <button class="btn btn-outline-secondary" @click="disableIncreaseOnWin" :disabled="isAutoBetting">Reset</button>
                  <button class="btn btn-outline-secondary" @click="enableIncreaseOnWin" :disabled="isAutoBetting">Increase by:</button>
                  <input type="text" class="form-control" v-model="formData.increaseOnWin" placeholder="0" :disabled="!formData.isIncreaseOnWin || isAutoBetting">
                  <span class="input-group-text">%</span>
                </div>
              </div>
              
              <div class="col-md-6 col-12 mb-3">
                <label class="text-start d-block">On Loss</label>
                <div class="input-group">
                  <button class="btn btn-outline-secondary" @click="disableIncreaseOnLoss" :disabled="isAutoBetting">Reset</button>
                  <button class="btn btn-outline-secondary" @click="enableIncreaseOnLoss" :disabled="isAutoBetting">Increase by:</button>
                  <input type="text" class="form-control" v-model="formData.increaseOnLoss" placeholder="0" :disabled="!formData.isIncreaseOnLoss || isAutoBetting">
                  <span class="input-group-text">%</span>
                </div>
              </div>
              
              <div class="col-md-6 col-12 mb-3">
                <label class="text-start d-block">Stop on Profit</label>
                <div class="position-relative">
                  <div class="input-group">
                    <input type="text" class="form-control" v-model="formData.stopOnProfit" placeholder="0.0000" :disabled="isAutoBetting">
                  </div>
                  <span class="amount position-absolute">{{ `$${formData.stopOnProfit}` }}</span>
                </div>
              </div>
              
              <div class="col-md-6 col-12 mb-3">
                <label class="text-start d-block">Stop on Loss</label>
                <div class="position-relative">
                  <div class="input-group">
                    <input type="text" class="form-control" v-model="formData.stopOnLoss" placeholder="0.0000" :disabled="isAutoBetting">
                  </div>
                  <span class="amount position-absolute">{{ `$${formData.stopOnLoss}` }}</span>
                </div>
              </div>
            </template>
          </div>
          
          <button v-if="activeTab === 1" class="btn btn-warning btn-lg submit-btn" @click="onSubmit">ROLL DICE</button>
          <button v-if="activeTab === 2 && !isAutoBetting" class="btn btn-warning btn-lg submit-btn" @click="startAutoBet">Start Autobet</button>
          <button v-if="activeTab === 2 && isAutoBetting" class="btn btn-danger btn-lg submit-btn" @click="stopAutoBet">Stop</button>
        </div>
      </div>
    </div>

    <div class="slider-container mt-4 w-100">
      <span class="slider-variable">0</span>
      <input
        type="range"
        v-model="formData.targerValue"
        class="form-range custom-slider"
        :class="formData.rollType === 'over' ? 'slider-over' : 'slider-under'"
        :style="`--slider-percent: ${sliderPercent}%`"
        min="2"
        max="98"
        step="1"
        id="customRange"
      />
      <span class="slider-variable">100</span>
    </div>
    

  </div>

  <RecentBetsTable />
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { useCallApi } from '@/hooks/useCallApi'
import { useBalanceStore } from '@/store/balanceStore'
import RecentBetsTable from '@/components/RecentBetsTable.vue'

const balanceStore = useBalanceStore()
const toast = useToast()
const { callApi } = useCallApi()
const isRefreshing = ref(false)
const activeTab = ref(1)

const tabs = ref([
  { label: 'Manual', value: 1 },
  { label: 'Auto', value: 2 },
])

const formData = reactive({
  targerValue: 2,
  rollType: 'over',
  betAmount: '0.0000',
  numberOfBets: '0',
  isIncreaseOnWin: false,
  increaseOnWin: '0',
  isIncreaseOnLoss: false,
  increaseOnLoss: '0',
  stopOnProfit: '0.0000',
  stopOnLoss: '0.0000'
})

// 计算显示用的栏位
const roll = computed(() => {
  // 显示给用户看的目标值
  if (formData.rollType === 'over') {
    return (formData.targerValue - 0.01).toFixed(2)
  } else {
    return parseFloat(formData.targerValue).toFixed(2)
  }
})

const winChance = computed(() => {
  if (formData.rollType === 'over') {
    return (100 - formData.targerValue).toFixed(4)
  } else {
    return parseFloat(formData.targerValue).toFixed(4)
  }
})

const multiplier = computed(() => {
  const chance = formData.rollType === 'over'
    ? 100 - formData.targerValue
    : parseFloat(formData.targerValue)
  return chance > 0 ? (99 / chance).toFixed(4) : '0.0000'
})

const profitOnWin = computed(() => {
  const bet = parseFloat(formData.betAmount) || 0
  return (bet * parseFloat(multiplier.value)).toFixed(4)
})

const notifyResult = (isWin, amount) => {
  toast[isWin ? 'success' : 'error'](
    `${isWin ? '+' : ''}${amount}`,
    {
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
    }
  )
}

// 切换 rollType 时同步切换 targerValue 的互补值
const toggleRollType = () => {
  isRefreshing.value = true
  formData.targerValue = (100 - parseFloat(formData.targerValue)).toFixed(2)
  formData.rollType = formData.rollType === 'over' ? 'under' : 'over'
  setTimeout(() => {
    isRefreshing.value = false
  }, 400)
}

const halfBetAmount = () => {
  const currentAmount = parseFloat(formData.betAmount) || 0
  formData.betAmount = (currentAmount / 2).toFixed(4)
}

const doubleBetAmount = () => {
  const currentAmount = parseFloat(formData.betAmount) || 0
  formData.betAmount = (currentAmount * 2).toFixed(4)
}

const sliderPercent = computed(() => {
  const min = 2;
  const max = 98;
  const value = parseFloat(formData.targerValue);
  return ((value - min) / (max - min)) * 100;
});

const isAutoBetting = ref(false);
const autoBetState = reactive({
  initialNumberOfBets: 0,
  betsLeft: 0,
  profit: 0,
  loss: 0,
  stopOnProfit: 0,
  stopOnLoss: 0
});

const startAutoBet = () => {
  if (isAutoBetting.value) return
  if (parseFloat(formData.betAmount) <= 0) {
    toast.error(
      'Please enter bet amount!',
      {
        position: "top-center",
        timeout: 1500,
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
      }
    )
    stopAutoBet()
    return
  }
  if (parseFloat(formData.numberOfBets) <= 0) {
    toast.error(
      'Please enter number of bets!',
      {
        position: "top-center",
        timeout: 1500,
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
      }
    )
    stopAutoBet()
    return
  }
  isAutoBetting.value = true
  autoBetState.initialNumberOfBets = parseInt(formData.numberOfBets) || 0
  autoBetState.betsLeft = autoBetState.initialNumberOfBets
  autoBetState.profit = 0
  autoBetState.loss = 0
  autoBetState.stopOnProfit = parseFloat(formData.stopOnProfit) || 0
  autoBetState.stopOnLoss = parseFloat(formData.stopOnLoss) || 0
  runAutoBet()
}

const stopAutoBet = () => {
  isAutoBetting.value = false
  formData.numberOfBets = autoBetState.initialNumberOfBets.toString()
}

const runAutoBet = async () => {
  // 新增：自动投注时判断 betAmount
  if (
    !isAutoBetting.value ||
    (autoBetState.stopOnProfit > 0 && autoBetState.profit >= autoBetState.stopOnProfit) ||
    (autoBetState.stopOnLoss > 0 && autoBetState.loss <= -autoBetState.stopOnLoss) ||
    (autoBetState.betsLeft <= 0)
  ) {
    toast.success(
      `Auto betting finished. Total profit: ${autoBetState.profit.toFixed(4)}, total loss: ${autoBetState.loss.toFixed(4)}`,
      {
        position: "top-center",
        timeout: 3000,
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
      }
    )
    stopAutoBet()
    return
  }

  const data = {
    betAmount: parseFloat(formData.betAmount),
    targetValue: parseFloat(formData.targerValue),
    rollType: formData.rollType
  }

  const response = await callApi('/bets', 'POST', data)
  if (response) {
    // 新增：自动投注时同步更新余额
    if (response.newBalance !== undefined) {
      balanceStore.balance = parseFloat(response.newBalance).toFixed(4)
    }
    autoBetState.betsLeft--
    formData.numberOfBets = autoBetState.betsLeft.toString()
    if (response.isWin) {
      autoBetState.profit += parseFloat(response.payout)
      // 新增：根据 onWin 百分比调整 betAmount，且不能超过 balance
      if (parseFloat(formData.increaseOnWin) > 0) {
        const percent = parseFloat(formData.increaseOnWin)
        let nextBet = (parseFloat(formData.betAmount) * (1 + percent / 100))
        const balance = parseFloat(balanceStore.balance)
        if (nextBet > balance) nextBet = balance
        formData.betAmount = nextBet.toFixed(4)
      }
    } else {
      autoBetState.loss -= parseFloat(formData.betAmount)
      // 新增：根据 onLoss 百分比调整 betAmount，且不能超过 balance
      if (parseFloat(formData.increaseOnLoss) > 0) {
        const percent = parseFloat(formData.increaseOnLoss)
        let nextBet = (parseFloat(formData.betAmount) * (1 + percent / 100))
        const balance = parseFloat(balanceStore.balance)
        if (nextBet > balance) nextBet = balance
        formData.betAmount = nextBet.toFixed(4)
      }
    }
    setTimeout(runAutoBet, 800)
  } else {
    stopAutoBet()
  }
}

const onSubmit = async () => {
  try {
    // 新增：手动投注时判断 betAmount
    if (parseFloat(formData.betAmount) <= 0) {
      toast.error(
        'Please enter bet amount!',
        {
          position: "top-center",
          timeout: 1500,
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
        }
      )
      return
    }
    const data = {
      betAmount: parseFloat(formData.betAmount),
      targetValue: parseFloat(formData.targerValue),
      rollType: formData.rollType
    };

    const response = await callApi('/bets', 'POST', data);

    if(response) {
      // 新增：手动投注时同步更新余额
      if (response.newBalance !== undefined) {
        balanceStore.balance = parseFloat(response.newBalance).toFixed(4)
      }
      notifyResult(response.isWin, response.payout)
    }
  } catch (e) {
    console.error(e);
  }
}

const disableIncreaseOnWin = () => {
  formData.isIncreaseOnWin = false;
  formData.increaseOnWin = '0';
}

const disableIncreaseOnLoss = () => {
  formData.isIncreaseOnLoss = false;
  formData.increaseOnLoss = '0';
}

const enableIncreaseOnWin = () => {
  formData.isIncreaseOnWin = true;
}

const enableIncreaseOnLoss = () => {
  formData.isIncreaseOnLoss = true;
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
}
.refresh-btn.rotating i {
  animation: rotate-refresh 0.4s linear;
}

@keyframes rotate-refresh {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
.custom-slider {
  background: transparent;
  -webkit-appearance: none;
  appearance: none;
}

/* rollType 为 over 时：左红右绿 */
.slider-over::-webkit-slider-runnable-track {
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(
    to right,
    #f4436c 0%,
    #f4436c var(--slider-percent),
    #00ff6a var(--slider-percent),
    #00ff6a 100%
  );
}
.slider-over::-moz-range-track {
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(
    to right,
    #f4436c 0%,
    #f4436c var(--slider-percent),
    #00ff6a var(--slider-percent),
    #00ff6a 100%
  );
}
.slider-over::-ms-fill-lower {
  background: #f4436c;
  border-radius: 4px;
}
.slider-over::-ms-fill-upper {
  background: #00ff6a;
  border-radius: 4px;
}

/* rollType 为 under 时：左绿右红 */
.slider-under::-webkit-slider-runnable-track {
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(
    to right,
    #00ff6a 0%,
    #00ff6a var(--slider-percent),
    #f4436c var(--slider-percent),
    #f4436c 100%
  );
}
.slider-under::-moz-range-track {
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(
    to right,
    #00ff6a 0%,
    #00ff6a var(--slider-percent),
    #f4436c var(--slider-percent),
    #f4436c 100%
  );
}
.slider-under::-ms-fill-lower {
  background: #00ff6a;
  border-radius: 4px;
}
.slider-under::-ms-fill-upper {
  background: #f4436c;
  border-radius: 4px;
}
</style>
