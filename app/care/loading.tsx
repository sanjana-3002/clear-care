export default function CareLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="h-8 w-40 bg-gray-100 rounded-lg animate-pulse mb-4" />
        <div className="flex gap-2 mb-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-5 w-20 bg-gray-100 rounded-full animate-pulse" />
          ))}
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full animate-pulse" />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="space-y-4">
          <div className="h-6 w-48 bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-72 bg-gray-100 rounded animate-pulse" />
          <div className="grid grid-cols-2 gap-3 mt-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
