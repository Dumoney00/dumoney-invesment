
/**
 * Format time to be more readable and show relative time
 */
export const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const activityTime = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - activityTime.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    if (days < 7) {
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else {
      return activityTime.toLocaleDateString();
    }
  }
};
