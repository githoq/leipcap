"use client"

import { Map } from "lucide-react"
import { cn } from "@/lib/utils"
import { Question, QuestionState } from "@/lib/types"

interface NavigatorCardProps {
  questions: Question[]
  currentIndex: number
  questionStates: Map<number, QuestionState>
  onGoToQuestion: (index: number) => void
}

export function NavigatorCard({
  questions,
  currentIndex,
  questionStates,
  onGoToQuestion,
}: NavigatorCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <h3 className="flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-wider mb-4">
        <Map className="w-4 h-4" />
        Navegador
      </h3>

      <div className="flex flex-wrap gap-2">
        {questions.map((q, index) => {
          const state = questionStates.get(q.id)
          const isCurrent = index === currentIndex
          const isAnswered = state?.answered
          const isCorrect = state?.isCorrect
          const isMarked = state?.marked

          return (
            <button
              key={q.id}
              onClick={() => onGoToQuestion(index)}
              className={cn(
                "w-9 h-9 rounded-lg text-xs font-bold border-2 transition-all hover:scale-110",
                isCurrent && "ring-2 ring-primary ring-offset-2 ring-offset-card",
                !isAnswered && !isCurrent && !isMarked && "bg-card border-border text-muted-foreground hover:border-primary/50",
                isAnswered && isCorrect && "bg-success/20 border-success text-success",
                isAnswered && !isCorrect && "bg-error/20 border-error text-error",
                isMarked && !isAnswered && "bg-warning/20 border-warning text-warning",
                isCurrent && !isAnswered && !isMarked && "bg-primary border-primary text-primary-foreground"
              )}
            >
              {index + 1}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border">
        <LegendItem color="success" label="Acertou" />
        <LegendItem color="error" label="Errou" />
        <LegendItem color="warning" label="Marcada" />
        <LegendItem color="primary" label="Atual" />
      </div>
    </div>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  const colors: Record<string, string> = {
    success: "bg-success/20 border-success",
    error: "bg-error/20 border-error",
    warning: "bg-warning/20 border-warning",
    primary: "bg-primary border-primary",
  }

  return (
    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
      <div className={cn("w-3 h-3 rounded border", colors[color])} />
      {label}
    </div>
  )
}
