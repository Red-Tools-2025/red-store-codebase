import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CiClock2 } from "react-icons/ci";

interface ScheduleEntry {
  countdownTime: number;
  loadingType: string;
}

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleMap: Map<string, ScheduleEntry>;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  scheduleMap,
}) => {
  // Local state to store a copy of scheduleMap
  const [localSchedule, setLocalSchedule] = useState<
    Array<[string, ScheduleEntry]>
  >([]);

  useEffect(() => {
    if (isOpen) {
      // Convert Map to an array and store it in state
      setLocalSchedule(Array.from(scheduleMap.entries()));
    }
  }, [isOpen, scheduleMap]); // Update when modal opens or scheduleMap changes

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[650px] font-inter">
        <DialogHeader>
          <DialogTitle>Scheduled Bucket Actions</DialogTitle>
          <DialogDescription>
            A list of upcoming bucket activations and completions.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 pt-2">
          {localSchedule.length > 0 ? (
            <ScrollArea className="w-full max-h-[300px] border rounded-md">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2 text-left">Bucket ID</th>
                    <th className="border p-2 text-left">Action</th>
                    <th className="border p-2 text-left">Countdown</th>
                  </tr>
                </thead>
                <tbody>
                  {localSchedule.map(
                    ([key, { countdownTime, loadingType }]) => {
                      const bucketId = key.split("-")[1]; // Extract bucket ID
                      return (
                        <tr key={key} className="border">
                          <td className="border p-2">{`B-#${bucketId}`}</td>
                          <td className="border p-2 capitalize">
                            {loadingType}
                          </td>
                          <td className="border p-2 flex items-center gap-2 text-blue-600 bg-blue-100 px-2 rounded-md">
                            <CiClock2 />
                            {`${Math.floor(countdownTime / 3600000)} hr 
                            ${Math.floor(
                              (countdownTime % 3600000) / 60000
                            )} min 
                            ${Math.floor((countdownTime % 60000) / 1000)} sec`}
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          ) : (
            <p className="text-gray-500 text-center">No scheduled actions</p>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleModal;
