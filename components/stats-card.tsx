"use client"

import { BarChart3, CheckCircle2, XCircle, Bookmark, Target, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  stats: {
    total: number
    answered: number
    correct: number
    wrong: number
    marked: number
    percentage: number
  }
  onReset: () => void
}

export function StatsCard({ stats, onReset }: StatsCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <h3 className="flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-wider mb-4">
        <BarChart3 className="w-4 h-4" />
        Desempenho
      </h3>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatBox value={stats.correct} label="Acertos" color="success" icon={CheckCircle2} />
        <StatBox value={stats.wrong} label="Erros" color="error" icon={XCircle} />
        <StatBox value={stats.marked} label="Marcadas" color="warning" icon={Bookmark} />
        <StatBox value={`${stats.percentage}%`} label="Aproveit." color="info" icon={Target} />
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="h-3 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
            style={{ width: `${stats.total > 0 ? (stats.answered / stats.total) * 100 : 0}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground text-right">
          {stats.answered} de {stats.total} respondidas
        </p>
      </div>

      <button
        onClick={onReset}
        className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-error/10 border border-error/30 text-error font-semibold text-sm hover:bg-error/20 transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        Reiniciar Simulado
      </button>
    </div>
  )
}

function StatBox({
  value,
  label,
  color,
  icon: Icon,
}: {
  value: number | string
  label: string
  color: "success" | "error" | "warning" | "info"
  icon: React.ElementType
}) {
  const colors = {
    success: "bg-success/10 text-success border-success/20",
    error: "bg-error/10 text-error border-error/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    info: "bg-info/10 text-info border-info/20",
  }

  return (
    <div className={cn("rounded-xl p-3 text-center border", colors[color])}>
      <Icon className="w-4 h-4 mx-auto mb-1 opacity-70" />
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-[10px] font-semibold uppercase tracking-wider opacity-70">{label}</div>
    </div>
  )
}
