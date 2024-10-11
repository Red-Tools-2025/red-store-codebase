import { Dispatch, SetStateAction } from "react";

const useLoginStaticHook = () => {
  // handleInput only for string feild types
  const handleInputChange = (
    inputState: string,
    setInputState: Dispatch<SetStateAction<string>>
  ) => {
    setInputState(inputState);
    console.log(inputState); // comment out later
  };
  return { handleInputChange };
};

export default useLoginStaticHook;
