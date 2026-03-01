const LoadingPage = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <span className="text-xl font-bold text-gray-800 tracking-tight">
          Checkout
        </span>
      </div>

      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-indigo-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-1">
        <p className="text-sm font-semibold text-gray-700 tracking-wide uppercase">
          Cargando
        </p>
        <div className="flex gap-1 mt-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 animate-[shimmer_1.5s_infinite] bg-[length:200%_100%]" />
      </div>
    </div>
  );
};

export default LoadingPage;
