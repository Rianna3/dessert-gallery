export function getCurrentVotingWindow(now = new Date()) {
  const current = new Date(now)
  const day = current.getDay()
  const daysSinceTuesday = (day + 5) % 7

  const start = new Date(current)
  start.setDate(current.getDate() - daysSinceTuesday)
  start.setHours(0, 0, 0, 0)

  const end = new Date(start)
  end.setDate(start.getDate() + 7)

  return { start, end, isOpen: current >= start && current < end }
}