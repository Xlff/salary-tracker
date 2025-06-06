<template>
  <div class="config-panel">
    <h2 class="text-2xl font-bold text-white mb-6">配置设置</h2>
    
    <!-- 月收入 -->
    <div>
      <label class="config-label">月收入</label>
      <input
        :value="monthlyIncome"
        @input="updateMonthlyIncome"
        type="number"
        class="config-input"
        placeholder="请输入月收入"
        min="0"
        step="100"
      />
    </div>
    
    <!-- 工作日选择 -->
    <div>
      <label class="config-label">工作日</label>
      <div class="grid grid-cols-7 gap-2">
        <div v-for="(day, index) in weekDays" :key="index" class="text-center">
          <label class="flex flex-col items-center space-y-2 cursor-pointer hover:bg-gray-700 p-2 rounded-lg transition-colors">
            <input
              :checked="workDays.includes(index)"
              @change="toggleWorkDay(index)"
              type="checkbox"
              class="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <span class="text-xs text-gray-300">{{ day }}</span>
          </label>
        </div>
      </div>
    </div>
    
    <!-- 工作时间 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="config-label">上班时间</label>
        <input
          :value="workStartTime"
          @input="updateWorkStartTime"
          type="time"
          class="config-input"
        />
      </div>
      <div>
        <label class="config-label">下班时间</label>
        <input
          :value="workEndTime"
          @input="updateWorkEndTime"
          type="time"
          class="config-input"
        />
      </div>
    </div>
    
    <!-- 午休时间 -->
    <div>
      <label class="config-label">午休时间</label>
      <select :value="lunchBreakDuration" @change="updateLunchBreakDuration" class="config-input">
        <option :value="1">1小时</option>
        <option :value="1.5">1.5小时</option>
        <option :value="2">2小时</option>
        <option :value="2.5">2.5小时</option>
        <option :value="3">3小时</option>
      </select>
    </div>
    
    <!-- 显示格式 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="config-label">收入前缀</label>
        <input
          :value="incomePrefix"
          @input="updateIncomePrefix"
          type="text"
          class="config-input"
          placeholder="收入+"
        />
      </div>
      <div>
        <label class="config-label">货币单位</label>
        <input
          :value="currencyUnit"
          @input="updateCurrencyUnit"
          type="text"
          class="config-input"
          placeholder="元"
        />
      </div>
    </div>
    
    <!-- 更新间隔 -->
    <div>
      <label class="config-label">更新间隔 (毫秒)</label>
      <select :value="updateInterval" @change="updateUpdateInterval" class="config-input">
        <option :value="100">100ms</option>
        <option :value="200">200ms</option>
        <option :value="300">300ms</option>
        <option :value="500">500ms</option>
        <option :value="1000">1000ms</option>
      </select>
    </div>
    
    <!-- 小数位数 -->
    <div>
      <label class="config-label">小数位数</label>
      <select :value="decimalPlaces" @change="updateDecimalPlaces" class="config-input">
        <option :value="0">0位</option>
        <option :value="1">1位</option>
        <option :value="2">2位</option>
        <option :value="3">3位</option>
        <option :value="4">4位</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  monthlyIncome: number
  workDays: number[]
  workStartTime: string
  workEndTime: string
  lunchBreakDuration: number
  incomePrefix: string
  currencyUnit: string
  updateInterval: number
  decimalPlaces: number
}

interface Emits {
  (e: 'update:monthlyIncome', value: number): void
  (e: 'update:workDays', value: number[]): void
  (e: 'update:workStartTime', value: string): void
  (e: 'update:workEndTime', value: string): void
  (e: 'update:lunchBreakDuration', value: number): void
  (e: 'update:incomePrefix', value: string): void
  (e: 'update:currencyUnit', value: string): void
  (e: 'update:updateInterval', value: number): void
  (e: 'update:decimalPlaces', value: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

const updateMonthlyIncome = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:monthlyIncome', Number(target.value))
}

const toggleWorkDay = (dayIndex: number) => {
  const newWorkDays = [...props.workDays]
  const index = newWorkDays.indexOf(dayIndex)
  if (index > -1) {
    newWorkDays.splice(index, 1)
  } else {
    newWorkDays.push(dayIndex)
  }
  emit('update:workDays', newWorkDays.sort())
}

const updateWorkStartTime = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:workStartTime', target.value)
}

const updateWorkEndTime = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:workEndTime', target.value)
}

const updateLunchBreakDuration = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:lunchBreakDuration', Number(target.value))
}

const updateIncomePrefix = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:incomePrefix', target.value)
}

const updateCurrencyUnit = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:currencyUnit', target.value)
}

const updateUpdateInterval = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:updateInterval', Number(target.value))
}

const updateDecimalPlaces = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:decimalPlaces', Number(target.value))
}
</script> 