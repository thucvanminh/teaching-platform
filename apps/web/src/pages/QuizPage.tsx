import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../lib/api'

interface Question {
  id: string
  content: string
  questionType: 'mc' | 'essay'
  points: number
  explanation?: string
  options?: { id: string; content: string; isCorrect?: boolean }[]
}

interface Answer {
  questionId: string
  selectedOptionId?: string
  essayAnswer?: string
}

export default function QuizPage() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()
  
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    loadQuestions()
  }, [lessonId])

  const loadQuestions = async () => {
    try {
      const { data } = await api.get(`/api/lessons/${lessonId}/questions`)
      setQuestions(data)
      setAnswers(data.map((q: Question) => ({ questionId: q.id })))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const currentQuestion = questions[currentIdx]
  const progress = questions.length > 0 ? ((currentIdx + 1) / questions.length) * 100 : 0

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers(prev => prev.map(a => 
      a.questionId === questionId ? { ...a, selectedOptionId: optionId } : a
    ))
  }

  const handleEssayAnswer = (questionId: string, value: string) => {
    setAnswers(prev => prev.map(a => 
      a.questionId === questionId ? { ...a, essayAnswer: value } : a
    ))
  }

  const handleSubmit = async () => {
    if (!confirm('Are you sure you want to submit?')) return
    setSubmitting(true)
    try {
      const { data } = await api.post(`/api/submissions`, {
        lessonId,
        answers: answers.map(a => ({
          questionId: a.questionId,
          selectedOptionId: a.selectedOptionId,
          essayAnswer: a.essayAnswer
        }))
      })
      setResult(data)
      setSubmitted(true)
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error submitting quiz')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-[var(--color-text-secondary)]">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card text-center max-w-md w-full animate-fade-in">
          <div className="text-5xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-white font-heading mb-2">No Questions Available</h2>
          <p className="text-[var(--color-text-secondary)] mb-6">This quiz doesn't have any questions yet.</p>
          <button onClick={() => navigate(-1)} className="btn btn-primary">Go Back</button>
        </div>
      </div>
    )
  }

  if (submitted && result) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card max-w-md w-full text-center animate-fade-in">
          <div className="mb-6">
            <div className="score-badge mx-auto">
              {result.score || 0}%
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white font-heading mb-2">Quiz Completed!</h2>
          <p className="text-[var(--color-text-secondary)] mb-6">
            You scored {result.correctCount || 0} out of {result.totalQuestions || questions.length}
          </p>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.1)]">
              <span className="text-[var(--color-text-secondary)]">Score</span>
              <span className="font-bold text-[var(--color-accent)]">{result.score || 0}%</span>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.1)]">
              <span className="text-[var(--color-text-secondary)]">Correct Answers</span>
              <span className="font-bold text-[var(--color-success)]">{result.correctCount || 0}</span>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.1)]">
              <span className="text-[var(--color-text-secondary)]">Total Points</span>
              <span className="font-bold text-[var(--color-accent)]">{result.totalPoints || 0}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => navigate(-1)} className="btn btn-secondary flex-1">Back to Lessons</button>
            <button onClick={() => { setSubmitted(false); setResult(null); setCurrentIdx(0); }} className="btn btn-primary flex-1">Retry Quiz</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-header py-3 px-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => navigate(-1)} className="btn btn-ghost text-sm px-2 py-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <span className="text-sm font-medium text-white font-heading">
              Question {currentIdx + 1} of {questions.length}
            </span>
            <div className="timer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </header>

      {/* Question */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="glass-card mb-6 animate-fade-in" key={currentIdx}>
          <div className="flex items-start gap-4 mb-6">
            <div className="question-number">{currentIdx + 1}</div>
            <div className="flex-1">
              <h2 className="text-xl font-medium text-white font-heading">{currentQuestion.content}</h2>
              <span className="text-xs text-[var(--color-text-muted)] mt-2 block">
                {currentQuestion.points} point{currentQuestion.points > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* MC Options */}
          {currentQuestion.questionType === 'mc' && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = answers.find(a => a.questionId === currentQuestion.id)?.selectedOptionId === opt.id
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                    className={`answer-option ${isSelected ? 'selected' : ''}`}
                  >
                    <span className="question-number !w-10 !h-10 !text-base">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-white">{opt.content}</span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Essay */}
          {currentQuestion.questionType === 'essay' && (
            <div>
              <textarea
                value={answers.find(a => a.questionId === currentQuestion.id)?.essayAnswer || ''}
                onChange={(e) => handleEssayAnswer(currentQuestion.id, e.target.value)}
                placeholder="Write your answer here..."
                className="input min-h-[150px] resize-y"
                rows={6}
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            className="btn btn-secondary flex-1 disabled:opacity-50"
          >
            Previous
          </button>
          
          {currentIdx < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIdx(prev => prev + 1)}
              className="btn btn-primary flex-1"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn btn-accent flex-1"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          )}
        </div>

        {/* Question Dots */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {questions.map((q, idx) => {
            const hasAnswer = answers.find(a => a.questionId === q.id)?.selectedOptionId || 
                             answers.find(a => a.questionId === q.id)?.essayAnswer
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIdx(idx)}
                className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
                  idx === currentIdx
                    ? 'bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white shadow-lg'
                    : hasAnswer
                      ? 'bg-[var(--color-success)] text-white'
                      : 'bg-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.2)]'
                }`}
              >
                {idx + 1}
              </button>
            )
          })}
        </div>
      </main>
    </div>
  )
}
