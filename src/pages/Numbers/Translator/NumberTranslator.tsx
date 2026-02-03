// src/pages/Numbers/Translator/NumberTranslator.tsx

import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

import styles from './NumberTranslator.module.css';

import { useNumberTranslation } from './useNumberTranslation';
import { useTTS } from '../../../hooks/useTTS';

import { TranslationResultArea } from './TranslationResultArea';
import { InputDisplayArea } from './InputDisplayArea';
import { KeypadArea } from './KeypadArea';
import { Toast } from '../../../components/Toast/Toast';

// 引入 useTranslation
import { useTranslation } from 'react-i18next';

export const NumberTranslator = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { speak } = useTTS();
  const { translate } = useNumberTranslation();

  const [inputVal, setInputVal] = useState('12345678');

  // Toast 状态
  const [toastConfig, setToastConfig] = useState({
    isVisible: false,
    message: '',
    description: '',
  });

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const showToast = (message: string, description: string = '') => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setToastConfig({
      isVisible: true,
      message,
      description,
    });

    timerRef.current = setTimeout(() => {
      setToastConfig((prev) => ({ ...prev, isVisible: false }));
    }, 2000);
  };

  const result = useMemo(() => translate(inputVal), [inputVal, translate]);

  const handleKeyClick = (key: number | string) => {
    if (Capacitor.isNativePlatform()) {
      Haptics.impact({ style: ImpactStyle.Light });
    }

    if (key === 'delete') {
      setInputVal((prev) => prev.slice(0, -1));
      return;
    }

    if (key === 'clear') {
      setInputVal('');
      return;
    }

    // 🟢 拦截逻辑：使用 i18n
    if (inputVal.length >= 16) {
      if (Capacitor.isNativePlatform()) {
        Haptics.impact({ style: ImpactStyle.Medium });
      }
      showToast(
        t('number_study.translator.toast_max_limit_title'), // "已达到最大长度"
        t('number_study.translator.toast_max_limit_desc') // "最多只能输入 16 位数字哦"
      );
      return;
    }

    if (inputVal === '0') {
      setInputVal(key.toString());
    } else {
      setInputVal((prev) => prev + key.toString());
    }
  };

  const handlePlayAudio = () => {
    if (!result) return;

    // 方案: 使用逗号连接 (推荐，会有自然的换气感)
    // 效果: "せんにひゃくさんじゅうよんまん、ごせんろっぴゃくななじゅうはち"
    const fullKana = result.blocks
      .map(
        (b) =>
          b.kana +
          (b.unitReading === 'man'
            ? 'まん' // 这里不要加空格
            : b.unitReading === 'oku'
              ? 'おく' // 这里不要加空格
              : '')
      )
      .join('、'); // 用逗号，或者直接用空字符串 ''

    console.log('fullKana', fullKana);
    speak(fullKana);
  };

  return (
    <div className={styles.container}>
      <Toast
        isVisible={toastConfig.isVisible}
        message={toastConfig.message}
        description={toastConfig.description}
      />

      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <span className={styles.title}>
          {t('number_study.translator.title')}
        </span>
        <div className={styles.headerPlaceholder} />
      </div>
      <TranslationResultArea inputVal={inputVal} result={result} />

      <InputDisplayArea inputVal={inputVal} onPlayAudio={handlePlayAudio} />
      <KeypadArea onKeyClick={handleKeyClick} />
    </div>
  );
};
