import { useState, useRef, useEffect } from 'react';

/**
 * 滚动阴影 Hook
 * @param threshold 滚动多少像素显示阴影，默认 10px
 */
export function useScrollShadow(threshold = 10) {
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const handleScroll = () => {
      // 只有状态改变时才 set，减少 re-render
      const shouldShow = element.scrollTop > threshold;
      setIsScrolled((prev) => (prev !== shouldShow ? shouldShow : prev));
    };

    // 监听滚动
    element.addEventListener('scroll', handleScroll);

    // 清理
    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  return { scrollRef, isScrolled };
}
