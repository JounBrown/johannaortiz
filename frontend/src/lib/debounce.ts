

/**
 * Smart refresh utility that combines debouncing with time-based throttling
 * Prevents excessive API calls while ensuring data freshness
 */
export function createSmartRefresh<T extends (...args: unknown[]) => unknown>(
  func: T,
  options: {
    debounceMs?: number;
    throttleMs?: number;
    maxStaleMs?: number;
  } = {}
): (...args: Parameters<T>) => void {
  const {
    debounceMs = 1000,
    throttleMs = 5000,
    maxStaleMs = 30000
  } = options;

  let lastExecution = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecution;

    // Clear any pending debounced execution
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    // If data is too stale, execute immediately
    if (timeSinceLastExecution >= maxStaleMs) {
      lastExecution = now;
      func(...args);
      return;
    }

    // If within throttle window, debounce the execution
    if (timeSinceLastExecution < throttleMs) {
      timeoutId = setTimeout(() => {
        lastExecution = Date.now();
        func(...args);
      }, debounceMs);
    } else {
      // Execute immediately if outside throttle window
      lastExecution = now;
      func(...args);
    }
  };
}