interface SalaryConfig {
  monthlyIncome: number
  workDays: number[]
  workStartTime: string
  workEndTime: string
  lunchBreakDuration: number  // 午休时间（小时）
  incomePrefix: string
  currencyUnit: string
  updateInterval: number
  decimalPlaces: number
}

export type WorkStatus = 'working' | 'not-started' | 'off-work' | 'weekend'

export const useSalaryCalculator = () => {
  // 默认配置
  const defaultConfig: SalaryConfig = {
    monthlyIncome: 10000,
    workDays: [1, 2, 3, 4, 5], // 周一到周五
    workStartTime: '09:00',
    workEndTime: '18:00',
    lunchBreakDuration: 1, // 默认1小时午休
    incomePrefix: '收入+',
    currencyUnit: '元',
    updateInterval: 500,
    decimalPlaces: 4
  }

  // 响应式配置
  const config = ref<SalaryConfig>({ ...defaultConfig })
  
  // 当前收入
  const currentIncome = ref(0)
  
  // 工作状态
  const workStatus = ref<WorkStatus>('off-work')
  
  // 计时器
  let timer: NodeJS.Timeout | null = null
  let statusCheckTimer: NodeJS.Timeout | null = null

  // 计算每秒收入
  const calculateIncomePerSecond = () => {
    const workHoursPerDay = getWorkHoursPerDay()
    const workDaysPerMonth = getWorkDaysInCurrentMonth()
    const totalSecondsPerMonth = workDaysPerMonth * workHoursPerDay * 3600
    return config.value.monthlyIncome / totalSecondsPerMonth
  }

  // 获取每日工作小时数（减去午休时间）
  const getWorkHoursPerDay = () => {
    const [startHour, startMinute] = config.value.workStartTime.split(':').map(Number)
    const [endHour, endMinute] = config.value.workEndTime.split(':').map(Number)
    const startMinutes = startHour * 60 + startMinute
    const endMinutes = endHour * 60 + endMinute
    const totalHours = (endMinutes - startMinutes) / 60
    return totalHours - config.value.lunchBreakDuration
  }

  // 获取当月工作日数量
  const getWorkDaysInCurrentMonth = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    
    let workDaysCount = 0
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dayOfWeek = date.getDay()
      if (config.value.workDays.includes(dayOfWeek)) {
        workDaysCount++
      }
    }
    
    return workDaysCount
  }

  // 判断当前工作状态
  const getCurrentWorkStatus = (): WorkStatus => {
    const now = new Date()
    const currentDay = now.getDay()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    
    // 检查是否是工作日
    if (!config.value.workDays.includes(currentDay)) {
      return 'weekend'
    }
    
    // 解析工作时间
    const [startHour, startMinute] = config.value.workStartTime.split(':').map(Number)
    const [endHour, endMinute] = config.value.workEndTime.split(':').map(Number)
    const startTime = startHour * 60 + startMinute
    const endTime = endHour * 60 + endMinute
    
    if (currentTime < startTime) {
      return 'not-started'
    } else if (currentTime >= startTime && currentTime < endTime) {
      return 'working'
    } else {
      return 'off-work'
    }
  }

  // 计算今日累计收入
  const calculateTodayIncome = () => {
    const now = new Date()
    const currentDay = now.getDay()
    
    // 如果不是工作日，返回0
    if (!config.value.workDays.includes(currentDay)) {
      return 0
    }
    
    // 获取当前工作状态（不依赖于reactive状态）
    const currentWorkStatus = getCurrentWorkStatus()
    
    const [startHour, startMinute] = config.value.workStartTime.split(':').map(Number)
    const [endHour, endMinute] = config.value.workEndTime.split(':').map(Number)
    const workStartToday = new Date()
    const workEndToday = new Date()
    workStartToday.setHours(startHour, startMinute, 0, 0)
    workEndToday.setHours(endHour, endMinute, 0, 0)
    
    // 如果是工作中状态，使用当前时间
    // 如果是尚未开始，返回0
    // 如果是已下班，使用下班时间计算全天收入
    // 如果是周末，返回0
    if (currentWorkStatus === 'not-started' || currentWorkStatus === 'weekend') {
      return 0
    } else if (currentWorkStatus === 'off-work') {
      // 已下班，计算全天收入 - 直接使用每日工作小时数
      const dailyWorkHours = getWorkHoursPerDay()
      const incomePerSecond = calculateIncomePerSecond()
      return dailyWorkHours * 3600 * incomePerSecond
    }
    
    // 工作中状态，计算当前时间的收入
    const totalElapsedSeconds = Math.max(0, (now.getTime() - workStartToday.getTime()) / 1000)
    const lunchBreakSeconds = config.value.lunchBreakDuration * 3600
    
    // 假设午休在工作时间中间，如果已经过了一半工作时间，则扣除午休时间
    const totalWorkMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute)
    const halfWorkSeconds = (totalWorkMinutes / 2) * 60
    
    let actualWorkedSeconds = totalElapsedSeconds
    if (totalElapsedSeconds > halfWorkSeconds) {
      actualWorkedSeconds = totalElapsedSeconds - lunchBreakSeconds
    }
    
    actualWorkedSeconds = Math.max(0, actualWorkedSeconds)
    const incomePerSecond = calculateIncomePerSecond()
    
    return actualWorkedSeconds * incomePerSecond
  }

  // 更新收入显示
  const updateIncome = () => {
    workStatus.value = getCurrentWorkStatus()
    currentIncome.value = calculateTodayIncome()
  }

  // 开始定时器
  const startTimer = () => {
    if (timer) {
      clearInterval(timer)
    }
    
    updateIncome()
    
    // 只有在工作中或尚未开始时才设置定时器
    const currentStatus = getCurrentWorkStatus()
    if (currentStatus === 'working' || currentStatus === 'not-started') {
      timer = setInterval(updateIncome, config.value.updateInterval)
    }
  }

  // 停止定时器
  const stopTimer = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  // 启动状态检查定时器
  const startStatusCheckTimer = () => {
    if (statusCheckTimer) {
      clearInterval(statusCheckTimer)
    }
    // 每分钟检查一次状态变化
    statusCheckTimer = setInterval(checkAndManageTimer, 60000)
  }

  // 停止状态检查定时器
  const stopStatusCheckTimer = () => {
    if (statusCheckTimer) {
      clearInterval(statusCheckTimer)
      statusCheckTimer = null
    }
  }

  // 检查并管理定时器状态
  const checkAndManageTimer = () => {
    const currentStatus = getCurrentWorkStatus()
    
    if (currentStatus === 'working' || currentStatus === 'not-started') {
      // 需要定时器但没有运行时启动
      if (!timer) {
        startTimer()
      }
    } else {
      // 不需要定时器时停止
      if (timer) {
        stopTimer()
        // 但仍需要更新一次收入显示
        updateIncome()
      }
    }
  }

  // 格式化收入显示
  const formattedIncome = computed(() => {
    return currentIncome.value.toFixed(config.value.decimalPlaces)
  })

  // 工作状态文本
  const workStatusText = computed(() => {
    switch (workStatus.value) {
      case 'working':
        return '工作中'
      case 'not-started':
        return '尚未开始'
      case 'off-work':
        return '已下班'
      case 'weekend':
        return '休息日'
      default:
        return '未知状态'
    }
  })

  // 工作状态样式
  const workStatusClass = computed(() => {
    switch (workStatus.value) {
      case 'working':
        return 'status-working'
      case 'not-started':
        return 'status-not-started'
      case 'off-work':
        return 'status-off-work'
      case 'weekend':
        return 'status-off-work'
      default:
        return 'status-off-work'
    }
  })

  // 计算显示的统计信息
  const statistics = computed(() => {
    const incomePerSecond = calculateIncomePerSecond()
    const workHours = getWorkHoursPerDay()
    const workDaysThisMonth = getWorkDaysInCurrentMonth()
    
    return {
      incomePerSecond: incomePerSecond.toFixed(6),
      dailyWorkHours: workHours.toFixed(1),
      workDaysThisMonth
    }
  })

  // 监听配置变化，重新启动定时器
  watch(config, () => {
    startTimer()
  }, { deep: true })

  // 初始化状态
  const initializeState = () => {
    workStatus.value = getCurrentWorkStatus()
    currentIncome.value = calculateTodayIncome()
  }
  
  // 立即初始化状态
  initializeState()

  // 生命周期管理
  onMounted(() => {
    startTimer()
    startStatusCheckTimer()
  })

  onUnmounted(() => {
    stopTimer()
    stopStatusCheckTimer()
  })

  return {
    config,
    currentIncome,
    workStatus,
    formattedIncome,
    workStatusText,
    workStatusClass,
    statistics,
    startTimer,
    stopTimer,
    updateIncome
  }
} 