<template>
  <!--倒计时-->
  <span :endTime="endTime" :callback="callback" :endText="endText" :isMin="isMin">
        <slot>{{time}}</slot>
    </span>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'countDown',
    props: {
      endTime: {
        type: Number,
        default: 0
      },
      endText: {
        type: String,
        default: '已结束'
      },
      callback: {
        type: Function
      },
      isMin: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        time: '00分钟',
        timer: null

      }
    },
    mounted() {
      this.countDownTime(this.endTime)
    },
    methods: {
      countDownTime(timestamp) {
        let self = this
        this.timer = setInterval(function () {
          timestamp = timestamp - 1000
          let endTime = new Date(timestamp)
          let t = endTime.getTime()

          if (t > 0) {
            if (self.isMin) {
              let min = Math.ceil(t / 60000)
              let format = `${min}分钟`
              self.time = format
            } else {
              let day = Math.floor(t / 86400000)
              let hour = Math.floor((t / 3600000) % 24)
              let min = Math.floor((t / 60000) % 60)
              let sec = Math.floor((t / 1000) % 60)
              hour = hour < 10 ? '0' + hour : hour
              min = min < 10 ? '0' + min : min
              sec = sec < 10 ? '0' + sec : sec
              let format = `${day}天${hour}小时${min}分钟${sec}秒`
              self.time = format
            }
          } else {
            console.log('倒计时完成')
            clearInterval(this.timer)
            self._callback()
          }
        }, 1000)
      },
      _callback() {
        if (this.callback && this.callback instanceof Function) {
          this.callback(...this)
        }
      }
    },
    beforeDestroy () {
      clearInterval(this.timer)
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>

