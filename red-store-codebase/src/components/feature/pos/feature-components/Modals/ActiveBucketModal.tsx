import { usePos } from "@/app/contexts/pos/PosContext";
import useBucketServerActions from "@/app/hooks/pos/ServerHooks/useBucketServerActions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollBar, ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { CiClock2 } from "react-icons/ci";

interface ActiveBucketModalProps {
  isOpen: boolean;
  onClose: () => void;
  activateId: {
    bucket_id: number;
    store_id: number;
  } | null;
}

const ActiveBucketModal: React.FC<ActiveBucketModalProps> = ({
  onClose,
  isOpen,
  activateId,
}) => {
  const { bucketMap, handleRefreshBuckets } = usePos();
  const { finishError, isFinishing, handleFinish } = useBucketServerActions();
  const details = activateId ? bucketMap.get(activateId.bucket_id) : undefined;
  const durationInSeconds = details ? details.duration : 0;

  // State to store the remaining time
  const [timeLeft, setTimeLeft] = useState(durationInSeconds);

  useEffect(() => {
    if (!details) return;

    const triggerTime = details.activationTime
      ? new Date(details.activationTime).getTime() + durationInSeconds * 1000
      : 0; // Target trigger time
    const updateClock = () => {
      const currentTime = Date.now();
      const newTimeLeft = Math.max(
        0,
        Math.floor((triggerTime - currentTime) / 1000)
      );

      setTimeLeft(newTimeLeft);

      if (newTimeLeft > 0) {
        setTimeout(updateClock, Math.min(newTimeLeft * 1000, 1000)); // Dynamic update
      }
    };

    updateClock(); // Start the clock

    return () => clearTimeout(updateClock as unknown as number); // Cleanup on unmount
  }, [details, durationInSeconds]);

  const processFinish = async (bucket_id: number, store_id: number) => {
    await handleFinish(bucket_id, store_id);
    onClose();
    handleRefreshBuckets();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] font-inter">
        <DialogHeader>
          <DialogTitle>Bucket Activation</DialogTitle>
          {finishError && (
            <p className="text-sm text-red-500 mt-1">{finishError}</p>
          )}
          <DialogDescription>
            Details on your active bucket modal, for{" "}
            {details?.inventory?.invItem}
          </DialogDescription>
          <div className="flex flex-col gap-1 pt-2">
            {details ? (
              <ScrollArea className="w-[450px] border-none whitespace-nowrap rounded-md border">
                <div className="flex w-max space-x-4">
                  <div key={details.bucketId} className="w-full pb-2">
                    <div className="text-sm flex flex-row items-center gap-8 py-2 border border-gray-300 border-t-1 border-b-1 border-r-0 border-l-0 whitespace-nowrap">
                      <p>{`B-#${details.bucketId}`}</p>
                      <p>{details.inventory?.invItem}</p>
                      <p className="text-xs py-1 text-black px-2 border border-gray-300 rounded-sm bg-gray-100">
                        {details.inventory?.invItemBrand}
                      </p>
                      <p
                        className={`text-xs py-1 text-black px-2 border border-gray-300 rounded-sm bg-gray-100`}
                      >
                        {`In stock → ${details.inventory?.invItemStock}`}
                      </p>
                    </div>
                  </div>
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            ) : null}
            <div className="text-sm flex flex-row justify-between pb-1">
              <div className="flex flex-row gap-2">
                <p className="px-2 py-1 border border-gray-300 rounded-sm bg-gray-100">
                  {`${Math.floor((details?.duration ?? 0) / 3600)} hr`}
                </p>
                <p className="px-2 py-1 border border-gray-300 rounded-sm bg-gray-100">{`${
                  details?.bucketSize === "FIFTY" ? "Mini" : "Large"
                } Bucket`}</p>
              </div>
              <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-blue-100 border border-blue-600 text-blue-600">
                <CiClock2 />
                <p>
                  {`${Math.floor(timeLeft / 3600)} hr ${Math.floor(
                    (timeLeft % 3600) / 60
                  )} min ${timeLeft % 60} sec`}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button
            disabled={!details || isFinishing}
            onClick={() =>
              void processFinish(
                details?.bucketId as number,
                details?.storeId as number
              )
            }
          >
            {isFinishing ? "Updating status...." : "Mark as Finished"}
          </Button>
          <Button onClick={onClose} variant="secondary">
            Exit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActiveBucketModal;
