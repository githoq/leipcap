"use client"

import { Filter, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { AnswerMode } from "@/lib/types"

interface FiltersCardProps {
  temas: string[]
  selectedTema: string
  setSelectedTema: (tema: string) => void
  selectedDif: string
  setSelectedDif: (dif: string) => void
  selectedProb: string
  setSelectedProb: (prob: string) => void
  answerMode: AnswerMode
  setAnswerMode: (mode: AnswerMode) => void
  onApplyFilters: () => void
  onClearFilters: () => void
}

export function FiltersCard({
  temas,
  selectedTema,
  setSelectedTema,
  selectedDif,
  setSelectedDif,
  selectedProb,
  setSelectedProb,
  answerMode,
  setAnswerMode,
  onApplyFilters,
  onClearFilters,
}: FiltersCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <h3 className="flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-wider mb-4">
        <Filter className="w-4 h-4" />
        Filtros
      </h3>

      {/* Answer Mode Toggle */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Modo de Resposta
        </label>
        <div className="flex bg-background rounded-xl p-1 border border-border">
          <button
            onClick={() => setAnswerMode("immediate")}
            className={cn(
              "flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all",
              answerMode === "immediate"
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Gabarito Imediato
          </button>
          <button
            onClick={() => setAnswerMode("end")}
            className={cn(
              "flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all",
              answerMode === "end"
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Ao Final
          </button>
        </div>
      </div>

      {/* Tema Filter */}
      <div className="mb-3">
        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Tema
        </label>
        <select
          value={selectedTema}
          onChange={(e) => setSelectedTema(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
        >
          <option value="">Todos os Temas</option>
          {temas.map((tema) => (
            <option key={tema} value={tema}>
              {tema}
            </option>
          ))}
        </select>
      </div>

      {/* Difficulty Filter */}
      <div className="mb-3">
        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Dificuldade
        </label>
        <select
          value={selectedDif}
          onChange={(e) => setSelectedDif(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
        >
          <option value="">Todas</option>
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </select>
      </div>

      {/* Probability Filter */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Probabilidade de Cair
        </label>
        <select
          value={selectedProb}
          onChange={(e) => setSelectedProb(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
        >
          <option value="">Todas</option>
          <option value="alta">Alta ★★★</option>
          <option value="media">Média ★★</option>
          <option value="baixa">Baixa ★</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="space-y-2">
        <button
          onClick={onApplyFilters}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/30"
        >
          <Search className="w-4 h-4" />
          Filtrar Questões
        </button>
        <button
          onClick={onClearFilters}
          className="w-full px-4 py-2.5 rounded-xl bg-transparent border border-primary text-primary font-semibold text-sm hover:bg-primary/10 transition-colors"
        >
          Limpar Filtros
        </button>
      </div>
    </div>
  )
}
