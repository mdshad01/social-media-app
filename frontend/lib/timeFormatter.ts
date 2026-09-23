/**
 * Format timestamp to relative time (e.g., "Just now", "5m", "2h", "3d", "1y")
 * @param timestamp - ISO date string or Date object
 * @returns Formatted relative time string
 */
export function formatRelativeTime(timestamp: string | Date): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  // Less than 1 minute
  if (diffInSeconds < 60) {
    return "Just now";
  }

  // Minutes (1-59)
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}min`;
  }

  // Hours (1-23)
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }

  // Days (1-29)
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}d`;
  }

  // Months (1-11)
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}mo`;
  }

  // Years
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y`;
}

/**
 * Format timestamp with full date on hover (tooltip)
 * @param timestamp - ISO date string or Date object
 * @returns Formatted full date string
 */
export function formatFullDate(timestamp: string | Date): string {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
