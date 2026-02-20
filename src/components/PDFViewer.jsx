import React, { useState, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Use CDN for worker file (better for shared hosting)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function PDFViewer({ pdfUrl, className = '' }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scale, setScale] = useState(1.0);

  // Memoize options to prevent unnecessary reloads
  const documentOptions = useMemo(() => ({
    // No need for cMapUrl and standardFontDataUrl for basic PDFs
  }), []);

  // Prevent keyboard shortcuts for saving/downloading
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent Ctrl+S (Save) and Ctrl+P (Print)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p')) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  }

  function onDocumentLoadError(error) {
    console.error('Error loading PDF:', error);
    setError('فشل تحميل ملف PDF');
    setLoading(false);
  }

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 2.0));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const resetZoom = () => {
    setScale(1.0);
  };

  if (!pdfUrl) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-lg">لا يوجد ملف PDF متاح</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-gray-100 ${className}`} dir="rtl">
      {/* Controls Bar */}
      <div className="bg-white shadow-md p-4 flex items-center justify-between flex-wrap gap-4">
        {/* Page Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="bg-[#4F67BD] text-white px-4 py-2 rounded-lg hover:bg-[#3e539a] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-bold"
          >
            السابق
          </button>
          
          <div className="bg-gray-100 px-4 py-2 rounded-lg">
            <span className="font-bold text-gray-700">
              صفحة {pageNumber} من {numPages || '...'}
            </span>
          </div>

          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="bg-[#4F67BD] text-white px-4 py-2 rounded-lg hover:bg-[#3e539a] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-bold"
          >
            التالي
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={zoomOut}
            className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            title="تصغير"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>

          <span className="text-sm font-bold text-gray-600 min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>

          <button
            onClick={zoomIn}
            className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            title="تكبير"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          <button
            onClick={resetZoom}
            className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm font-bold"
            title="إعادة تعيين"
          >
            إعادة
          </button>
        </div>
      </div>

      {/* PDF Document Container */}
      <div className="flex-1 overflow-auto bg-gray-200 p-4 flex justify-center relative">
        {/* Watermark Overlay - Prevents screenshots */}
        <div className="absolute inset-0 pointer-events-none z-10 select-none" style={{ 
          background: 'repeating-linear-gradient(45deg, transparent, transparent 200px, rgba(79, 103, 189, 0.03) 200px, rgba(79, 103, 189, 0.03) 400px)',
          mixBlendMode: 'multiply'
        }}>
          <div className="absolute inset-0 flex items-center justify-center opacity-5 select-none">
            <div className="text-6xl font-bold text-[#4F67BD] transform rotate-[-45deg] select-none" style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              userSelect: 'none',
              pointerEvents: 'none'
            }}>
              محمي - لا يمكن التحميل
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#4F67BD] mx-auto mb-4"></div>
              <p className="text-gray-600 font-bold">جاري تحميل الكتاب...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-full">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 font-bold">{error}</p>
            </div>
          </div>
        )}

        <div className="pdf-container" style={{ display: loading || error ? 'none' : 'block' }}>
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading=""
            error=""
            options={documentOptions}
            className="shadow-lg"
            onContextMenu={(e) => e.preventDefault()} // Prevent right-click
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="shadow-xl"
              loading=""
              onContextMenu={(e) => e.preventDefault()} // Prevent right-click on page
            />
          </Document>
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="bg-white border-t border-gray-200 p-3 text-center">
        <p className="text-sm text-gray-600">
          <span className="font-bold">تنبيه:</span> هذا الكتاب محمي ولا يمكن تحميله أو نسخه
        </p>
      </div>

      {/* CSS to prevent selection and copying */}
      <style>{`
        .pdf-container {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          -webkit-touch-callout: none;
        }
        
        .pdf-container canvas {
          display: block;
          margin: 0 auto;
          pointer-events: none;
        }

        /* Prevent text selection in PDF */
        .react-pdf__Page__textContent {
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          pointer-events: none !important;
        }

        /* Prevent annotation layer interactions */
        .react-pdf__Page__annotations {
          pointer-events: none !important;
        }

        /* Hide download button if browser adds one */
        .react-pdf__Document button,
        .react-pdf__Page button {
          display: none !important;
        }

        /* Disable context menu on all PDF elements */
        .react-pdf__Page,
        .react-pdf__Page__canvas,
        .react-pdf__Page__textContent,
        .react-pdf__Page__annotations {
          -webkit-user-drag: none;
          -khtml-user-drag: none;
          -moz-user-drag: none;
          -o-user-drag: none;
          user-drag: none;
        }

        /* Prevent image dragging */
        .pdf-container img {
          -webkit-user-drag: none;
          -khtml-user-drag: none;
          -moz-user-drag: none;
          -o-user-drag: none;
          user-drag: none;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

export default PDFViewer;

