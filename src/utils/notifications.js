// utils/notifications.js
import AWN from 'awesome-notifications'
import 'awesome-notifications/dist/style.css'

const options = {
  position: 'top-center', // 中上位置
  durations: {
    global: 500 // 显示 500 毫秒
  }
}

const notifier = new AWN(options)

export const handleMessage = (message, type = 'info') => {
  switch (type) {
    case 'info':
      notifier.info(message)
      break
    case 'success':
      notifier.success(message)
      break
    case 'warning':
      notifier.warning(message)
      break
    case 'error':
      notifier.alert(message)
      break
    default:
      notifier.tip(message)
      break
  }
}
