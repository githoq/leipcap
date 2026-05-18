export interface Question {
  id: number
  tema: string
  dif: "baixa" | "media" | "alta"
  prob: "baixa" | "media" | "alta"
  enunc: string
  pergunta?: string
  ops: string[]
  corr: number
  com: string
  art: string
}

export interface QuestionState {
  answered: boolean
  selectedOption: number | null
  isCorrect: boolean | null
  marked: boolean
}

export type AnswerMode = "immediate" | "end"
