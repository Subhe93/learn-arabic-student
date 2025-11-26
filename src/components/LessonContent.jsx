import React, { useState } from 'react';
import levelOneImg from '../assets/images/levelone1.png';
import bookImg from '../assets/images/book.png';
import MultipleChoiceQuestion from './questions/MultipleChoiceQuestion';
import DragMatchQuestion from './questions/DragMatchQuestion';
import SentenceBuilderQuestion from './questions/SentenceBuilderQuestion';
import ListenRepeatQuestion from './questions/ListenRepeatQuestion';
import CopyWordsQuestion from './questions/CopyWordsQuestion';
import LetterBuilderQuestion from './questions/LetterBuilderQuestion';
import FillBlankQuestion from './questions/FillBlankQuestion';
import ImageDescriptionQuestion from './questions/ImageDescriptionQuestion';
import WritingQuestion from './questions/WritingQuestion';
import ReadingWritingQuestion from './questions/ReadingWritingQuestion'; // Import new component

// Images for Matching
import img3 from '../assets/images/image 3.png';
import img4 from '../assets/images/image 4.png';
import img5 from '../assets/images/image 5.png';
import img6 from '../assets/images/image 6.png';
import img7 from '../assets/images/image 7.png';
import img8 from '../assets/images/image 8.png';
import img10 from '../assets/images/image 10.png';
import game4Img from '../assets/images/game4.png';
import penIcon from '../assets/icons/pen-line.svg';
import playIcon from '../assets/icons/Play.svg';
import sendIcon from '../assets/icons/send.svg';

const LessonContent = ({ activeTab }) => {
    const [q1Answer, setQ1Answer] = useState(null);
    const [q2Answer, setQ2Answer] = useState(null);

    // Pagination State for Exercises & Games
    const [currentExercise, setCurrentExercise] = useState(1);
    const [currentGame, setCurrentGame] = useState(1);

    // State for Drag and Drop (Exercise 1)
    const [rightItems, setRightItems] = useState([
        { id: 'r1', type: 'image', content: img6 },
        { id: 'r2', type: 'image', content: img7 },
        { id: 'r3', type: 'image', content: img4 },
    ]);

    const [leftItems, setLeftItems] = useState([
        { id: 'l1', type: 'image', content: img5 },
        { id: 'l2', type: 'image', content: img3 },
        { id: 'l3', type: 'image', content: img8 },
    ]);

    // Data for Sentence Builder (Exercise 2)
    const sentenceWords = [
        { id: 'word1', text: 'الجبن' },
        { id: 'word2', text: 'يحب' },
        { id: 'word3', text: 'الفأر' },
    ];

    if (activeTab === 'حرف الجيم') {
        return (
            <>
                {/* Illustration Image */}
                <div className="w-full max-w-3xl mb-10 text-center">
                    <img
                        src={levelOneImg}
                        alt="Letter Jeem Lesson"
                        className="w-full h-auto object-contain mx-auto"
                    />
                </div>

                {/* Story Text - Updated Typography */}
                <div className="w-full text-right font-bold text-gray-800 space-y-4 font-scheherazade px-4" style={{ fontSize: '39px', lineHeight: '79px' }}>
                    {[
                        "كان هُناك رَجُلٌ يُدعى جَابِر ،",
                        "كان جَابِرٌ يَرعى الجِمَالَ في الوادِي ، وذاتَ",
                        "يَومٍ نَامَ جَابِرٌ تَحتَ شَجَرَةٍ ،",
                        "فَهَربَت جِمَالُ جَابِرٍ إلى جَبَلٍ مُجاوِرٍ لِلوادِي"
                    ].map((line, index) => (
                        <p key={index}>
                            {line.split(/(ج)/g).map((part, partIndex) =>
                                part === 'ج' ? <span key={partIndex} style={{ color: 'red' }}>ج</span> : part
                            )}
                        </p>
                    ))}
                </div>
            </>
        );
    }

    if (activeTab === 'فيديو تدريبي') {
        return (
            <div className="w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden shadow-lg relative group">
                {/* Video Placeholder */}
                <div className="relative w-full aspect-video bg-gray-800 flex items-center justify-center">
                    <img src={levelOneImg} alt="Video Thumbnail" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm cursor-pointer hover:scale-110 transition-transform">
                            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                    </div>
                </div>

                {/* Video Controls Bar */}
                <div className="bg-white px-4 py-3 flex items-center gap-4" dir="ltr">
                    {/* ... (Controls kept same) ... */}
                    <button className="text-gray-600 hover:text-gray-900">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                    </button>
                    <div className="flex-1 mx-2 relative h-1.5 bg-gray-200 rounded-full cursor-pointer group-hover:h-2 transition-all">
                        <div className="absolute left-0 top-0 bottom-0 w-[30%] bg-[#10B981] rounded-full relative">
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-[#059669] rounded-full shadow"></div>
                        </div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">7:24</span>
                    <button className="text-gray-600 hover:text-gray-900">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    }

    if (activeTab === 'الكتاب') {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <img
                    src={bookImg}
                    alt="الكتاب"
                    className="w-full h-full object-fill rounded-lg shadow-md"
                />
            </div>
        );
    }

    if (activeTab === 'تدريبات') {
        // ... (Exercise contents remain unchanged) ...
        // Exercise 1 Content
        const renderExercise1 = () => {
            const q1Options = [
                { id: 'm', label: 'م', isCorrect: false },
                { id: 't', label: 'ت', isCorrect: false },
                { id: 'j', label: 'ج', isCorrect: true },
                { id: 'kh', label: 'ح', isCorrect: false },
            ];

            const q2Options = [
                { id: 'b', label: 'ب', isCorrect: true },
                { id: 'm', label: 'م', isCorrect: false },
                { id: 's', label: 'ص', isCorrect: false },
                { id: 't', label: 'ت', isCorrect: false },
            ];

            return (
                <div className="w-full">
                    {/* Section Header for Multiple Choice */}
                    <div className="flex justify-start mb-4 w-full">
                        <div className="bg-[#5b72c4] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md">
                            <img src={penIcon} alt="Question" className="w-5 h-5 brightness-0 invert" />
                            <span className="font-bold">اختر الاجابة الصحيحة</span>
                        </div>
                    </div>

                    {/* Question 1 */}
                    <MultipleChoiceQuestion
                        questionText="اين هوا حرف (الجيم) من بين الحروف التالية:"
                        options={q1Options}
                        selectedOptionId={q1Answer}
                        onOptionSelect={setQ1Answer}
                    />

                    {/* Question 2 */}
                    <MultipleChoiceQuestion
                        questionText="اين هوا حرف (الباء) من بين الحروف التالية:"
                        options={q2Options}
                        selectedOptionId={q2Answer}
                        onOptionSelect={setQ2Answer}
                    />

                    {/* Matching Section */}
                    <div className="w-full">
                        <DragMatchQuestion
                            rightItems={rightItems}
                            leftItems={leftItems}
                            onUpdateLeftItems={setLeftItems}
                            onUpdateRightItems={setRightItems}
                        />
                    </div>
                </div>
            );
        };

        // Exercise 2 Content
        const renderExercise2 = () => {
            return (
                <div className="w-full">
                    <div className="flex justify-start mb-4 w-full">
                        <div className="bg-[#5b72c4] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md">
                            <img src={penIcon} alt="Question" className="w-5 h-5 brightness-0 invert" />
                            <span className="font-bold">ركب الكلمات</span>
                        </div>
                    </div>
                    <div className="w-full">
                        <SentenceBuilderQuestion
                            questionText="اين هوا حرف (الجيم) من بين الحروف التالية:"
                            initialWords={sentenceWords}
                        />
                        <SentenceBuilderQuestion
                            questionText="اين هوا حرف (الجيم) من بين الحروف التالية:"
                            initialWords={sentenceWords}
                        />
                        <SentenceBuilderQuestion
                            questionText="اين هوا حرف (الجيم) من بين الحروف التالية:"
                            initialWords={sentenceWords}
                        />
                    </div>

                </div>
            );
        };

        // Exercise 3 Content
        const renderExercise3 = () => {
            return (
                <div className="w-full">
                    {/* Header for Exercise 3 */}
                    <div className="flex justify-start mb-4 w-full">
                        <div className="bg-[#5b72c4] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md">
                            <img src={playIcon} alt="Listen" className="w-5 h-5 brightness-0 invert" />
                            <span className="font-bold">استمع ثم اردد</span>
                        </div>
                    </div>

                    <div className="w-full">
                        {/* Q1: Text */}
                        <ListenRepeatQuestion
                            questionText="اسمع الى النص التالي ثم قم بترديد ما تسمعه"
                            content="مرحبا انا اسمي ماجد، ما اسمك انت"
                            contentType="text"
                        />

                        {/* Q2: Audio */}
                        <ListenRepeatQuestion
                            questionText="اسمع الي الصوت التالي ثم قم بترديد ما تسمعه"
                            content="audio_placeholder"
                            contentType="audio"
                        />

                        {/* Q3: Image */}
                        <ListenRepeatQuestion
                            questionText="اسمع الي الصوت التالي ثم قم بترديد ما تسمعه"
                            content={img10}
                            contentType="image"
                        />
                    </div>
                </div>
            );
        };

        // Navigation Buttons
        const renderNavigation = () => (
            <div className="flex justify-between w-full mt-8 border-t pt-4">
                <button
                    onClick={() => setCurrentExercise(prev => Math.max(prev - 1, 1))}
                    disabled={currentExercise === 1}
                    className={`px-6 py-2 rounded-full font-bold transition-colors ${currentExercise === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#5b72c4] text-white hover:bg-[#4a61b0]'}`}
                >
                    السابق
                </button>

                <span className="font-bold text-gray-600 flex items-center">
                    تدريب {currentExercise} من 3
                </span>

                <button
                    onClick={() => setCurrentExercise(prev => Math.min(prev + 1, 3))}
                    disabled={currentExercise === 3}
                    className={`px-6 py-2 rounded-full font-bold transition-colors ${currentExercise === 3 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#5b72c4] text-white hover:bg-[#4a61b0]'}`}
                >
                    التالي
                </button>
            </div>
        );

        return (
            <div className="w-full px-4 pb-10 flex flex-col items-start" dir="rtl">
                {currentExercise === 1 && renderExercise1()}
                {currentExercise === 2 && renderExercise2()}
                {currentExercise === 3 && renderExercise3()}

                {renderNavigation()}
            </div>
        );
    }

    if (activeTab === 'العاب') {
        // Game 1 Content
        const renderGame1 = () => {
            const words1 = ['برتقال', 'سيارة', 'طاولة'];
            const words2 = ['برتقال', 'سيارة', 'طاولة'];

            return (
                <div className="w-full">
                     {/* Header for Games */}
                     <div className="flex justify-start mb-4 w-full">
                        <div className="bg-[#5b72c4] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md">
                            <img src={penIcon} alt="Game" className="w-5 h-5 brightness-0 invert" />
                            <span className="font-bold">تدريب النسخ</span>
                        </div>
                    </div>

                    <div className="w-full">
                        <CopyWordsQuestion 
                            questionText="اكتب الكلمات التالية على الورقة ثم قم بتصويرها ورفعها"
                            words={words1}
                        />
                        <CopyWordsQuestion 
                            questionText="اكتب الكلمات التالية على الورقة ثم قم بتصويرها ورفعها"
                            words={words2}
                        />
                    </div>
                </div>
            );
        };

        // Game 2 Content
        const renderGame2 = () => {
            const letters = [
                { id: 'l1', text: 'ا' },
                { id: 'l2', text: 'ة' },
                { id: 'l3', text: 'ر' },
                { id: 'l4', text: 'ي' },
                { id: 'l5', text: 'س' },
            ];

            return (
                <div className="w-full">
                     {/* Header for Game 2 */}
                     <div className="flex justify-start mb-4 w-full">
                        <div className="bg-[#5b72c4] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md">
                            <img src={penIcon} alt="Game" className="w-5 h-5 brightness-0 invert" />
                            <span className="font-bold">تركيب الاحرف</span>
                        </div>
                    </div>

                    <div className="w-full">
                        <LetterBuilderQuestion 
                            questionText="ركب الاحرف التالية لتكوين جملة"
                            initialLetters={letters}
                            correctSentence="سيارة"
                        />
                         <LetterBuilderQuestion 
                            questionText="ركب الاحرف التالية لتكوين جملة"
                            initialLetters={letters}
                            correctSentence="سيارة"
                        />
                         <LetterBuilderQuestion 
                            questionText="ركب الاحرف التالية لتكوين جملة"
                            initialLetters={letters}
                            correctSentence="سيارة"
                        />
                    </div>
                </div>
            );
        };

        // Game 3 Content
        const renderGame3 = () => {
            const options = [
                { id: 'opt1', label: 'الشارع', isCorrect: false },
                { id: 'opt2', label: 'الحديقة', isCorrect: false },
                { id: 'opt3', label: 'للمدرسة', isCorrect: true }, // Assuming correct answer based on "go to school" context
            ];

            return (
                <div className="w-full">
                     {/* Header for Game 3 */}
                     <div className="flex justify-start mb-4 w-full">
                        <div className="bg-[#5b72c4] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md">
                            <img src={penIcon} alt="Game" className="w-5 h-5 brightness-0 invert" />
                            <span className="font-bold">اكمل الجملة</span>
                        </div>
                    </div>

                    <div className="w-full">
                        <FillBlankQuestion 
                            questionText="يذهب الطفل الى .......... كل صباح"
                            options={options}
                            correctAnswerId="opt3"
                        />
                        <FillBlankQuestion 
                            questionText="يذهب الطفل الى .......... كل صباح"
                            options={options}
                            correctAnswerId="opt3"
                        />
                        <FillBlankQuestion 
                            questionText="يذهب الطفل الى .......... كل صباح"
                            options={options}
                            correctAnswerId="opt3"
                        />
                    </div>
                </div>
            );
        };

        // Game 4 Content
        const renderGame4 = () => {
            const options = [
                { id: 'opt1', text: 'يلعب الولد فوق الطاولة' },
                { id: 'opt2', text: 'يلعب الولد تحت الطاولة' },
                { id: 'opt3', text: 'يقوم بمساعدة اخيه' },
            ];

            return (
                <div className="w-full">
                     {/* Header for Game 4 */}
                     <div className="flex justify-start mb-4 w-full">
                        <div className="bg-[#5b72c4] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md">
                            <img src={penIcon} alt="Game" className="w-5 h-5 brightness-0 invert" />
                            <span className="font-bold">اختر ما يناسب</span>
                        </div>
                    </div>

                    <div className="w-full">
                        <ImageDescriptionQuestion
                            questionText="شاهد الصورة ثم اختر من القائمة ما يصف الصورة"
                            imageSrc={game4Img}
                            options={options}
                            correctAnswerId="opt1"
                        />
                        <ImageDescriptionQuestion
                            questionText="شاهد الصورة ثم اختر من القائمة ما يصف الصورة"
                            imageSrc={game4Img}
                            options={options}
                            correctAnswerId="opt3"
                        />
                        <ImageDescriptionQuestion
                            questionText="شاهد الصورة ثم اختر من القائمة ما يصف الصورة"
                            imageSrc={game4Img}
                            options={options}
                            correctAnswerId="opt1"
                        />
                    </div>
                </div>
            );
        };

        // Game 5 Content
        const renderGame5 = () => {
            return (
                <div className="w-full">
                     {/* Header for Game 5 */}
                     <div className="flex justify-start mb-4 w-full">
                        <div className="bg-[#5b72c4] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md">
                            <img src={penIcon} alt="Game" className="w-5 h-5 brightness-0 invert" />
                            <span className="font-bold">نص تعبيري</span>
                        </div>
                    </div>

                    <div className="w-full">
                        <WritingQuestion
                            questionText="قم بكتابة موضوع تعبيري عن رحلة قمت بها انت مع عائلتك او اصدقائك"
                            placeholder="اكتب النص هنا"
                        />
                    </div>
                </div>
            );
        };

        // Game 6 Content
        const renderGame6 = () => {
            // Add <br> after "التطبيق" and "الموقع" as requested
            const readingText = "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق.<br />إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد، النص لن يبدو مقسما ولا يحوي أخطاء لغوية، مولد النص العربى مفيد لمصممي المواقع على وجه الخصوص، حيث يحتاج العميل فى كثير من الأحيان أن يطلع على صورة حقيقية لتصميم الموقع.<br />ومن هنا وجب على المصمم أن يضع نصوصا مؤقتة على التصميم ليظهر للعميل الشكل كاملاً، دور مولد النص العربى أن يوفر على المصمم عناء البحث عن نص بديل لا علاقة له بالموضوع الذى يتحدث عنه التصميم فيظهر بشكل لا يليق.";

            return (
                <div className="w-full">
                     {/* Header for Game 6 */}
                     <div className="flex justify-start mb-4 w-full">
                        <div className="bg-[#5b72c4] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md">
                            <img src={penIcon} alt="Game" className="w-5 h-5 brightness-0 invert" />
                            <span className="font-bold">اقراء النص</span>
                        </div>
                    </div>

                    <div className="w-full">
                        <ReadingWritingQuestion
                            questionText="اقراء النص التالي ثم اكتب مافهمت منه"
                            readingText={readingText}
                            placeholder="اكتب النص هنا"
                        />
                    </div>
                </div>
            );
        };

         // Navigation Buttons for Games
         const renderGameNavigation = () => (
            <div className="flex justify-between w-full mt-8 border-t pt-4">
                <button
                    onClick={() => setCurrentGame(prev => Math.max(prev - 1, 1))}
                    disabled={currentGame === 1}
                    className={`px-6 py-2 rounded-full font-bold transition-colors ${currentGame === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#5b72c4] text-white hover:bg-[#4a61b0]'}`}
                >
                    السابق
                </button>

                <span className="font-bold text-gray-600 flex items-center">
                    لعبة {currentGame} من 6
                </span>

                <button
                    onClick={() => setCurrentGame(prev => Math.min(prev + 1, 6))}
                    disabled={currentGame === 6}
                    className={`px-6 py-2 rounded-full font-bold transition-colors ${currentGame === 6 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#5b72c4] text-white hover:bg-[#4a61b0]'}`}
                >
                    التالي
                </button>
            </div>
        );

        return (
             <div className="w-full px-4 pb-10 flex flex-col items-start" dir="rtl">
                {currentGame === 1 && renderGame1()}
                {currentGame === 2 && renderGame2()}
                {currentGame === 3 && renderGame3()}
                {currentGame === 4 && renderGame4()}
                {currentGame === 5 && renderGame5()}
                {currentGame === 6 && renderGame6()}
                
                {renderGameNavigation()}
             </div>
        );
    }

    return (
        <div className="text-center text-gray-500">
            <h2 className="text-2xl font-bold">المحتوى قيد التطوير</h2>
            <p className="mt-2">سيتم إضافة محتوى {activeTab} قريباً.</p>
        </div>
    );
};

export default LessonContent;
