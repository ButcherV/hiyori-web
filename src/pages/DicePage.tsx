import { useState } from 'react';
import { DiceRoller } from '../components/Dice/DiceContainer';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2 } from 'lucide-react';

// --- 0-10 教学数据字典 ---
const LEARNING_DATA: Record<
  number,
  { kanji: string; romaji: string; hint?: string; audio?: string }
> = {
  0: { kanji: '零', romaji: 'Zero / Rei' },
  1: { kanji: '一', romaji: 'Ichi' },
  2: { kanji: '二', romaji: 'Ni' },
  3: { kanji: '三', romaji: 'San' },
  4: {
    kanji: '四',
    romaji: 'Yon',
    hint: '⚠️ "Shi" sounds like death, so we count with "Yon"!',
  }, // 重点教学
  5: { kanji: '五', romaji: 'Go' },
  6: { kanji: '六', romaji: 'Roku' },
  7: {
    kanji: '七',
    romaji: 'Nana',
    hint: '⚠️ "Shichi" is hard to hear, "Nana" is clearer.',
  }, // 重点教学
  8: { kanji: '八', romaji: 'Hachi' },
  9: { kanji: '九', romaji: 'Kyuu', hint: '⚠️ "Ku" sounds like suffering.' }, // 重点教学
  10: { kanji: '十', romaji: 'Juu' },
};

export const DicePage = () => {
  const navigate = useNavigate();
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [animateCard, setAnimateCard] = useState(false);

  // 处理骰子结果
  const handleRollComplete = (values: number[]) => {
    const total = values[0] + values[1];
    setCurrentNumber(total);

    // 触发卡片弹入动画
    setAnimateCard(false);
    setTimeout(() => setAnimateCard(true), 50);

    // 可以在这里播放声音
    // playAudio(total);
  };

  const data = currentNumber !== null ? LEARNING_DATA[currentNumber] : null;

  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 1. 顶部导航 */}
      <div
        style={{
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          background: 'white',
          zIndex: 10,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            background: '#f3f4f6',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={20} color="#333" />
        </button>
        <h2
          style={{
            marginLeft: '16px',
            fontSize: '18px',
            fontWeight: 800,
            color: '#333',
          }}
        >
          Level 1: 0 - 10
        </h2>
      </div>

      {/* 2. 3D 骰子区域 (上半部分) */}
      <div style={{ padding: '0 16px' }}>
        <DiceRoller onRoll={handleRollComplete} />
      </div>

      {/* 3. 教学卡片区域 (下半部分 - 自动更新) */}
      <div
        style={{
          flex: 1,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          background: 'linear-gradient(180deg, #fff 0%, #f9fafb 100%)',
        }}
      >
        {!data ? (
          // 空状态提示
          <div style={{ marginTop: '40px', color: '#9ca3af', fontWeight: 500 }}>
            👆 Drag the dice to start learning!
          </div>
        ) : (
          // 教学卡片
          <div
            style={{
              width: '100%',
              maxWidth: '340px',
              background: 'white',
              borderRadius: '24px',
              padding: '32px 24px',
              boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
              border: '2px solid #f3f4f6',
              textAlign: 'center',
              transform: animateCard
                ? 'translateY(0) scale(1)'
                : 'translateY(20px) scale(0.95)',
              opacity: animateCard ? 1 : 0,
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)', // 弹性动画
            }}
          >
            {/* 数字标题 */}
            <div
              style={{
                fontSize: '16px',
                color: '#6b7280',
                fontWeight: 600,
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Number {currentNumber}
            </div>

            {/* 汉字 (Kanji) */}
            <div
              style={{
                fontSize: '84px',
                color: '#111827',
                fontWeight: 900, // 像 Bungee 字体那样粗
                lineHeight: 1,
                marginBottom: '12px',
              }}
            >
              {data.kanji}
            </div>

            {/* 读音 (Romaji) + 喇叭图标 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: '#eff6ff',
                color: '#2563eb',
                padding: '8px 20px',
                borderRadius: '50px',
                fontSize: '24px',
                fontWeight: 'bold',
                margin: '0 auto',
                width: 'fit-content',
              }}
            >
              <span>{data.romaji}</span>
              <Volume2 size={20} style={{ cursor: 'pointer' }} />
            </div>

            {/* 教学提示 (针对 4, 7, 9) */}
            {data.hint && (
              <div
                style={{
                  marginTop: '24px',
                  padding: '12px',
                  background: '#fff7ed',
                  border: '1px solid #ffedd5',
                  borderRadius: '12px',
                  color: '#c2410c',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  fontWeight: 500,
                  textAlign: 'left',
                }}
              >
                {data.hint}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
