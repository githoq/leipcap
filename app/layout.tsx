import type { Metadata, Viewport } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Lei Orgânica da Polícia Civil do Amapá | Simulado",
  description: "Questões e simulados para estudo da Lei nº 883/2005 - Lei Orgânica da Polícia Civil do Estado do Amapá. Prepare-se para o concurso da PC-AP.",
  keywords: ["polícia civil", "amapá", "concurso", "simulado", "lei 883/2005", "questões", "PC-AP"],
  authors: [{ name: "LeiPCAP" }],
  openGraph: {
    title: "Lei Orgânica da Polícia Civil do Amapá | Simulado",
    description: "Questões e simulados para estudo da Lei nº 883/2005 - Lei Orgânica da Polícia Civil do Estado do Amapá.",
    type: "website",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0f1a",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${geistMono.variable} bg-background`}
    >
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
