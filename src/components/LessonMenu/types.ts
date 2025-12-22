export type LessonCategory = 'seion' | 'dakuon' | 'yoon'; // 新增分类

export interface LessonItem {
  id: string;
  category: LessonCategory; // ✅ 必填：属于哪个分类
  title: string;
  preview: string;
}

export type LessonStatus = 'mastered' | 'current' | 'new';
