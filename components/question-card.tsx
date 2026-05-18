"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Shuffle,
  Flag,
  Sparkles,
  Scale,
  AlertTriangle,
  Info,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Question, QuestionState, AnswerMode } from "@/lib/types"

interface QuestionCardProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  state?: QuestionState
  answerMode: AnswerMode
  onSelectOption: (index: number) => void
  onConfirmAnswer: () => void
  onToggleMark: () => void
  onPrevious: () => void
  onNext: () => void
  onRandom: () => void
  onFinish: () => void
  hasPrevious: boolean
  hasNext: boolean
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  state,
  answerMode,
  onSelectOption,
  onConfirmAnswer,
  onToggleMark,
  onPrevious,
  onNext,
  onRandom,
  onFinish,
  hasPrevious,
  hasNext,
}: QuestionCardProps) {
  const isAnswered = state?.answered || false
  const selectedOption = state?.selectedOption ?? null
  const isCorrect = state?.isCorrect
  const isMarked = state?.marked || false

  const difficultyConfig = {
    baixa: { label: "Baixa", color: "bg-success/10 text-success border-success/30", icon: Sparkles },
    media: { label: "Média", color: "bg-warning/10 text-warning border-warning/30", icon: Scale },
    alta: { label: "Alta", color: "bg-error/10 text-error border-error/30", icon: AlertTriangle },
  }

  const probabilityConfig = {
    baixa: { label: "Baixa", stars: 1 },
    media: { label: "Média", stars: 2 },
    alta: { label: "Alta", stars: 3 },
  }

  const dif = difficultyConfig[question.dif]
  const prob = probabilityConfig[question.prob]

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-2xl border border-border overflow-hidden shadow-xl shadow-black/20"
    >
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-blue opacity-90" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white font-bold text-lg border border-white/20">
              {questionNumber}
            </div>
            <div>
              <span className="text-white/70 text-sm">Questão {questionNumber} de {totalQuestions}</span>
              <h2 className="text-white font-semibold">{question.tema}</h2>
            </div>
          </div>
          
          <div className="sm:ml-auto flex items-center gap-2">
            <button
              onClick={onToggleMark}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                isMarked
                  ? "bg-warning text-warning-foreground"
                  : "bg-white/10 text-white hover:bg-white/20"
              )}
            >
              {isMarked ? (
                <>
                  <BookmarkCheck className="w-4 h-4" />
                  Marcada
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  Marcar
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="px-6 py-4 flex flex-wrap items-center gap-2 border-b border-border">
        <span className={cn("px-3 py-1 rounded-full text-xs font-semibold border", dif.color)}>
          <dif.icon className="w-3 h-3 inline-block mr-1" />
          Dificuldade {dif.label}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-info/10 text-info border-info/30">
          {"★".repeat(prob.stars)}{"☆".repeat(3 - prob.stars)} Prob. {prob.label}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-primary/10 text-primary border-primary/30">
          {question.art}
        </span>
      </div>

      {/* Question Body */}
      <div className="px-6 py-6">
        <div
          className="text-foreground text-[15px] leading-relaxed whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: question.enunc }}
        />
        {question.pergunta && (
          <p
            className="mt-4 text-foreground font-semibold"
            dangerouslySetInnerHTML={{ __html: question.pergunta }}
          />
        )}
      </div>

      {/* Options */}
      <div className="px-6 pb-6 space-y-3">
        {question.ops.map((option, index) => {
          const isSelected = selectedOption === index
          const isOptionCorrect = index === question.corr
          const showCorrect = isAnswered && isOptionCorrect
          const showWrong = isAnswered && isSelected && !isOptionCorrect

          return (
            <motion.button
              key={index}
              onClick={() => onSelectOption(index)}
              disabled={isAnswered && answerMode === "immediate"}
              whileHover={!isAnswered || answerMode === "end" ? { scale: 1.01 } : {}}
              whileTap={!isAnswered || answerMode === "end" ? { scale: 0.99 } : {}}
              className={cn(
                "w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all",
                !isAnswered && !isSelected && "bg-card hover:bg-accent/50 border-border hover:border-primary/50",
                !isAnswered && isSelected && "bg-info/10 border-info",
                showCorrect && "bg-success/10 border-success",
                showWrong && "bg-error/10 border-error",
                isAnswered && !showCorrect && !showWrong && "opacity-50 border-border"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm border-2 transition-all",
                  !isAnswered && !isSelected && "bg-card border-border text-muted-foreground",
                  !isAnswered && isSelected && "bg-info border-info text-white",
                  showCorrect && "bg-success border-success text-white",
                  showWrong && "bg-error border-error text-white",
                  isAnswered && !showCorrect && !showWrong && "bg-card border-border text-muted-foreground"
                )}
              >
                {showCorrect ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : showWrong ? (
                  <XCircle className="w-4 h-4" />
                ) : (
                  String.fromCharCode(65 + index)
                )}
              </div>
              <span className={cn(
                "pt-1 text-sm",
                (showCorrect || showWrong) ? "font-medium" : ""
              )}>
                {option}
              </span>
            </motion.button>
          )
        })}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-6 pb-6"
          >
            <div
              className={cn(
                "p-4 rounded-xl border-l-4",
                isCorrect
                  ? "bg-success/10 border-success"
                  : "bg-error/10 border-error"
              )}
            >
              <div className={cn(
                "flex items-center gap-2 font-bold mb-2",
                isCorrect ? "text-success" : "text-error"
              )}>
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Resposta Correta!
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    Resposta Incorreta
                  </>
                )}
              </div>
              <p className="text-sm text-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: question.com }} />
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-md bg-black/20 text-xs text-muted">
                <Info className="w-3 h-3" />
                Fundamentação: {question.art}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Bar */}
      <div className="px-6 pb-6 flex flex-wrap items-center gap-3">
        {answerMode === "end" && !isAnswered && selectedOption !== null && (
          <button
            onClick={onConfirmAnswer}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/30"
          >
            Confirmar Resposta
          </button>
        )}
        
        {answerMode === "immediate" && !isAnswered && selectedOption !== null && (
          <button
            onClick={onConfirmAnswer}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/30"
          >
            Confirmar Resposta
          </button>
        )}

        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-foreground font-medium text-sm hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </button>

        <button
          onClick={onNext}
          disabled={!hasNext}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-foreground font-medium text-sm hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Próxima
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={onRandom}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-primary font-medium text-sm hover:bg-accent transition-colors"
        >
          <Shuffle className="w-4 h-4" />
          Aleatória
        </button>

        <button
          onClick={onFinish}
          className="ml-auto px-5 py-2.5 rounded-xl bg-error/10 border border-error/30 text-error font-bold text-sm hover:bg-error/20 transition-colors"
        >
          <Flag className="w-4 h-4 inline-block mr-2" />
          Finalizar
        </button>
      </div>
    </motion.div>
  )
}
