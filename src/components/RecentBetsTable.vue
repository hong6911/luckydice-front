<template>
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
import { ref, onMounted, onUnmounted } from 'vue';

// 定义 props
const props = defineProps({
  initialBets: {
    type: Array,
    default: () => []
  }
});

// Recent bets data
const recentBets = ref(props.initialBets || []);
let betInterval = null;

// Generate random username
const generateUsername = () => {
  const prefixes = ['lucky', 'crypto', 'dice', 'bet', 'win', 'player', 'gambler', 'high', 'low'];
  const suffixes = ['king', 'queen', 'master', '123', 'pro', 'winner', 'star', 'ace', 'x', 'y', 'z'];
  const randomNumbers = Math.floor(Math.random() * 1000).toString();
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  return `${prefix}${suffix}${randomNumbers}`;
};

// Generate a random bet
const generateRandomBet = () => {
  const isWin = Math.random() > 0.5;
  const rollType = Math.random() > 0.5 ? 'over' : 'under';
  const target = rollType === 'over' 
    ? Math.floor(Math.random() * 96) + 2 
    : Math.floor(Math.random() * 96) + 2;
  const roll = Math.floor(Math.random() * 100);
  
  // Generate realistic bet amounts (mostly small with occasional large bets)
  let betAmount;
  const betType = Math.random();
  if (betType > 0.98) { // High rollers (2%)
    betAmount = (Math.random() * 0.5 + 0.1).toFixed(8);
  } else if (betType > 0.8) { // Medium bets (18%)
    betAmount = (Math.random() * 0.05 + 0.01).toFixed(8);
  } else { // Small bets (80%)
    betAmount = (Math.random() * 0.01 + 0.0001).toFixed(8);
  }
  
  const multiplier = (Math.random() * 2 + 1).toFixed(2);
  const payout = (parseFloat(betAmount) * parseFloat(multiplier)).toFixed(8);
  
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
  };
};

// Add a new bet to the table
const addNewBet = () => {
  const newBet = generateRandomBet();
  recentBets.value.unshift(newBet);
  
  // Keep only the last 10 bets
  if (recentBets.value.length > 10) {
    recentBets.value.pop();
  }
};

// Start generating fake bets
onMounted(() => {
  // Initialize with a few bets if none provided
  if (recentBets.value.length === 0) {
    for (let i = 0; i < 10; i++) {
      addNewBet();
    }
  }
  
  // Add a new bet every 1-3 seconds
  betInterval = setInterval(() => {
    addNewBet();
  }, Math.random() * 2000 + 1000);
});

// Clean up interval when component is unmounted
onUnmounted(() => {
  if (betInterval) {
    clearInterval(betInterval);
  }
});
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