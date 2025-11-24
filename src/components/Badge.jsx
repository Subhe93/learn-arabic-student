function Badge({ points, rewards }) {
  return (
    <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 inline-block">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">شارة عرض النقاط والمكافآت</h3>
      <div className="text-sm text-gray-700">
        <p>النقاط: {points || 0}</p>
        <p>المكافآت: {rewards || 0}</p>
      </div>
    </div>
  )
}

export default Badge

