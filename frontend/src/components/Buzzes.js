import { React } from "react";

const Buzzes = (buzz) => {
  const b = buzz.buzz;
  return (
    <div className="" onClick={buzz.onClick}>
      <div className="block m-10 rounded-md bg-white p-6 hover:bg-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
        <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800">
          {b.name}
          <span className="text-gray-400"> @{b.username}</span>
        </h5>
        <p className="mb-4 text-base text-neutral-600">{b.message}</p>
      </div>
    </div>
  );
};

export default Buzzes;
