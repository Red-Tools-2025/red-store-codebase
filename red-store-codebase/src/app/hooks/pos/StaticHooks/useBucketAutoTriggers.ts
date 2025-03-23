import { Bucket } from "@prisma/client";
import { useState, useEffect, useRef } from "react";

type LoadingType = "activate" | "finish";

interface ScheduleEntry {
  targetTime: number;
  countdownTime: number;
  loadingType: LoadingType;
  isLoading: boolean;
}

const useBucketAutoTrigger = (
  buckets: Bucket[],
  handleActivate: (bucketId: number, storeId: number) => Promise<void>,
  handleFinish: (bucketId: number, storeId: number) => Promise<void>,
  handleRefreshBuckets: () => void
) => {
  const [scheduleMap, setScheduleMap] = useState<Map<string, ScheduleEntry>>(
    new Map()
  );
  const timerRefs = useRef(new Map<string, number>());

  // Interval to update countdowns without re-rendering infinitely
  useEffect(() => {
    const interval = setInterval(() => {
      setScheduleMap((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.forEach((entry, key) => {
          const newCountdown = Math.max(0, entry.targetTime - Date.now());
          newMap.set(key, { ...entry, countdownTime: newCountdown });
        });
        return newMap;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Effect to set up auto-activation & auto-finishing
  useEffect(() => {
    if (!buckets || buckets.length === 0) return;

    const newEntries = new Map(scheduleMap); // Copy current schedule

    buckets.forEach((bucket) => {
      // Activation Logic
      const activationKey = `activation-${bucket.bucketId}-${bucket.storeId}`;
      if (
        !["ACTIVE", "COMPLETED", "FINISHED"].includes(bucket.status) &&
        bucket.scheduledTime
      ) {
        const targetTime = new Date(bucket.scheduledTime).getTime();
        const delay = targetTime - Date.now();

        if (!newEntries.has(activationKey)) {
          newEntries.set(activationKey, {
            targetTime,
            countdownTime: delay,
            loadingType: "activate",
            isLoading: false,
          });

          if (delay > 0) {
            const timerId = window.setTimeout(() => {
              triggerAction(
                handleActivate,
                activationKey,
                bucket.bucketId,
                bucket.storeId,
                "activate"
              );
            }, delay);
            timerRefs.current.set(activationKey, timerId);
          } else {
            triggerAction(
              handleActivate,
              activationKey,
              bucket.bucketId,
              bucket.storeId,
              "activate"
            );
          }
        }
      }

      // Finishing Logic
      const finishKey = `finish-${bucket.bucketId}-${bucket.storeId}`;
      if (bucket.status === "ACTIVE" && bucket.activationTime) {
        const targetTime =
          new Date(bucket.activationTime).getTime() + bucket.duration * 1000;
        const delay = targetTime - Date.now();

        if (!newEntries.has(finishKey)) {
          newEntries.set(finishKey, {
            targetTime,
            countdownTime: delay,
            loadingType: "finish",
            isLoading: false,
          });

          if (delay > 0) {
            const timerId = window.setTimeout(() => {
              triggerAction(
                handleFinish,
                finishKey,
                bucket.bucketId,
                bucket.storeId,
                "finish"
              );
            }, delay);
            timerRefs.current.set(finishKey, timerId);
          } else {
            triggerAction(
              handleFinish,
              finishKey,
              bucket.bucketId,
              bucket.storeId,
              "finish"
            );
          }
        }
      }
    });

    // Only update if there are changes (prevents unnecessary re-renders)
    setScheduleMap((prevMap) =>
      prevMap.size !== newEntries.size ? newEntries : prevMap
    );

    return () => {
      // Cleanup timers
      timerRefs.current.forEach((timerId, key) => {
        if (!newEntries.has(key)) clearTimeout(timerId);
      });
      timerRefs.current.clear();
    };
  }, [buckets]); // Removed handleActivate & handleFinish to avoid unnecessary resets

  // Function to execute activation/finishing
  const triggerAction = async (
    actionFn: (bucketId: number, storeId: number) => Promise<void>,
    key: string,
    bucketId: number,
    storeId: number,
    loadingType: LoadingType
  ) => {
    console.log({ loadingType });
    setScheduleMap((prev) => {
      const newMap = new Map(prev);
      if (newMap.has(key)) {
        newMap.set(key, { ...newMap.get(key)!, isLoading: true });
      }
      return newMap;
    });

    await actionFn(bucketId, storeId); // Wait for async action

    setScheduleMap((prev) => {
      const newMap = new Map(prev);
      newMap.delete(key);
      return newMap;
    });

    timerRefs.current.delete(key);

    handleRefreshBuckets();
  };

  return scheduleMap;
};

export default useBucketAutoTrigger;
