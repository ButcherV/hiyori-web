import { useState, useCallback } from 'react';
import { kinshipDB, NODE_LABELS, NODE_KANA, reducePath, type NodeKey, type InputLang } from './kinshipData';
import styles from './HonorificsContent.module.css';

const ALL_KEYS: NodeKey[] = [
  'father', 'mother',
  'olderBrother', 'youngerBrother',
  'olderSister', 'youngerSister',
  'son', 'daughter',
  'husband', 'wife',
];

const EN_PRIMARY_KEYS = ['father', 'mother', 'brother', 'sister', 'son', 'daughter', 'husband', 'wife'] as const;
type EnPrimaryKey = typeof EN_PRIMARY_KEYS[number];

const EN_KEY_LABEL: Record<EnPrimaryKey, string> = {
  father: 'Father', mother: 'Mother',
  brother: 'Brother', sister: 'Sister',
  son: 'Son', daughter: 'Daughter',
  husband: 'Husband', wife: 'Wife',
};

interface PendingEn {
  type: 'brother' | 'sister';
}

export function HonorificsContent() {
  const [inputLang, setInputLang] = useState<InputLang>('zh');
  const [path, setPath] = useState<NodeKey[]>([]);
  const [pendingEn, setPendingEn] = useState<PendingEn | null>(null);

  // 【核心修改】调用引擎化简路径，而非生硬拼接
  const dbKey = reducePath(path);
  const result = path.length > 0 ? kinshipDB[dbKey] : null;
  const hasKey = path.length > 0;
  const notFound = hasKey && !result;

  const labels = NODE_LABELS[inputLang];

  const addNode = useCallback((node: NodeKey) => {
    setPath((prev) => [...prev, node]);
    setPendingEn(null);
  }, []);

  const handleEnPrimary = useCallback((key: EnPrimaryKey) => {
    if (key === 'brother' || key === 'sister') {
      setPendingEn({ type: key });
    } else {
      addNode(key as NodeKey);
    }
  }, [addNode]);

  const handleEnSub = useCallback((age: 'older' | 'younger') => {
    if (!pendingEn) return;
    const node: NodeKey = pendingEn.type === 'brother'
      ? (age === 'older' ? 'olderBrother' : 'youngerBrother')
      : (age === 'older' ? 'olderSister' : 'youngerSister');
    addNode(node);
  }, [pendingEn, addNode]);

  const handleBackspace = useCallback(() => {
    setPendingEn(null);
    setPath((prev) => prev.slice(0, -1));
  }, []);

  const handleClear = useCallback(() => {
    setPendingEn(null);
    setPath([]);
  }, []);

  const changeLang = useCallback((lang: InputLang) => {
    setInputLang(lang);
    setPath([]);
    setPendingEn(null);
  }, []);

  // 修改：让英文直译更符合语法直觉，将 "Me's" 替换为 "My"
  const displayPath = (() => {
    const root = labels['me'];
    if (path.length === 0) return root;
    
    if (inputLang === 'ja') {
      return root + 'の' + path.map((n) => NODE_LABELS.ja[n]).join('の');
    }
    if (inputLang === 'en') {
      const pathString = path.map((n) => NODE_LABELS.en[n]).join("'s ");
      return `My ${pathString}`;
    }
    return root + '的' + path.map((n) => NODE_LABELS.zh[n]).join('的');
  })();

  return (
    <div className={styles.container}>
      {/* Language toggle */}
      <div className={styles.langBar}>
        {(['zh', 'en', 'ja'] as InputLang[]).map((lang) => (
          <button
            key={lang}
            className={`${styles.langBtn} ${inputLang === lang ? styles.langBtnActive : ''}`}
            onClick={() => changeLang(lang)}
          >
            {lang === 'zh' ? '中文' : lang === 'en' ? 'English' : '日本語'}
          </button>
        ))}
      </div>

      {/* Display + result area */}
      <div className={styles.displayArea}>
        {/* Path display */}
        <div className={styles.pathRow}>
          <span className={styles.pathText}>{displayPath}</span>
        </div>

        {/* Result */}
        {result && (
          <div className={styles.resultCard}>
            <div className={styles.resultZhEn}>
              <div className={styles.resultRow}>
                <span className={styles.resultFlag}>🇨🇳</span>
                <span className={styles.resultValue}>{result.zh}</span>
              </div>
              <div className={styles.resultRow}>
                <span className={styles.resultFlag}>🇬🇧</span>
                <span className={styles.resultEnValue}>{result.en}</span>
              </div>
            </div>

            <div className={styles.jaDivider} />

            <div className={styles.jaSection}>
              <div className={styles.jaHeader}>
                <span className={styles.jaFlag}>🇯🇵</span>
                <ruby className={styles.jaKanjiRuby}>
                  {result.ja.kanji}
                  <rt>{result.ja.kana}</rt>
                </ruby>
              </div>

              <div className={styles.jaContextGrid}>
                {result.ja.uchi && (
                  <div className={styles.jaContextRow}>
                    <span className={styles.jaContextLabel}>内</span>
                    <span className={styles.jaContextDesc}>当面称呼</span>
                    <span className={styles.jaContextValue}>{result.ja.uchi}</span>
                  </div>
                )}
                <div className={styles.jaContextRow}>
                  <span className={styles.jaContextLabel}>外</span>
                  <span className={styles.jaContextDesc}>谦称自家</span>
                  <span className={styles.jaContextValue}>{result.ja.soto}</span>
                </div>
                <div className={styles.jaContextRow}>
                  <span className={styles.jaContextLabel}>他</span>
                  <span className={styles.jaContextDesc}>敬称他人</span>
                  <span className={styles.jaContextValue}>{result.ja.tanin}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {notFound && (
          <div className={styles.notFound}>
            暂无数据（可继续拼接或清空重试）
          </div>
        )}
      </div>

      {/* Keyboard */}
      <div className={styles.keyboard}>
        {/* English disambiguation overlay */}
        {inputLang === 'en' && pendingEn && (
          <div className={styles.disambig}>
            <span className={styles.disambigHint}>
              Is this {pendingEn.type === 'brother' ? 'brother' : 'sister'} older or younger?
            </span>
            <div className={styles.disambigRow}>
              <button className={styles.disambigBtn} onClick={() => handleEnSub('older')}>
                Older
              </button>
              <button className={styles.disambigBtn} onClick={() => handleEnSub('younger')}>
                Younger
              </button>
              <button className={styles.cancelBtn} onClick={() => setPendingEn(null)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Main key grid */}
        {!(inputLang === 'en' && pendingEn) && (
          <>
            <div className={styles.keyGrid}>
              {inputLang === 'en'
                ? EN_PRIMARY_KEYS.map((key) => (
                    <button
                      key={key}
                      className={styles.key}
                      onClick={() => handleEnPrimary(key)}
                    >
                      <span className={styles.keyMain}>{EN_KEY_LABEL[key]}</span>
                    </button>
                  ))
                : ALL_KEYS.map((node) => (
                    <button
                      key={node}
                      className={styles.key}
                      onClick={() => addNode(node)}
                    >
                      <span className={styles.keyMain}>{labels[node]}</span>
                      {inputLang === 'ja' && NODE_KANA[node] && (
                        <span className={styles.keySub}>{NODE_KANA[node]}</span>
                      )}
                    </button>
                  ))
              }
              {inputLang !== 'en' && (
                <>
                  <button
                    className={styles.backspaceBtn}
                    onClick={handleBackspace}
                    disabled={path.length === 0}
                  >
                    ⌫
                  </button>
                  <button className={styles.clearBtn} onClick={handleClear}>
                    {inputLang === 'ja' ? 'クリア' : '清空'}
                  </button>
                </>
              )}
            </div>
            {inputLang === 'en' && (
              <div className={styles.actionRow}>
                <button
                  className={styles.backspaceBtn}
                  onClick={handleBackspace}
                  disabled={path.length === 0}
                >
                  ⌫
                </button>
                <button className={`${styles.clearBtn} ${styles.clearBtnWide}`} onClick={handleClear}>
                  Clear
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}