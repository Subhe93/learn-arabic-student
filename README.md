# تطبيق تعلم اللغة العربية - الطالب

تطبيق ويب لتعلم اللغة العربية مبني بـ React و Vite.

## التقنيات المستخدمة

- React 18
- Vite
- React Router
- Tailwind CSS

## التثبيت والتشغيل

```bash
# تثبيت الحزم
yarn install

# تشغيل المشروع في وضع التطوير
yarn dev

# بناء المشروع للإنتاج
yarn build

# معاينة البناء
yarn preview
```

## هيكل المشروع

### الصفحات

- `src/pages/LoginPage.jsx` - صفحة تسجيل الدخول
- `src/pages/SignupPage.jsx` - صفحة تسجيل الاشتراك
- `src/pages/ProfilePage.jsx` - صفحة الملف الشخصي وإدارة الحساب
- `src/pages/CoursesPage.jsx` - قائمة الدورات والمستويات المتاحة
- `src/pages/LearningContainerPage.jsx` - الحاوية الرئيسية للتعلم

### المكونات العامة

- `src/components/TopNavBar.jsx` - شريط التنقل العلوي
- `src/components/Sidebar.jsx` - القائمة الجانبية لدروس المستوى
- `src/components/ProgressBar.jsx` - شريط التقدم الأفقي
- `src/components/Button.jsx` - مكون الأزرار العامة
- `src/components/Badge.jsx` - شارة عرض النقاط والمكافآت

### مكونات الأسئلة

- `src/components/questions/MultipleChoiceQuestion.jsx` - سؤال اختيار الإجابة الصحيحة
- `src/components/questions/DragDropQuestion.jsx` - سؤال سحب وإفلات
- `src/components/questions/ArrangeQuestion.jsx` - سؤال ترتيب الكلمات
- `src/components/questions/FillBlankQuestion.jsx` - سؤال إكمال الجملة
- `src/components/questions/ImageDescriptionQuestion.jsx` - سؤال وصف الصورة
- `src/components/questions/EssayQuestion.jsx` - سؤال كتابة نص تعبيري
- `src/components/questions/ReadingComprehensionQuestion.jsx` - سؤال القراءة والفهم
- `src/components/questions/AudioRecordingQuestion.jsx` - سؤال الاستماع والتسجيل
- `src/components/questions/ImageUploadQuestion.jsx` - سؤال إرفاق صورة

### مكونات المحتوى

- `src/components/content/VideoPlayer.jsx` - مشغل الفيديو المضمن
- `src/components/content/CertificateDisplay.jsx` - عرض الشهادة

## ربط APIs

تم ربط جميع واجهات المستخدم مع APIs الخادم:

### APIs المتصلة:

1. **المصادقة (Auth)**
   - تسجيل الدخول (`/auth/login`)
   - التسجيل (`/auth/register`)
   - تسجيل الخروج (`/auth/logout`)
   - معلومات المستخدم (`/auth/info`)
   - استعادة كلمة المرور (`/auth/forgot-password`)

2. **الطالب (Student)**
   - المستويات (`/student/levels`)
   - الدروس (`/student/lessons?levelId={id}`)
   - الجلسات القادمة (`/student/sessions/upcoming`)
   - الشهادات (`/student/certificates`)
   - الإحالات التسويقية (`/student/affiliate/referrals`)

3. **التدريبات (Assignments)**
   - الحصول على أسئلة التمرين (`/student/assignments/{id}/questions`)
   - إرسال الإجابات (`/student/assignments/submit`)
   - حالة التمرين (`/student/assignments/{id}/status`)

4. **الاشتراكات (Subscriptions)**
   - الاشتراك الحالي (`/subscription/current`)

### الملفات الرئيسية:

- `src/services/api.js` - إعدادات axios والاعتراضات
- `src/services/authService.js` - خدمات المصادقة
- `src/services/studentService.js` - خدمات الطالب
- `src/config/api.js` - إعدادات API الأساسية

### ملاحظات:

- جميع طلبات GET تستخدم Bearer token للمصادقة
- طلبات POST تستخدم `application/json` أو `application/x-www-form-urlencoded` حسب الحاجة
- معالجة الأخطاء تلقائية مع إعادة التوجيه للصفحة الرئيسية عند انتهاء الجلسة