"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Clock, Target, RotateCcw, X, CheckCircle2, XCircle, BookOpen } from "lucide-react"
import { cn, formatTime } from "@/lib/utils"
import { Question, QuestionState } from "@/lib/types"

interface ResultModalProps {
  open: boolean
  onClose: () => void
  stats: {
    total: number
    answered: number
    correct: number
    wrong: number
    marked: number
    percentage: number
  }
  timer: number
  questions: Question[]
  questionStates: Map<number, QuestionState>
  onReset: () => void
}

export function ResultModal({
  open,
  onClose,
  stats,
  timer,
  questions,
  questionStates,
  onReset,
}: ResultModalProps) {
  // Agrupar resultados por tema
  const resultsByTema = questions.reduce((acc, q) => {
    const state = questionStates.get(q.id)
    if (!acc[q.tema]) {
      acc[q.tema] = { total: 0, correct: 0 }
    }
    acc[q.tema].total++
    if (state?.isCorrect) {
      acc[q.tema].correct++
    }
    return acc
  }, {} as Record<string, { total: number; correct: number }>)

  const getMessage = () => {
    if (stats.percentage >= 90) return { text: "Excelente! Você domina o conteúdo!", emoji: "🏆" }
    if (stats.percentage >= 70) return { text: "Muito bem! Continue assim!", emoji: "🎯" }
    if (stats.percentage >= 50) return { text: "Bom trabalho! Revise os pontos fracos.", emoji: "📚" }
    return { text: "Continue estudando! Você vai conseguir!", emoji: "💪" }
  }

  const message = getMessage()

  const getScoreColor = () => {
    if (stats.percentage >= 70) return "text-success"
    if (stats.percentage >= 50) return "text-warning"
    return "text-error"
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card rounded-2xl border border-border shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-card/95 backdrop-blur-sm">
              <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
                <Trophy className="w-5 h-5 text-primary" />
                Resultado do Simulado
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Score Hero */}
              <div className="text-center py-6">
                <div className={cn("text-7xl font-black", getScoreColor())}>
                  {stats.correct}
                  <span className="text-2xl text-muted-foreground">/{stats.answered}</span>
                </div>
                <div className="text-xl font-semibold text-muted-foreground mt-2">
                  {stats.percentage}% de aproveitamento
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-md mx-auto mt-4">
                  <div className="h-4 bg-border rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.percentage}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className={cn(
                        "h-full rounded-full",
                        stats.percentage >= 70 ? "bg-success" : stats.percentage >= 50 ? "bg-warning" : "bg-error"
                      )}
                    />
                  </div>
                </div>

                <p className="mt-4 text-lg text-muted-foreground">
                  {message.emoji} {message.text}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="bg-success/10 border border-success/20 rounded-xl p-4 text-center">
                  <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-success" />
                  <div className="text-2xl font-bold text-success">{stats.correct}</div>
                  <div className="text-xs text-success/70 uppercase font-semibold">Acertos</div>
                </div>
                <div className="bg-error/10 border border-error/20 rounded-xl p-4 text-center">
                  <XCircle className="w-5 h-5 mx-auto mb-1 text-error" />
                  <div className="text-2xl font-bold text-error">{stats.wrong}</div>
                  <div className="text-xs text-error/70 uppercase font-semibold">Erros</div>
                </div>
                <div className="bg-info/10 border border-info/20 rounded-xl p-4 text-center">
                  <Target className="w-5 h-5 mx-auto mb-1 text-info" />
                  <div className="text-2xl font-bold text-info">{stats.total - stats.answered}</div>
                  <div className="text-xs text-info/70 uppercase font-semibold">Pendentes</div>
                </div>
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
                  <Clock className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <div className="text-2xl font-bold text-primary">{formatTime(timer)}</div>
                  <div className="text-xs text-primary/70 uppercase font-semibold">Tempo</div>
                </div>
              </div>

              {/* Results by Topic */}
              <div className="mb-6">
                <h3 className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider mb-3">
                  <BookOpen className="w-4 h-4" />
                  Desempenho por Tema
                </h3>
                <div className="bg-background rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left px-4 py-3 text-muted-foreground font-semibold">Tema</th>
                        <th className="text-center px-4 py-3 text-muted-foreground font-semibold">Acertos</th>
                        <th className="text-right px-4 py-3 text-muted-foreground font-semibold">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(resultsByTema).map(([tema, data]) => {
                        const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0
                        return (
                          <tr key={tema} className="border-b border-border last:border-0">
                            <td className="px-4 py-3 text-foreground">{tema}</td>
                            <td className="px-4 py-3 text-center">
                              <span className="text-success font-semibold">{data.correct}</span>
                              <span className="text-muted-foreground">/{data.total}</span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <div className="w-16 h-2 bg-border rounded-full overflow-hidden">
                                  <div
                                    className={cn(
                                      "h-full rounded-full",
                                      pct >= 70 ? "bg-success" : pct >= 50 ? "bg-warning" : "bg-error"
                                    )}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span className={cn(
                                  "font-semibold",
                                  pct >= 70 ? "text-success" : pct >= 50 ? "text-warning" : "text-error"
                                )}>
                                  {pct}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    onReset()
                    onClose()
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/30"
                >
                  <RotateCcw className="w-4 h-4" />
                  Recomeçar Simulado
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-5 py-3 rounded-xl bg-transparent border border-border text-foreground font-semibold hover:bg-accent transition-colors"
                >
                  Revisar Questões
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
