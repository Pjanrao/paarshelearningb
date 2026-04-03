
const PreLoader = () => {
  return (
    <div className="fixed left-0 top-0 z-999999 flex h-screen w-screen items-center justify-center bg-white">
      <div className="relative flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>
      </div>
    </div>
  );
};

export default PreLoader;