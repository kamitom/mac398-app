<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'

  interface TimeRemaining {
    days: number
    hours: number
    minutes: number
    seconds: number
  }

  const targetDate = new Date(import.meta.env.VITE_COUNTDOWN_TARGET)
  const eventName = import.meta.env.VITE_COUNTDOWN_EVENT
  const timezone = import.meta.env.VITE_COUNTDOWN_TIMEZONE

  const remaining = ref<TimeRemaining>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  const updateCountdown = () => {
    const now = new Date()
    const diff = targetDate.getTime() - now.getTime()

    if (diff > 0) {
      remaining.value = {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      }
    } else {
      remaining.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }
  }

  const localTime = targetDate.toLocaleString('zh-TW', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })

  let intervalId: ReturnType<typeof setInterval>

  onMounted(() => {
    updateCountdown()
    intervalId = setInterval(updateCountdown, 1000)
  })

  onUnmounted(() => {
    clearInterval(intervalId)
  })
</script>

<template>
  <div class="countdown">
    <h1 class="countdown-title"> {{ eventName }} </h1>
    <div class="countdown-display">
      <span class="time-unit">
        <span class="number">{{ String(remaining.days).padStart(3, '0') }}</span>
        <span class="label">日</span>
      </span>
      <span class="time-unit">
        <span class="number">{{ String(remaining.hours).padStart(2, '0') }}</span>
        <span class="label">時</span>
      </span>
      <span class="time-unit">
        <span class="number">{{ String(remaining.minutes).padStart(2, '0') }}</span>
        <span class="label">分</span>
      </span>
      <span class="time-unit">
        <span class="number">{{ String(remaining.seconds).padStart(2, '0') }}</span>
        <span class="label">秒</span>
      </span>
    </div>
    <p class="countdown-target">比賽時間：{{ localTime }} (UTC+8)</p>
  </div>
</template>

<style scoped>
  .countdown {
    text-align: center;
    padding: 2rem 0;
  }

  .countdown-title {
    font-size: 2.2rem;
    /* font-size: 1.2rem; */
    color: hsla(160, 100%, 37%, 1);
    margin-bottom: 0.25rem;
    font-weight: 500;
  }

  .countdown-display {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin: 0;
  }

  .time-unit {
    display: inline-flex;
    align-items: baseline;
    gap: 0.25rem;
  }

  .number {
    font-size: 1.3rem;
    font-weight: 500;
    color: hsla(160, 100%, 37%, 1);
  }

  .label {
    font-size: 1rem;
    color: var(--color-text);
  }

  .countdown-target {
    font-size: 0.9rem;
    color: var(--color-text);
    opacity: 0.8;
    margin-top: 1rem;
  }

  @media (min-width: 1024px) {

    .countdown-title,
    .countdown-display,
    .countdown-target {
      text-align: left;
    }

    .countdown-display {
      justify-content: flex-start;
    }
  }
</style>
