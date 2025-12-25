// src/hooks/useSound.ts
import { useCallback, useEffect, useRef } from 'react';

// 🔥 确保你的文件在 public/sounds/ 目录下
// 这里的路径对应你打包后的 dist/sounds/...
const SOUND_PATHS = {
  score: '/sounds/score.mp3',
  failure: '/sounds/failure.mp3',
};

export const useSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const buffersRef = useRef<Record<string, AudioBuffer>>({});

  useEffect(() => {
    // 1. 初始化 AudioContext (兼容 Safari)
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    audioContextRef.current = ctx;

    // 🔥🔥🔥 核心黑科技：iOS 音频解锁 🔥🔥🔥
    // iOS Safari 默认会挂起音频上下文，必须由用户交互（点击/触摸）来唤醒
    const unlockAudio = () => {
      if (ctx.state === 'suspended') {
        ctx.resume().then(() => {
          console.log('🔊 iOS Audio Context 唤醒成功!');
        });
      }
      // 只需要唤醒一次，解除监听
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };

    // 监听全局点击
    document.addEventListener('click', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);

    // 2. 预加载音频文件 (Fetch + Decode)
    // 这样播放时就没有网络延迟，点击即响
    const loadSounds = async () => {
      for (const [key, path] of Object.entries(SOUND_PATHS)) {
        try {
          const response = await fetch(path);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
          buffersRef.current[key] = audioBuffer;
        } catch (e) {
          console.error(`❌ 音频加载失败: ${path}`, e);
        }
      }
    };

    loadSounds();

    return () => {
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
      if (ctx.state !== 'closed') ctx.close();
    };
  }, []);

  // 3. 播放函数
  const play = useCallback((type: keyof typeof SOUND_PATHS) => {
    const ctx = audioContextRef.current;
    const buffer = buffersRef.current[type];

    if (ctx && buffer) {
      // 必须每次创建新的 Source，不能复用
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    } else {
      // 降级方案：如果 Web Audio API 还没准备好，尝试用普通 Audio 标签
      console.warn('AudioContext 未就绪，降级播放');
      new Audio(SOUND_PATHS[type]).play().catch(() => {});
    }
  }, []);

  return play;
};