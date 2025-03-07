import { GiFullMetalBucketHandle } from "react-icons/gi";

interface BucketsEmptyStateProps {}

const BucketsEmptyState: React.FC<BucketsEmptyStateProps> = ({}) => {
  return (
    <div className="py-10 flex items-center justify-center font-inter">
      <div className="flex flex-col items-center">
        <div className="p-5 bg-gradient-to-b from-gray-200 to-white rounded-full">
          <GiFullMetalBucketHandle className="text-6xl text-gray-700" />
        </div>
        <div className="flex flex-col items-center mt-5">
          <p className="text-xl font-[600] text-[#101828]">
            {"Buckets Not found"}
          </p>
          <p className="text-center font-[400] w-[450px] text-[16px] text-gray-600 mt-2">
            Hey, your store doesn't seem to have any{" "}
            <span className="underline decoration-gray-600">buckets</span>,
            {` Let's begin by adding some buckets to get you prepped for rush hours !!.`}
          </p>
        </div>
      </div>
    </div>
  );
};
export default BucketsEmptyState;
