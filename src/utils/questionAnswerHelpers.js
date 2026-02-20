/**
 * Question Answer Helpers
 * مساعدات لإدارة أنواع الأسئلة والإجابات
 */

/**
 * تنسيق الإجابة حسب نوع السؤال
 * @param {string} questionType - نوع السؤال
 * @param {any} answer - الإجابة الخام
 * @returns {object} - الإجابة المنسقة للـ API
 */
export const formatAnswerForSubmission = (questionType, answer) => {
  if (!answer) return null;

  switch (questionType) {
    // Single/Multiple Choice Questions
    case "mcq_single":
    case "draw_circle_single":
    case "fill_sentence":
    case "select_image_text":
      return {
        selectedOptions: Array.isArray(answer) ? answer : [String(answer)],
      };

    case "mcq_multiple":
    case "draw_circle_multiple":
      return {
        selectedOptions: Array.isArray(answer)
          ? answer.map((a) => String(a))
          : [String(answer)],
      };

    // Drag & Match Questions
    case "match_image_text":
      return {
        matches: Array.isArray(answer)
          ? answer.map((match) => ({
              image: extractRelativePath(match.image),
              text: match.text,
            }))
          : [],
      };

    // Word Order Questions
    case "order_words":
      return {
        orderedWords: Array.isArray(answer) ? answer : [],
      };

    // Letter Composition Questions
    case "compose_word":
      // Send as complete word, not letters array
      if (typeof answer === "string") {
        return { word: answer };
      } else if (Array.isArray(answer)) {
        return { word: answer.join("") };
      }
      return { word: "" };

    // Word Breaking Questions
    case "break_word":
      if (Array.isArray(answer)) {
        return {
          letters: answer, // Send as array of letters
        };
      }
      return {
        letters: answer ? answer.split("") : [],
      };

    // Free Text Questions
    case "free_text":
      return {
        text: answer || "",
      };

    // Upload Questions
    case "free_text_upload":
      return {
        imageUrl: answer || "",
      };

    case "write_words":
      return {
        text: answer || "",
      };

    // Reading Confirmation
    case "read_question":
      return {
        text: answer || "read",
      };

    // Audio Recording Questions
    case "listen_repeat":
      return {
        audioUrl: answer || "",
      };

    default:
      return answer;
  }
};

/**
 * التحقق من صحة الإجابة مقارنة مع الإجابة الصحيحة
 * @param {string} questionType - نوع السؤال
 * @param {any} studentAnswer - إجابة الطالب
 * @param {object} questionContent - محتوى السؤال (يحتوي على الإجابات الصحيحة)
 * @returns {boolean} - هل الإجابة صحيحة؟
 */
export const checkAnswerCorrectness = (
  questionType,
  studentAnswer,
  questionContent
) => {
  if (!studentAnswer || !questionContent) return false;

  switch (questionType) {
    case "mcq_single":
    case "draw_circle_single":
    case "fill_sentence": {
      const correctOption = questionContent.options?.find(
        (opt) => opt.is_correct
      );
      if (!correctOption) return false;

      const answer = Array.isArray(studentAnswer)
        ? studentAnswer[0]
        : studentAnswer;
      return answer === correctOption.text;
    }

    case "mcq_multiple":
    case "draw_circle_multiple": {
      const correctOptions =
        questionContent.options
          ?.filter((opt) => opt.is_correct)
          .map((opt) => opt.text) || [];
      const answers = Array.isArray(studentAnswer)
        ? studentAnswer
        : [studentAnswer];

      if (correctOptions.length !== answers.length) return false;
      return correctOptions.every((opt) => answers.includes(opt));
    }

    case "select_image_text": {
      // Check if selected text matches the correct text
      const items = questionContent.items || [];

      if (items.length === 0) return false;

      // Find the correct text
      const correctText = items[0]?.correctText;
      if (!correctText) return false;

      // Get student's answer (could be array or string)
      const answer = Array.isArray(studentAnswer)
        ? studentAnswer[0]
        : studentAnswer;

      // Compare directly with the correct text (not with opt{index})
      return answer === correctText;
    }

    case "match_image_text": {
      const correctPairs = questionContent.pairs || [];
      const studentPairs = Array.isArray(studentAnswer) ? studentAnswer : [];

      if (correctPairs.length !== studentPairs.length) return false;

      return correctPairs.every((correctPair) => {
        // Compare by extracting relative path or filename
        const correctImage = correctPair.image;
        const match = studentPairs.find((sp) => {
          // sp.image might be full URL, need to compare with relative path
          if (!sp.image) return false;
          // Extract filename from both URLs for comparison
          const studentImagePath = sp.image.includes("/")
            ? sp.image.split("/").pop()
            : sp.image;
          const correctImagePath = correctImage.includes("/")
            ? correctImage.split("/").pop()
            : correctImage;
          return studentImagePath === correctImagePath;
        });
        return match && match.text === correctPair.text;
      });
    }

    case "order_words": {
      const correctOrder = questionContent.correctOrder || [];
      const studentOrder = Array.isArray(studentAnswer) ? studentAnswer : [];

      if (correctOrder.length !== studentOrder.length) return false;
      return correctOrder.every((word, index) => word === studentOrder[index]);
    }

    case "compose_word": {
      const correctWord = questionContent.correctWord || "";
      const studentWord = Array.isArray(studentAnswer)
        ? studentAnswer.join("")
        : studentAnswer;

      return studentWord === correctWord;
    }

    case "break_word": {
      const correctLetters = questionContent.correctLetters || [];
      const studentLetters =
        typeof studentAnswer === "string"
          ? studentAnswer.split("")
          : Array.isArray(studentAnswer)
          ? studentAnswer
          : [];

      if (correctLetters.length !== studentLetters.length) return false;
      return correctLetters.every(
        (letter, index) => letter === studentLetters[index]
      );
    }

    // Questions that require teacher review
    case "free_text":
    case "free_text_upload":
    case "write_words":
    case "read_question":
      // Reading questions are always "correct" if the student marked as read
      return studentAnswer === "read" || studentAnswer === true;

    case "listen_repeat":
      return null; // Cannot auto-check, requires teacher review

    default:
      return false;
  }
};

/**
 * الحصول على الإجابة الصحيحة للعرض
 * @param {string} questionType - نوع السؤال
 * @param {object} questionContent - محتوى السؤال
 * @returns {string|array|object|null} - الإجابة الصحيحة للعرض
 */
export const getCorrectAnswer = (questionType, questionContent) => {
  if (!questionContent) return null;

  switch (questionType) {
    case "mcq_single":
    case "draw_circle_single":
    case "fill_sentence": {
      const correctOption = questionContent.options?.find(
        (opt) => opt.is_correct
      );
      return correctOption ? correctOption.text : null;
    }

    case "mcq_multiple":
    case "draw_circle_multiple": {
      const correctOptions =
        questionContent.options
          ?.filter((opt) => opt.is_correct)
          .map((opt) => opt.text) || [];
      return correctOptions;
    }

    case "select_image_text": {
      // Return the correct text (not the ID) for display
      const items = questionContent.items || [];
      if (items.length > 0 && items[0]?.correctText) {
        return items[0].correctText;
      }
      return null;
    }

    case "match_image_text": {
      return questionContent.pairs || [];
    }

    case "order_words": {
      return questionContent.correctOrder || [];
    }

    case "compose_word": {
      return questionContent.correctWord || "";
    }

    case "break_word": {
      return questionContent.correctLetters || [];
    }

    // Questions that require teacher review - no automatic correct answer
    case "free_text":
    case "free_text_upload":
    case "write_words":
    case "read_question":
    case "listen_repeat":
      return null;

    default:
      return null;
  }
};

/**
 * التحقق من أن السؤال يحتاج إلى مراجعة المعلم
 * @param {string} questionType - نوع السؤال
 * @param {boolean} requiresTeacherReview - علامة من الـ API
 * @returns {boolean}
 */
export const requiresTeacherReview = (
  questionType,
  requiresTeacherReview = false
) => {
  const autoReviewTypes = [
    "free_text",
    "free_text_upload",
    "write_words",
    "listen_repeat",
  ];

  return requiresTeacherReview || autoReviewTypes.includes(questionType);
};

/**
 * الحصول على عنوان نوع السؤال بالعربية
 * @param {string} questionType - نوع السؤال
 * @returns {string}
 */
export const getQuestionTypeLabel = (questionType) => {
  const labels = {
    mcq_single: "اختيار من متعدد (إجابة واحدة)",
    mcq_multiple: "اختيار من متعدد (إجابات متعددة)",
    draw_circle_single: "ارسم دائرة (خيار واحد)",
    draw_circle_multiple: "ارسم دائرة (خيارات متعددة)",
    fill_sentence: "املأ الفراغ",
    select_image_text: "اختر النص المناسب للصورة",
    match_image_text: "وصل الصورة بالنص",
    order_words: "رتب الكلمات",
    compose_word: "ركب الكلمة",
    break_word: "حلل الكلمة",
    free_text: "إجابة نصية حرة",
    free_text_upload: "رفع صورة نص",
    write_words: "كتابة كلمات",
    read_question: "قراءة سؤال",
    listen_repeat: "استماع وتكرار",
  };

  return labels[questionType] || questionType;
};

/**
 * تحويل URL نسبي إلى URL كامل
 * @param {string} url - الـ URL النسبي
 * @param {string} baseUrl - الـ base URL
 * @returns {string}
 */
export const buildFullUrl = (
  url,
  baseUrl = "https://learnarabic.iwings-digital.com"
) => {
  if (!url) return "";
  // Handle non-string values
  if (typeof url !== 'string') {
    console.warn('buildFullUrl received non-string value:', url);
    return "";
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  // إضافة /uploads بين الدومين والمسار النسبي
  const cleanUrl = url.startsWith("/") ? url.slice(1) : url;
  return `${baseUrl}/uploads/${cleanUrl}`;
};

/**
 * تحويل URL كامل إلى URL نسبي (للإرسال إلى الـ API)
 * @param {string} fullUrl - الـ URL الكامل
 * @param {string} baseUrl - الـ base URL
 * @returns {string}
 */
export const extractRelativePath = (
  fullUrl,
  baseUrl = "https://learnarabic.iwings-digital.com"
) => {
  if (!fullUrl) return "";
  if (!fullUrl.startsWith("http://") && !fullUrl.startsWith("https://")) {
    return fullUrl;
  }
  // Remove base URL and leading slash
  let path = fullUrl.replace(baseUrl, "").replace(/^\//, "");
  // Remove /uploads/ prefix if it exists (API expects paths like images/xxx.webp)
  if (path.startsWith("uploads/")) {
    path = path.replace("uploads/", "");
  }
  return path;
};
