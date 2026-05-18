"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  BookMarked,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Trophy,
  Target,
  Flame,
  Filter,
  BarChart3,
  Map as MapIcon,
  Bookmark,
  Shuffle,
} from "lucide-react"
import { cn, formatTime } from "@/lib/utils"
import { questions, temas } from "@/lib/questions"
import { Question, QuestionState, AnswerMode } from "@/lib/types"
import { QuestionCard } from "./question-card"
import { StatsCard } from "./stats-card"
import { NavigatorCard } from "./navigator-card"
import { FiltersCard } from "./filters-card"
import { ResultModal } from "./result-modal"

export function QuizApp() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [questionStates, setQuestionStates] = useState<Map<number, QuestionState>>(new Map())
  const [answerMode, setAnswerMode] = useState<AnswerMode>("immediate")
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(true)
  const [showResult, setShowResult] = useState(false)
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>(questions)
  
  // Filtros
  const [selectedTema, setSelectedTema] = useState("")
  const [selectedDif, setSelectedDif] = useState("")
  const [selectedProb, setSelectedProb] = useState("")

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  // Aplicar filtros
  const applyFilters = useCallback(() => {
    let filtered = [...questions]
    if (selectedTema) {
      filtered = filtered.filter((q) => q.tema === selectedTema)
    }
    if (selectedDif) {
      filtered = filtered.filter((q) => q.dif === selectedDif)
    }
    if (selectedProb) {
      filtered = filtered.filter((q) => q.prob === selectedProb)
    }
    setFilteredQuestions(filtered)
    setCurrentIndex(0)
  }, [selectedTema, selectedDif, selectedProb])

  const clearFilters = () => {
    setSelectedTema("")
    setSelectedDif("")
    setSelectedProb("")
    setFilteredQuestions(questions)
    setCurrentIndex(0)
  }

  const currentQuestion = filteredQuestions[currentIndex]
  const currentState = currentQuestion ? questionStates.get(currentQuestion.id) : undefined

  const handleSelectOption = (optionIndex: number) => {
    if (!currentQuestion) return
    if (currentState?.answered && answerMode === "immediate") return

    const isCorrect = optionIndex === currentQuestion.corr
    
    setQuestionStates((prev) => {
      const newMap = new Map(prev)
      newMap.set(currentQuestion.id, {
        answered: answerMode === "immediate",
        selectedOption: optionIndex,
        isCorrect: answerMode === "immediate" ? isCorrect : null,
        marked: prev.get(currentQuestion.id)?.marked || false,
      })
      return newMap
    })
  }

  const handleConfirmAnswer = () => {
    if (!currentQuestion || !currentState || currentState.answered) return
    
    const isCorrect = currentState.selectedOption === currentQuestion.corr
    
    setQuestionStates((prev) => {
      const newMap = new Map(prev)
      newMap.set(currentQuestion.id, {
        ...currentState,
        answered: true,
        isCorrect,
      })
      return newMap
    })
  }

  const handleToggleMark = () => {
    if (!currentQuestion) return
    
    setQuestionStates((prev) => {
      const newMap = new Map(prev)
      const current = prev.get(currentQuestion.id)
      newMap.set(currentQuestion.id, {
        answered: current?.answered || false,
        selectedOption: current?.selectedOption ?? null,
        isCorrect: current?.isCorrect ?? null,
        marked: !current?.marked,
      })
      return newMap
    })
  }

  const handleReset = () => {
    setQuestionStates(new Map())
    setCurrentIndex(0)
    setTimer(0)
    setIsRunning(true)
    setShowResult(false)
  }

  const handleFinishAll = () => {
    // Revelar todas as respostas quando modo "ao final"
    if (answerMode === "end") {
      setQuestionStates((prev) => {
        const newMap = new Map(prev)
        filteredQuestions.forEach((q) => {
          const state = prev.get(q.id)
          if (state && state.selectedOption !== null) {
            newMap.set(q.id, {
              ...state,
              answered: true,
              isCorrect: state.selectedOption === q.corr,
            })
          }
        })
        return newMap
      })
    }
    setIsRunning(false)
    setShowResult(true)
  }

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < filteredQuestions.length) {
      setCurrentIndex(index)
    }
  }

  const goToRandomQuestion = () => {
    const unanswered = filteredQuestions
      .map((q, i) => ({ q, i }))
      .filter(({ q }) => !questionStates.get(q.id)?.answered)
    
    if (unanswered.length > 0) {
      const random = unanswered[Math.floor(Math.random() * unanswered.length)]
      setCurrentIndex(random.i)
    }
  }

  // Estatísticas
  const stats = {
    total: filteredQuestions.length,
    answered: Array.from(questionStates.values()).filter((s) => s.answered).length,
    correct: Array.from(questionStates.values()).filter((s) => s.isCorrect === true).length,
    wrong: Array.from(questionStates.values()).filter((s) => s.isCorrect === false).length,
    marked: Array.from(questionStates.values()).filter((s) => s.marked).length,
    percentage: 0,
  }
  stats.percentage = stats.answered > 0 ? Math.round((stats.correct / stats.answered) * 100) : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gradient-gold flex items-center justify-center shadow-lg shadow-primary/20">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-foreground text-sm sm:text-base leading-tight">
                  Lei Orgânica da Polícia Civil
                </h1>
                <p className="text-xs text-muted-foreground">
                  Lei nº 883/2005 — Estado do Amapá
                </p>
              </div>
            </div>

            {/* Stats Pills */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <StatPill icon={<CheckCircle2 className="w-3.5 h-3.5" />} value={stats.correct} label="Acertos" color="success" />
                <StatPill icon={<XCircle className="w-3.5 h-3.5" />} value={stats.wrong} label="Erros" color="error" />
                <StatPill icon={<Target className="w-3.5 h-3.5" />} value={stats.total - stats.answered} label="Pend." color="muted" />
              </div>
              
              {/* Timer */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-mono font-bold text-primary text-sm">
                  {formatTime(timer)}
                </span>
              </div>

              <button
                onClick={() => setShowResult(true)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs sm:text-sm font-semibold hover:bg-primary/20 transition-colors"
              >
                Ver Resultado
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0 space-y-4">
            <FiltersCard
              temas={temas}
              selectedTema={selectedTema}
              setSelectedTema={setSelectedTema}
              selectedDif={selectedDif}
              setSelectedDif={setSelectedDif}
              selectedProb={selectedProb}
              setSelectedProb={setSelectedProb}
              answerMode={answerMode}
              setAnswerMode={setAnswerMode}
              onApplyFilters={applyFilters}
              onClearFilters={clearFilters}
            />
            
            <StatsCard stats={stats} onReset={handleReset} />
            
            <NavigatorCard
              questions={filteredQuestions}
              currentIndex={currentIndex}
              questionStates={questionStates}
              onGoToQuestion={goToQuestion}
            />
          </aside>

          {/* Question Area */}
          <div className="flex-1 min-w-0">
            {currentQuestion ? (
              <QuestionCard
                question={currentQuestion}
                questionNumber={currentIndex + 1}
                totalQuestions={filteredQuestions.length}
                state={currentState}
                answerMode={answerMode}
                onSelectOption={handleSelectOption}
                onConfirmAnswer={handleConfirmAnswer}
                onToggleMark={handleToggleMark}
                onPrevious={() => goToQuestion(currentIndex - 1)}
                onNext={() => goToQuestion(currentIndex + 1)}
                onRandom={goToRandomQuestion}
                onFinish={handleFinishAll}
                hasPrevious={currentIndex > 0}
                hasNext={currentIndex < filteredQuestions.length - 1}
              />
            ) : (
              <div className="bg-card rounded-2xl border border-border p-12 text-center">
                <Filter className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">
                  Nenhuma questão encontrada com os filtros selecionados.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold"
                >
                  Limpar Filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Result Modal */}
      <ResultModal
        open={showResult}
        onClose={() => setShowResult(false)}
        stats={stats}
        timer={timer}
        questions={filteredQuestions}
        questionStates={questionStates}
        onReset={handleReset}
      />
    </div>
  )
}

function StatPill({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode
  value: number
  label: string
  color: "success" | "error" | "warning" | "muted"
}) {
  const colors = {
    success: "text-success",
    error: "text-error",
    warning: "text-warning",
    muted: "text-muted-foreground",
  }

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border text-xs">
      <span className={colors[color]}>{icon}</span>
      <span className={cn("font-bold", colors[color])}>{value}</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  )
}
