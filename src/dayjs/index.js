import dayjs from 'dayjs'
import zhCN from 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'
import RelativeTime from 'dayjs/plugin/relativeTime'
dayjs.locale(zhCN)
dayjs.extend(RelativeTime)

export default dayjs