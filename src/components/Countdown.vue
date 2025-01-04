<template>
  <h1 v-if="!shouldShowVideo">{{msg }}</h1>

  <div class="countdown-wrapper">
    <div ref="fireworksContainer" class="fireworks-container"></div>
    <div class="countdown-container" v-if="!shouldShowVideo">
      <Countdown
        :deadline="deadline"
        @timeElapsed="handleTimeElapsed"
        :showDays="shouldShowDays"
        :showHours="true"
        :showMinutes="true"
        :showSeconds="true"
        countdownSize="10em"
        labelSize="3em"
        mainColor="#cca900"
        secondFlipColor="#ffdc00"
        labelColor="#fff"
        :labels="{ days: '日', hours: '小时', minutes: '分钟', seconds: '秒' }"
      />
    </div>
    <button 
      v-show="!isFullScreen" 
      class="fullscreen_btn"
      @click="toggleFullScreen"
    >
      全屏显示
    </button>
    <div class="c_btns">
      <button v-show="!isFullScreen" class="c_btn" @click="setAutoplayMuted">
        {{local_autoplayMuted == 1 ? '静音':'有声'}}
      </button>
      <button v-show="!isFullScreen" class="c_btn" @click="setTestCountdown" style="right: 100;">
        test{{ !!testCountdown_date ? testCountdown_date:''}}
      </button>
    </div>
  </div>

  <div id="xgPlayer" class="xgPlayerWrap" :style="{opacity: shouldShowVideo ? 1 : 0}"></div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import dayjs from 'dayjs'
import { Countdown } from 'vue3-flip-countdown'
import { Fireworks } from 'fireworks-js'
import Player, {Events} from 'xgplayer'
import 'xgplayer/dist/index.min.css'

const local_autoplayMuted = localStorage.getItem('autoplayMuted')

defineProps({
  msg: String,
})

const count = ref(0)
const newYear_msg = ref('')
const shouldShowVideo = ref(false)
let deadline
const testCountdown_date = localStorage.getItem('testCountdown_date')
if(testCountdown_date){
  deadline = testCountdown_date
} else {
  deadline = dayjs('2025-1-1 00:00:00').format('YYYY-MM-DD HH:mm:ss')
  // deadline = ref(dayjs('2025-1-1').format('YYYY-MM-DD HH:mm:ss'))
  // deadline = ref(dayjs().add(5, 'second').format('YYYY-MM-DD HH:mm:ss'))
  // deadline = dayjs().add(2, 'day').format('YYYY-MM-DD HH:mm:ss')
}

const shouldShowDays = computed(() => {
  const now = dayjs()
  const target = dayjs(deadline)
  const diffInDays = target.diff(now, 'day', true)
  return diffInDays >= 1
})

const fireworksContainer = ref(null)
let fireworks = null
let player = null

const isFullScreen = ref(false)

const toggleFullScreen = async () => {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen()
    isFullScreen.value = true
  } else {
    await document.exitFullscreen()
    isFullScreen.value = false
  }
}
const setAutoplayMuted = () => {
  console.log(local_autoplayMuted)
  localStorage.setItem('autoplayMuted', !!Number(local_autoplayMuted) ? 0:1)
}
const setTestCountdown = () => {
  // 空值和非空值切换
  if(testCountdown_date){
    localStorage.removeItem('testCountdown_date')
  } else {
    localStorage.setItem('testCountdown_date', dayjs().add(70, 'second').format('YYYY-MM-DD HH:mm:ss'))
  }
}

const checkTimeAndPlay = () => {
  const now = dayjs()
  const target = dayjs(deadline)
  const diffInMinutes = target.diff(now, 'second')
  // console.log('diffInMinutes:', diffInMinutes)
  // debugger
  if (diffInMinutes < 60 && !shouldShowVideo.value) {
    shouldShowVideo.value = true
    player.play()
  }
}

onMounted(() => {
  player = new Player({
    id: 'xgPlayer',
    // url: '/videos/HappyNewYear2025-COUNTDOWN10seconds-TIMER.mp4',
    url: './videos/HappyNewYear2025COUNTDOWN60seconds-TIMER.mp4',
    height: '100%',
    width: '100%',
    controls: false,
    autoplayMuted: !!Number(local_autoplayMuted),
    // muted: !!Number(local_autoplayMuted),
    // autoplay: true
  });
  player.on(Events.ENDED, () => {
    console.log('视频播放结束')
    // shouldShowVideo.value = false
  })
  player.on(Events.TIME_UPDATE, (e) => {
    // debugger
    // console.log('视频播放时间:', e.currentTime)
    // if(e.currentTime > 10) player.setConfig({autoplayMuted: false})
    // if(e.currentTime > 14) {
    //   player.pause()
    // }
    if(e.currentTime > 72) { // 让视频停在末尾2025数字上
      player.pause()
    }
  })
  

  if (fireworksContainer.value) {
    fireworks = new Fireworks(fireworksContainer.value, {
      autoresize: true,
      opacity: 0.5,
      acceleration: 1.05,
      friction: 0.97,
      gravity: 1.5,
      particles: 50,
      traceLength: 3,
      traceSpeed: 10,
      explosion: 5,
      intensity: 30,
      flickering: 50,
      lineStyle: 'round',
      hue: {
        min: 0,
        max: 360
      },
      delay: {
        min: 30,
        max: 60
      },
      rocketsPoint: {
        min: 50,
        max: 50
      },
      lineWidth: {
        explosion: {
          min: 1,
          max: 3
        },
        trace: {
          min: 1,
          max: 2
        }
      },
      brightness: {
        min: 50,
        max: 80
      },
      sound: {
        enabled: true,
        files: [
            './assets/sounds/explosion0.mp3',  // 确保这个路径指向你的音效文件
            './assets/sounds/explosion1.mp3',
            './assets/sounds/explosion2.mp3',
        ],
        volume: {
            min: 4,
            max: 8
        }
      }
    })
    fireworks.start()
  }

  // 每秒检查一次时间
  const timer = setInterval(checkTimeAndPlay, 1000)
  
  // // 清理定时器
  // onUnmounted(() => {
  //   clearInterval(timer)
  // })

  // 添加键盘事件监听
  document.addEventListener('fullscreenchange', () => {
    isFullScreen.value = !!document.fullscreenElement
  })
})

onUnmounted(() => {
  if (fireworks) {
    fireworks.stop()
  }
  document.removeEventListener('fullscreenchange', () => {
    isFullScreen.value = !!document.fullscreenElement
  })
})

const handleTimeElapsed =  async () => {
  // console.log('倒计时结束!')
  // newYear_msg.value = '欢迎2025年'
  // shouldShowVideo.value = true
  // try {
  //   await player.play()
  // } catch (error) {
  //   console.log('需要用户交互才能播放视频:', error)
  //   // 静音播放作为备选方案
  //   player.muted = true
  //   await player.play()
  // }
}
</script>

<style scoped>
.xgPlayerWrap{
  position: fixed;
  left: 0;
  top: 0;
}
h1 {
  position: relative;
  z-index: 10;
  margin: 0;
  margin-bottom: 1em;
  color: #ffdc00;
  font-size: 80px;
  text-align: center;
}
.countdown-container {
  margin: 2rem auto;
  padding: 1rem;
  text-align: center;
}

.container {
  width: 100%;
  height: 100%;
}

.read-the-docs {
  color: #888;
}

.countdown-wrapper {
  position: relative;
  z-index: 10;
  width: 100%;
  /* height: 100vh; */
}

.fireworks-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 999;
}

.countdown-container {
  position: relative;
  z-index: 1000;
}

.fullscreen_btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid #fff;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  z-index: 1000;
}
.c_btns{
  position: fixed;
  bottom: 20px;
  left: 20px;

}
.c_btn{
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid #fff;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  z-index: 1000;
  font-size: 12px;
}

.fullscreen_btn:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>