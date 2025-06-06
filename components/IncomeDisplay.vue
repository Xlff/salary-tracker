<template>
  <div class="display-panel">
    <div class="flex-1 flex flex-col justify-center space-y-6">
    
      <h1 class="text-3xl font-bold text-white ">薪资跳动</h1>
   
      
    
      <div class="mb-6 flex-1 flex flex-col  justify-center items-center">
          <!-- 工作状态 -->
        <span :class="['status-indicator', statusClass]">
          {{ statusText }}
        </span>
     
      
      <!-- 收入显示 -->
      <div class="space-y-4 px-2 mt-5">
        <div class="income-display">
          {{ incomePrefix }}{{ formattedIncome }}{{ currencyUnit }}
        </div>
        <p class="text-gray-400 text-lg">
          {{ isWorking ? '今日累计收入' : '今日收入' }}
        </p>
      </div>
    </div>
      <!-- 统计信息 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div class="stat-card">
          <h3 class="text-lg font-semibold text-white mb-2">每秒收入</h3>
          <p class="text-green-400 text-xl font-mono">¥{{ incomePerSecond }}</p>
        </div>
        <div class="stat-card">
          <h3 class="text-lg font-semibold text-white mb-2">每日工时</h3>
          <p class="text-blue-400 text-xl">{{ dailyWorkHours }}小时</p>
        </div>
        <div class="stat-card">
          <h3 class="text-lg font-semibold text-white mb-2">本月工作日</h3>
          <p class="text-purple-400 text-xl">{{ workDaysThisMonth }}天</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  formattedIncome: string
  statusText: string
  statusClass: string
  incomePrefix: string
  currencyUnit: string
  incomePerSecond: string
  dailyWorkHours: string
  workDaysThisMonth: number
  isWorking: boolean
}

defineProps<Props>()
</script> 