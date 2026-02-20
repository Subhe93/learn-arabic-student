// API Configuration Constants
export const API_BASE_URL = 'https://learnarabic.iwings-digital.com';

// Stripe Configuration
export const STRIPE_PUBLIC_KEY = 'pk_test_51Sckb9HuHxSe9yWl3pHpQrHMRfWFBZupSK5dRicZON7rSh7hzgRttLObfrelYXnmnqB1EDL3P4a7eIpOMK9fDRMX00omkapLXJ';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  GET_USER_INFO: '/auth/info',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: (token) => `/auth/reset-password/${token}`,
  RESEND_CONFIRMATION: '/auth/resend-confirmation',
  
  // Student
  STUDENT_LEVELS: '/student/levels',
  STUDENT_LESSONS: '/student/lessons',
  STUDENT_UPCOMING_SESSIONS: '/student/sessions/upcoming',
  STUDENT_CERTIFICATES: '/student/certificates',
  STUDENT_AFFILIATE_REFERRALS: '/student/affiliate/referrals',
  
  // Assignments
  ASSIGNMENT_QUESTIONS: (assignmentId) => `/student/assignments/${assignmentId}/questions`,
  ASSIGNMENT_QUESTIONS_BY_TYPE: (type, id) => `/student/assignments/${type}/${id}/questions`,
  ASSIGNMENT_SUBMIT: '/student/assignments/submit',
  ASSIGNMENT_STATUS: (assignmentId) => `/student/assignments/${assignmentId}/status`,
  
  // Subscriptions
  SUBSCRIPTION_CURRENT: '/subscription/current',
  SUBSCRIPTION_PLANS: '/subscription/plans',
  SUBSCRIPTION_SUBSCRIBE: '/subscription/subscribe',
};

// Error Messages in Arabic
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'خطأ في الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.',
  UNAUTHORIZED: 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.',
  FORBIDDEN: 'ليس لديك صلاحية للوصول إلى هذا المورد.',
  NOT_FOUND: 'المورد المطلوب غير موجود.',
  SERVER_ERROR: 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً.',
  VALIDATION_ERROR: 'البيانات المدخلة غير صحيحة.',
  LOGIN_FAILED: 'فشل تسجيل الدخول. يرجى التحقق من البريد الإلكتروني وكلمة المرور.',
  REGISTER_FAILED: 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.',
  UNKNOWN_ERROR: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
  LOAD_DATA_FAILED: 'فشل تحميل البيانات. يرجى المحاولة مرة أخرى.',
};

// Success Messages in Arabic
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'تم تسجيل الدخول بنجاح',
  REGISTER_SUCCESS: 'تم إنشاء الحساب بنجاح',
  LOGOUT_SUCCESS: 'تم تسجيل الخروج بنجاح',
  UPDATE_SUCCESS: 'تم التحديث بنجاح',
  SUBMIT_SUCCESS: 'تم الإرسال بنجاح',
  PASSWORD_RESET_SUCCESS: 'تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني',
};

// Question Types
export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  SINGLE_CHOICE: 'single_choice',
  MULTIPLE_SELECT: 'multiple_select',
  DRAG_MATCH: 'drag_match',
  MATCHING: 'matching',
  SENTENCE_BUILDER: 'sentence_builder',
  WORD_ORDER: 'word_order',
  LISTEN_REPEAT: 'listen_repeat',
  AUDIO: 'audio',
  LETTER_BUILDER: 'letter_builder',
  LETTER_ORDER: 'letter_order',
  FILL_BLANK: 'fill_blank',
  IMAGE_DESCRIPTION: 'image_description',
  COPY_WORDS: 'copy_words',
  IMAGE_UPLOAD: 'image_upload',
  WRITING: 'writing',
  TEXT: 'text',
  READING_WRITING: 'reading_writing',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
};

