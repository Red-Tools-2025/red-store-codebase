import BucketTable from "../Tables/BucketsTable";
import { Bucket, Inventory } from "@prisma/client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import BucketsEmptyState from "./EmptyState";
import { usePos } from "@/app/contexts/pos/PosContext";

interface BucketDisplayProps {
  buckets: (Bucket & { inventory: Inventory | null })[];
  isFetching: boolean;
  fetchError: string;
}

const loadingMessages = [
  "Loading Buckets... Sit tight! ⏳",
  "Fetching the latest buckets... 🚀",
  "Just a moment, preparing your buckets! 📦",
  "Buckets incoming! Hang on... 🔄",
];

const BucketDisplay: React.FC<BucketDisplayProps> = ({
  buckets,
  fetchError,
  isFetching,
}) => {
  const [index, setIndex] = useState(0);
  const { bucketMap } = usePos();

  // console.log(bucketMap);

  useEffect(() => {
    if (isFetching) {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2000); // Change message every 2 seconds

      return () => clearInterval(interval);
    }
  }, [isFetching]);

  return (
    <div className="flex flex-col gap-1">
      <Toaster />
      {!buckets || buckets.length === 0 ? (
        <BucketsEmptyState />
      ) : (
        <>
          {isFetching ? (
            <AnimatePresence mode="wait">
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                {loadingMessages[index]}
              </motion.p>
            </AnimatePresence>
          ) : fetchError ? (
            <p className="text-red-500">
              Something went wrong while fetching buckets 😞
            </p>
          ) : (
            <BucketTable buckets={buckets} />
          )}
        </>
      )}
    </div>
  );
};

export default BucketDisplay;
