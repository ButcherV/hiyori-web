import styles from './App.module.css';
import { QuizSession } from './components/QuizSession';

function App() {
  return (
    // 直接用全屏容器
    <div className={styles.appContainer}>
      <QuizSession />
    </div>
  );
}

export default App;