const SkeletonLoader = () => {
  return (
    <div className="w-full flex flex-col items-center pt-4 bg-zinc-900 text-white">
      <div className="w-full flex flex-col md:flex-row items-center pt-4 bg-zinc-900 text-white w-3/4 rounded-lg p-1 sm:p-4 md:p-6 text-center drop-shadow-md">
        <div className="flex p-10 rounded-lg items-center">
          <div className="animate-pulse bg-zinc-700 rounded-lg h-40 w-32" />
        </div>
        <div className="w-full flex flex-col items-center pt-4 text-white w-50 rounded-lg p-5 drop-shadow-md border border-zinc-800">
          <div className="animate-pulse bg-zinc-700 h-8 w-3/4 mb-4 rounded" />
          <div className="animate-pulse bg-zinc-700 h-6 w-1/2 mb-2 rounded" />
          <div className="animate-pulse bg-zinc-700 h-6 w-1/3 mb-2 rounded" />
          <div className="animate-pulse bg-zinc-700 h-6 w-2/3 mb-4 rounded" />
          <div className="animate-pulse bg-zinc-700 h-10 w-80 mb-4 rounded" />
        </div>
      </div>
      <div className="w-full mt-4 flex flex-col border-t py-2">
        <h2 className="animate-pulse bg-zinc-700 h-8 w-1/2 mb-4 rounded"></h2>
        <div className="flex flex-col sm:flex-row items-center flex-wrap justify-center p-1 sm:p-4 rounded-lg">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-zinc-700 rounded-lg mb-2 flex flex-col py-4 mx-4 items-center w-52 h-64"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default SkeletonLoader;
