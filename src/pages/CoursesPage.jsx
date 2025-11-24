import TopNavBar from '../components/TopNavBar'

function CoursesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">قائمة الدورات والمستويات المتاحة</h1>
      </div>
    </div>
  )
}

export default CoursesPage

