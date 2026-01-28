export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <h1 className="text-xl font-semibold text-gray-700">
          Loading, please wait...
        </h1>
      </div>
    </div>
  );
}
