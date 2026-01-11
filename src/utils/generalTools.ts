export const uuid = () => Math.random().toString(36).slice(2, 9);

// Fisher-Yates 洗牌算法 (真正的完全随机)
export const shuffle = <T>(array: T[]): T[] => {
  const newArr = [...array]; // 复制一份，不修改原数组
  for (let i = newArr.length - 1; i > 0; i--) {
    // 随机选一个前面的位置 j
    const j = Math.floor(Math.random() * (i + 1));
    // 交换位置 i 和 j 的元素
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};
