import { Input } from "@/components/ui/input";

interface BucketSearchProps {
  setSearchFilter: (value: string) => void;
}

const BucketSearch: React.FC<BucketSearchProps> = ({ setSearchFilter }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilter(event.target.value);
  };
  return (
    <div className="ml-1">
      <Input
        type="text"
        placeholder="Search bucket by product"
        onChange={handleInputChange}
        className="transition-all duration-300 ease-in-out w-80"
      />
    </div>
  );
};

export default BucketSearch;
