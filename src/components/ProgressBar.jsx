function ProgressBar() {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">شريط التقدم الأفقي</h3>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
      </div>
    </div>
  )
}

export default ProgressBar

