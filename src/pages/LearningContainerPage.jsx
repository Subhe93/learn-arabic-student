import TopNavBar from '../components/TopNavBar'
import Sidebar from '../components/Sidebar'
import ProgressBar from '../components/ProgressBar'

function LearningContainerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavBar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 container mx-auto px-4 py-8">
          <ProgressBar />
          <h1 className="text-3xl font-bold text-gray-900 mb-6">الحاوية الرئيسية للتعلم</h1>
          <p className="text-gray-600">تعرض المحتوى المشترك والأنشطة أو الشهادة</p>
        </div>
      </div>
    </div>
  )
}

export default LearningContainerPage

