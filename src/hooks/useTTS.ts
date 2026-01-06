// src/hooks/useTTS.ts
import { useCallback, useEffect, useState } from 'react';

export const useTTS = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // 初始化语音列表 (解决 Chrome 异步加载问题)
  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      // 过滤出日语声音，避免列表过长
      const jaVoices = allVoices.filter(
        (v) => v.lang.includes('ja') || v.lang.includes('JP')
      );
      setVoices(jaVoices);
    };

    loadVoices();

    // Chrome 必须监听这个事件才能获取到列表
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  //  朗读
  const speak = useCallback(
    (text: string, gender: 'male' | 'female' = 'male') => {
      if (!text) return;

      // 🔥 播放前强制打断之前的声音
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8; // 语速 (可以在这里扩展参数)

      // 尝试匹配性别 (如果找不到则使用默认声音)
      if (voices.length > 0) {
        const maleKeywords = ['male', 'otoya', 'ichiro', 'kenji'];
        const femaleKeywords = ['female', 'kyoko', 'haruka', 'ayumi'];
        const targetKeywords =
          gender === 'male' ? maleKeywords : femaleKeywords;

        const targetVoice = voices.find((v) =>
          targetKeywords.some((k) => v.name.toLowerCase().includes(k))
        );
        console.log('voices', voices);
        console.log('targetVoice', targetVoice);

        if (targetVoice) {
          utterance.voice = targetVoice;
        } else {
          // 兜底：如果没有匹配性别的，就用列表里的第一个日语声音
          utterance.voice = voices[0];
        }

        // 暂时写死 - 'Reed (日语（日本）)'
        // utterance.voice = voices[5];
      }

      window.speechSynthesis.speak(utterance);
    },
    [voices]
  );

  // 暴露 cancel 方法，供组件销毁时调用
  const cancel = useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);

  return { speak, cancel, voices };
};
