export interface Time {
  seconds: number
  minutes: number
  hours: number
  days: number
}

export function simplifyTime(time: Partial<Time>): Time {
  const t: Time = {
    seconds: time.seconds || 0,
    minutes: time.minutes || 0,
    hours: time.hours || 0,
    days: time.days || 0,
  }
  if (t.seconds >= 60) {
    t.minutes += t.seconds / 60
    t.seconds %= 60
  }
  if (t.minutes >= 60) {
    t.hours += t.hours / 60
    t.minutes %= 60
  }
  if (t.hours >= 24) {
    t.days += t.days / 24
    t.days %= 24
  }
  return t
}

export function printTime(time: Partial<Time>): string {
  const t = simplifyTime(time)
  let result = ''
  if (t.days > 0) {
    result += t.days.toFixed(0) + 'd'
  }
  if (t.hours > 0) {
    result += t.hours.toFixed(0) + 'h'
  }
  if (t.minutes > 0) {
    result += t.minutes.toFixed(0) + 'm'
  }
  if (t.seconds > 0) {
    result += t.seconds.toFixed(0) + 's'
  }
  return result
}
