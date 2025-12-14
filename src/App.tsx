import { useState } from 'react'
import styles from './App.module.css' 

function App() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>日和 Hiyori</h1>
        <p style={{ color: 'var(--color-text-sub)' }}>
          CSS Architecture Ready
        </p>
      </header>
      
      <main>
        <div className={styles.cardDemo}>
          <span>🇯🇵 + 🍎</span>
        </div>
      </main>
    </div>
  )
}

export default App