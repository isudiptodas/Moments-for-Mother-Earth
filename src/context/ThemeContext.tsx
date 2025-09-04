"use client"
import { createContext, useContext, useState, ReactNode, useEffect } from "react"

type ThemeContextType = {
  dark: boolean
  setDark: (value: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [dark, setDarkState] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    let initialDark = false
    if (savedTheme === "dark") initialDark = true
    else if (savedTheme === "light") initialDark = false
    setDarkState(initialDark)
    document.documentElement.classList.toggle("dark", initialDark)
  }, [])

  const setDark = (value: boolean) => {
    setDarkState(value)
    localStorage.setItem("theme", value ? "dark" : "light")
    document.documentElement.classList.toggle("dark", value)
  }

  return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used inside ThemeProvider")
  return context
}
