import Calculator from './components/Calculator'

function App() {
  return (
    <div className="min-h-screen transition-colors duration-500 bg-slate-100 dark:bg-transparent flex items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-400/20 dark:bg-primary-dark/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen pointer-events-none transition-all duration-500"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-900/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen pointer-events-none transition-all duration-500"></div>
      
      <main className="relative z-10 w-full flex justify-center">
        <Calculator />
      </main>
    </div>
  )
}

export default App
