import React, { useState, useRef } from 'react';
import { Volume2, Move } from 'lucide-react';
import './Clock.css'; // 引入上面的 CSS 文件

// ==========================================
// 逻辑部分 (保持不变)
// ==========================================
const getMinuteType = (m: number): 'fun' | 'ppun' => {
  const lastDigit = m % 10;
  if ([2, 5, 7, 9].includes(lastDigit)) return 'fun';
  return 'ppun';
};

const getMinuteText = (m: number) => {
  if (m === 0) return { kana: 'ちょうど', romaji: 'chōdo' };

  const simpleMap: Record<
    number,
    { kana: string; romaji: string; type: 'fun' | 'ppun' }
  > = {
    1: { kana: 'いっぷん', romaji: 'ippun', type: 'ppun' },
    2: { kana: 'にふん', romaji: 'nifun', type: 'fun' },
    3: { kana: 'さんぷん', romaji: 'sanpun', type: 'ppun' },
    4: { kana: 'よんぷん', romaji: 'yonpun', type: 'ppun' },
    5: { kana: 'ごふん', romaji: 'gofun', type: 'fun' },
    6: { kana: 'ろっぷん', romaji: 'roppun', type: 'ppun' },
    7: { kana: 'ななふん', romaji: 'nanafun', type: 'fun' },
    8: { kana: 'はっぷん', romaji: 'happun', type: 'ppun' },
    9: { kana: 'きゅうふん', romaji: 'kyūfun', type: 'fun' },
    10: { kana: 'じゅっぷん', romaji: 'juppun', type: 'ppun' },
    30: { kana: 'はん', romaji: 'han', type: 'ppun' },
  };

  if (simpleMap[m]) return simpleMap[m];

  const type = getMinuteType(m);
  return {
    kana: type === 'ppun' ? '...ぷん' : '...ふん',
    romaji: type === 'ppun' ? '...ppun' : '...fun',
  };
};

export const MagicClock = () => {
  const [minute, setMinute] = useState(15);
  const [isDragging, setIsDragging] = useState(false);
  const clockRef = useRef<HTMLDivElement>(null);

  const minuteType = getMinuteType(minute);
  const timeData = getMinuteText(minute);

  // 核心判断：是否是变调 (排除 0 和 30 的特殊情况以简化演示)
  const isPpun = minuteType === 'ppun' && minute !== 0 && minute !== 30;

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if (!clockRef.current) return;
    const rect = clockRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const clientX =
      'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY =
      'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const angleRad = Math.atan2(clientY - centerY, clientX - centerX);
    let angleDeg = angleRad * (180 / Math.PI) + 90;
    if (angleDeg < 0) angleDeg += 360;

    let m = Math.round((angleDeg / 360) * 60);
    if (m === 60) m = 0;

    setMinute(m);
  };

  return (
    // 根据状态切换根容器的 class：默认是空，变调时加上 mode-ppun
    <div className={`magic-clock-container ${isPpun ? 'mode-ppun' : ''}`}>
      {/* 标题区 */}
      <div className="mc-header">
        <h2 className="mc-title">Magic Lens Clock</h2>
        <p className="mc-subtitle">拖动指针体验“变调”</p>
      </div>

      {/* --- 钟表主体 --- */}
      <div
        ref={clockRef}
        className="mc-clock-face"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={(e) => isDragging && handleInteraction(e)}
        onTouchMove={(e) => handleInteraction(e)}
        onClick={(e) => handleInteraction(e)}
      >
        {/* 刻度装饰 (动态生成) */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="mc-tick"
            style={{ transform: `translateX(-50%) rotate(${i * 30}deg)` }}
          />
        ))}

        {/* 12, 3, 6, 9 数字 */}
        <span className="mc-number mc-num-12">12</span>
        <span className="mc-number mc-num-3">3</span>
        <span className="mc-number mc-num-6">6</span>
        <span className="mc-number mc-num-9">9</span>

        {/* 中心点 */}
        <div className="mc-center-dot" />

        {/* 分针 */}
        <div
          className="mc-hand"
          style={{ transform: `rotate(${minute * 6}deg)` }}
        >
          {/* 指针头部的旋钮 */}
          <div className="mc-hand-knob" />
        </div>
      </div>

      {/* --- 教学反馈区 --- */}
      <div className="mc-feedback-area">
        <div className="mc-status-badge">
          {isPpun ? '⚠️ Ppun (变调)' : '✅ Fun (正常)'}
        </div>

        <div className="mc-digital-time">
          {String(minute).padStart(2, '0')}
          <span className="mc-digital-unit">分</span>
        </div>

        <div className="mc-kana-box">
          {/* 这里 key 的作用是每次数字变化时，强行重绘元素，从而重新触发 animation */}
          <span key={`kana-${minute}`} className="mc-kana-text">
            {timeData.kana}
          </span>
          <span className="mc-romaji-text">{timeData.romaji}</span>
        </div>
      </div>

      {/* 底部提示 */}
      <div className="mc-footer">
        <Move size={14} />
        <span>直接在表盘上滑动</span>
        <span style={{ margin: '0 8px', opacity: 0.3 }}>|</span>
        <Volume2 size={14} />
        <span>建议开启声音</span>
      </div>
    </div>
  );
};
