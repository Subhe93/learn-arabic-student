function CertificateDisplay() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-900 mb-4">عرض الشهادة</h3>
      <p className="text-gray-600 mb-4">يعرض تصميم الشهادة عند اكتمال المستوى</p>
      <div className="border-2 border-yellow-400 rounded-lg p-8 bg-gradient-to-br from-yellow-50 to-yellow-100">
        <div className="text-center">
          <h4 className="text-2xl font-bold text-gray-900 mb-2">شهادة الإنجاز</h4>
          <p className="text-gray-700">تم إكمال المستوى بنجاح</p>
        </div>
      </div>
    </div>
  )
}

export default CertificateDisplay

