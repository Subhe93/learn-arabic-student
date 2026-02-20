import React, { useState, useRef, useMemo, useEffect } from "react"

function generateHandDrawnCirclePath(cx, cy, baseRadius, seed) {
  const points = []
  const segments = 60

  for (let i = 0; i <= segments + 3; i++) {
    const angle = (i / segments) * Math.PI * 2 - Math.PI / 2

    // اختلافات بسيطة جداً لتبدو أكثر انتظاماً
    const wobble = Math.sin(angle * 3 + seed) * 1.5
    const radiusVariation = baseRadius + wobble

    const x = cx + Math.cos(angle) * radiusVariation
    const y = cy + Math.sin(angle) * radiusVariation
    points.push({ x, y })
  }

  let path = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const xc = (points[i].x + points[i + 1].x) / 2
    const yc = (points[i].y + points[i + 1].y) / 2
    path += ` Q ${points[i].x} ${points[i].y} ${xc} ${yc}`
  }

  return path
}

const DrawCircleQuestion = ({
  questionText,
  options,
  selectedOptionId,
  onOptionSelect,
  isConfirmed = false,
  showFeedback = false,
  allowMultiple = false,
  isAnswerCorrect = null,
}) => {
  const [animatedOptions, setAnimatedOptions] = useState(new Set())
  const [pathLengths, setPathLengths] = useState({})
  const [animationProgress, setAnimationProgress] = useState({})
  const [pencilPositions, setPencilPositions] = useState({})
  const pathRefs = useRef({})
  const animationRef = useRef({})

  const circlePaths = useMemo(() => {
    const paths = {}
    options.forEach((option, index) => {
      const seed = typeof option.id === "number" ? option.id : index + 1
      paths[option.id] = generateHandDrawnCirclePath(120, 120, 90, seed)
    })
    return paths
  }, [options])

  useEffect(() => {
    const newLengths = {}
    Object.entries(pathRefs.current).forEach(([id, pathEl]) => {
      if (pathEl) {
        newLengths[id] = pathEl.getTotalLength()
      }
    })
    if (Object.keys(newLengths).length > 0) {
      setPathLengths((prev) => ({ ...prev, ...newLengths }))
    }
  }, [circlePaths])

  const startAnimation = (optionId) => {
    const duration = 2000
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      setAnimationProgress((prev) => ({ ...prev, [optionId]: progress }))

      const pathEl = pathRefs.current[optionId]
      if (pathEl) {
        const pathLength = pathEl.getTotalLength()
        const point = pathEl.getPointAtLength(progress * pathLength)
        setPencilPositions((prev) => ({ ...prev, [optionId]: { x: point.x, y: point.y } }))
      }

      if (progress < 1) {
        animationRef.current[optionId] = requestAnimationFrame(animate)
      }
    }

    animationRef.current[optionId] = requestAnimationFrame(animate)
  }

  const getOptionStatus = (option) => {
    const isSelected = Array.isArray(selectedOptionId)
      ? selectedOptionId.includes(option.id)
      : selectedOptionId === option.id

    if (!isConfirmed || !showFeedback) {
      return isSelected ? "blue" : "default"
    }

    if (isSelected) {
      if (allowMultiple && isAnswerCorrect === false) {
        return "wrong"
      }
      return option.isCorrect ? "correct" : "wrong"
    }

    if (showFeedback && option.isCorrect) {
      return "correct"
    }

    return "default"
  }

  const handleOptionClick = (optionId) => {
    if (isConfirmed) return

    const currentSelections = Array.isArray(selectedOptionId) ? selectedOptionId : []
    const willBeSelected = allowMultiple ? !currentSelections.includes(optionId) : selectedOptionId !== optionId

    if (willBeSelected) {
      setAnimatedOptions((prev) => new Set([...prev, optionId]))
      setAnimationProgress((prev) => ({ ...prev, [optionId]: 0 }))
      const pathEl = pathRefs.current[optionId]
      if (pathEl) {
        const point = pathEl.getPointAtLength(0)
        setPencilPositions((prev) => ({ ...prev, [optionId]: { x: point.x, y: point.y } }))
      }
      startAnimation(optionId)

      setTimeout(() => {
        setAnimatedOptions((prev) => {
          const newSet = new Set(prev)
          newSet.delete(optionId)
          return newSet
        })
        if (animationRef.current[optionId]) {
          cancelAnimationFrame(animationRef.current[optionId])
        }
      }, 2000)
    }

    if (allowMultiple) {
      if (currentSelections.includes(optionId)) {
        onOptionSelect(currentSelections.filter((id) => id !== optionId))
      } else {
        onOptionSelect([...currentSelections, optionId])
      }
    } else {
      onOptionSelect(optionId)
    }
  }

  return (
    <div className="w-full mb-8" dir="rtl">
      <div className="flex items-center justify-between w-full mr-auto mb-6 relative">
        <div className="flex items-center gap-2 flex-1">
          <h3 className="text-xl font-bold text-gray-800">{questionText}</h3>
        </div>
        <span 
          className="w-[30%] sm:w-auto text-center sm:text-left inline-block font-semibold text-sm"
          style={{
            fontFamily: '"IBM Plex Sans Arabic", sans-serif',
            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '100%',
            color: '#848484',
          }}
        >
          5 درجات
        </span>
      </div>

      {allowMultiple && !isConfirmed && (
        <div className="mb-8 flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded-lg">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium">يمكنك اختيار أكثر من إجابة صحيحة</span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16" style={{ marginRight: 'auto' }}>
        {options.map((option) => {
          const status = getOptionStatus(option)
          const isSelected = Array.isArray(selectedOptionId)
            ? selectedOptionId.includes(option.id)
            : selectedOptionId === option.id
          const isAnimating = animatedOptions.has(option.id)
          const circlePath = circlePaths[option.id]
          const pathLength = pathLengths[option.id] || 600
          const pencilPos = pencilPositions[option.id] || { x: 120, y: 30 }

          let circleClass =
            "w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300 cursor-pointer shadow-lg relative z-0"

          if (status === "blue" || (isSelected && !isConfirmed)) {
            circleClass += " bg-blue-500 text-white border-4 border-blue-700"
          } else if (status === "correct") {
            circleClass += " bg-green-500 text-white border-4 border-green-700"
          } else if (status === "wrong") {
            circleClass += " bg-red-500 text-white border-4 border-red-700"
          } else {
            circleClass +=
              " bg-white text-gray-700 border-4 border-gray-300 hover:bg-gray-50 hover:border-blue-300 hover:shadow-xl hover:scale-105"
          }

          const strokeColor =
            isConfirmed && showFeedback
              ? allowMultiple && isAnswerCorrect === false
                ? "#ef4444"
                : option.isCorrect
                  ? "#10b981"
                  : "#ef4444"
              : "#DC2626"

          return (
            <div
              key={option.id}
              className="relative flex flex-col items-center bg-transparent min-w-[150px]"
              onClick={() => handleOptionClick(option.id)}
              style={{ zIndex: isSelected ? 1 : 0 }}
            >
              {isSelected && (
                <svg
                  className="absolute pointer-events-none bg-transparent"
                  style={{
                    inset: "-1.5rem",
                    width: "calc(100% + 3rem)",
                    height: "calc(100% + 3rem)",
                    zIndex: 100,
                  }}
                  viewBox="0 0 240 240"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <filter id={`marker-${option.id}`} x="-20%" y="-20%" width="140%" height="140%">
                      <feTurbulence
                        baseFrequency="0.4"
                        numOctaves="2"
                        result="noise"
                        seed={Number(option.id) || 1}
                        type="fractalNoise"
                      />
                      <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale="1.5"
                        xChannelSelector="R"
                        yChannelSelector="G"
                      />
                    </filter>
                  </defs>

                  <path
                    ref={(el) => {
                      pathRefs.current[option.id] = el
                    }}
                    d={circlePath}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter={`url(#marker-${option.id})`}
                    style={{
                      strokeDasharray: pathLength,
                      strokeDashoffset: isAnimating ? pathLength - (animationProgress[option.id] || 0) * pathLength : 0,
                    }}
                  />

                  {isAnimating && (
                    <g transform={`translate(${pencilPos.x}, ${pencilPos.y})`}>
                      <g transform="rotate(135)">
                        <polygon points="0,0 8,-4 8,4" fill="#374151" />
                        <polygon points="8,-5 8,5 20,7 20,-7" fill="#DEB887" />
                        <rect x="20" y="-7" width="70" height="14" fill="#FCD34D" />
                        <rect x="25" y="-7" width="2" height="14" fill="#F59E0B" opacity="0.5" />
                        <rect x="45" y="-7" width="2" height="14" fill="#F59E0B" opacity="0.5" />
                        <rect x="65" y="-7" width="2" height="14" fill="#F59E0B" opacity="0.5" />
                        <rect x="22" y="-5" width="65" height="4" rx="2" fill="#FEF9C3" opacity="0.5" />
                        <rect x="88" y="-9" width="8" height="18" fill="#9CA3AF" />
                        <rect x="88" y="-9" width="8" height="4" fill="#D1D5DB" />
                        <rect x="94" y="-7" width="14" height="14" rx="3" fill="#F472B6" />
                      </g>
                      <circle r="3" fill={strokeColor} opacity="0.8">
                        <animate attributeName="r" values="2;5;0" dur="0.3s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="1;0.3;0" dur="0.3s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="-3" cy="3" r="2" fill={strokeColor} opacity="0.6">
                        <animate attributeName="r" values="1;3;0" dur="0.4s" repeatCount="indefinite" />
                      </circle>
                    </g>
                  )}

                  {isSelected && !isAnimating && (
                    <>
                      <g className="sparkle" style={{ animationDelay: "0s" }}>
                        <polygon points="30,30 33,38 41,38 35,43 37,51 30,46 23,51 25,43 19,38 27,38" fill="#FFD700" />
                      </g>
                      <g className="sparkle" style={{ animationDelay: "0.2s" }}>
                        <polygon
                          points="210,35 213,43 221,43 215,48 217,56 210,51 203,56 205,48 199,43 207,43"
                          fill="#FFD700"
                        />
                      </g>
                      <g className="sparkle" style={{ animationDelay: "0.4s" }}>
                        <polygon
                          points="205,200 208,208 216,208 210,213 212,221 205,216 198,221 200,213 194,208 202,208"
                          fill="#FFD700"
                        />
                      </g>
                      <g className="sparkle" style={{ animationDelay: "0.6s" }}>
                        <polygon
                          points="35,195 38,203 46,203 40,208 42,216 35,211 28,216 30,208 24,203 32,203"
                          fill="#FFD700"
                        />
                      </g>
                    </>
                  )}
                </svg>
              )}

              <div className={circleClass} style={{ zIndex: 20, position: 'relative' }}>
                <span className="font-bold" style={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif' }}>
                  {option.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.2) rotate(180deg);
          }
        }

        .sparkle {
          animation: sparkle 1.5s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>
    </div>
  )
}

export default DrawCircleQuestion
