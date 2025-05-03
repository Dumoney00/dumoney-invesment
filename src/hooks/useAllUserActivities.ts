
// This file now re-exports from the refactored modules
import { useActivities } from './activities/useActivities';
export type { ActivityStats } from './activities/useActivities';

// Re-export the hook with the original name for backward compatibility
export const useAllUserActivities = useActivities;
