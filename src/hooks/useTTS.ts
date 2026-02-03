// src/hooks/useTTS.ts
import { useCallback, useEffect, useState, useRef } from 'react';

export const useTTS = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  // 使用 ref 来保存 voices，以便在 speak 回调中总能拿到最新值，避免闭包陷阱（虽然 voices 已经在依赖项里了，但这样更稳）
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  const updateVoices = useCallback(() => {
    const allVoices = window.speechSynthesis.getVoices();
    // 宽松过滤：只要包含 ja 或 JP 即可
    const jaVoices = allVoices.filter(
      (v) => v.lang.includes('ja') || v.lang.includes('JP')
    );
    setVoices(jaVoices);
    voicesRef.current = jaVoices;
  }, []);

  useEffect(() => {
    updateVoices();

    // 🟢 修复 2: 使用 addEventListener 避免覆盖全局事件
    window.speechSynthesis.addEventListener('voiceschanged', updateVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', updateVoices);
    };
  }, [updateVoices]);

  const speak = useCallback(
    (
      text: string,
      options: {
        gender?: 'male' | 'female';
        rate?: number; // 🟢 允许外部控制语速
        pitch?: number;
      } = {}
    ) => {
      if (!text) return;

      const { gender = 'male', rate = 1.0, pitch = 1.0 } = options;

      // 🔥 播放前打断
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      // 🟢 修复 1: 默认语速 1.0，避免慢速导致的破碎感
      utterance.rate = rate;
      utterance.pitch = pitch;

      // 🟢 修复 3: 再次尝试获取声音 (应对初始化抢跑)
      let currentVoices = voicesRef.current;
      if (currentVoices.length === 0) {
        const all = window.speechSynthesis.getVoices();
        currentVoices = all.filter(
          (v) => v.lang.includes('ja') || v.lang.includes('JP')
        );
      }

      if (currentVoices.length > 0) {
        // 尝试匹配性别 (注意：移动端很多声音名字里不带性别标识，这只是尽力而为)
        const maleKeywords = [
          'male',
          'otoya',
          'ichiro',
          'kenji',
          'google 日本語',
        ]; // Android Google TTS 通常较深沉
        const femaleKeywords = ['female', 'kyoko', 'haruka', 'ayumi', 'siri']; // Siri 通常是女声
        const targetKeywords =
          gender === 'male' ? maleKeywords : femaleKeywords;

        const targetVoice = currentVoices.find((v) =>
          targetKeywords.some((k) => v.name.toLowerCase().includes(k))
        );

        // 如果匹配到了就用匹配的，没匹配到就用第一个日语声音
        // 这样至少保证是“日语引擎”在读，而不是“英语引擎”在硬读
        utterance.voice = targetVoice || currentVoices[0];
      }

      console.log('TTS Speak:', { text, voice: utterance.voice?.name, rate });
      window.speechSynthesis.speak(utterance);
    },
    [] // 移除 voices 依赖，改用 ref，减少 speak 函数的重建
  );

  const cancel = useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);

  return { speak, cancel, voices };
};
