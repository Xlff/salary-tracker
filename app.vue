<template>
  <div class="min-h-screen bg-gray-900 p-4">
    <div class="max-w-7xl mx-auto">
      <!-- 移动端单栏布局，桌面端双栏布局 -->
      <div class="equal-height-container">
        <!-- 配置面板 -->
        <div class="order-2 lg:order-1">
          <ConfigPanel
            v-model:monthly-income="config.monthlyIncome"
            v-model:work-days="config.workDays"
            v-model:work-start-time="config.workStartTime"
            v-model:work-end-time="config.workEndTime"
            v-model:lunch-break-duration="config.lunchBreakDuration"
            v-model:income-prefix="config.incomePrefix"
            v-model:currency-unit="config.currencyUnit"
            v-model:update-interval="config.updateInterval"
            v-model:decimal-places="config.decimalPlaces"
          />
        </div>
        
        <!-- 收入显示面板 -->
        <div class="order-1 lg:order-2">
          <IncomeDisplay
            :formatted-income="formattedIncome"
            :status-text="workStatusText"
            :status-class="workStatusClass"
            :income-prefix="config.incomePrefix"
            :currency-unit="config.currencyUnit"
            :income-per-second="statistics.incomePerSecond"
            :daily-work-hours="statistics.dailyWorkHours"
            :work-days-this-month="statistics.workDaysThisMonth"
            :is-working="workStatus === 'working'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 使用薪资计算器
const { 
  config, 
  formattedIncome, 
  workStatus,
  workStatusText, 
  workStatusClass, 
  statistics 
} = useSalaryCalculator()
</script> 