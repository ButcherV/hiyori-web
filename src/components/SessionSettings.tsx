import { motion, AnimatePresence } from 'framer-motion';
// 引入类型，防止 Vite 报错
import type { PanInfo } from 'framer-motion'; 

import styles from './SessionSettings.module.css';
import { useSettings } from '../context/SettingsContext';

interface SessionSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onQuit: () => void;
}

export function SessionSettings({ isOpen, onClose, onQuit }: SessionSettingsProps) {
  const { 
    showRomaji, autoAudio, soundEffect, hapticFeedback, 
    toggleSetting 
  } = useSettings();

  const handleDragEnd = (event: any, info: PanInfo) => {
    // 下滑超过 100px 或 快速甩动，则关闭
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div 
              className={styles.sheet}
              
              // 1. 强制样式：解决“样式崩坏”的核心
              // 防止 drag 导致 flex 子元素宽度丢失
              style={{ width: '100%' }}

              initial={{ y: "100%" }} 
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              
              // 2. 动画参数：干脆利落，无回弹
              transition={{ type: "spring", damping: 40, stiffness: 400 }}
              
              onClick={(e) => e.stopPropagation()} 
              
              // 3. 拖拽配置优化
              drag="y" 
              dragConstraints={{ top: 0 }} // 禁止向上拖出
              dragElastic={0.2}            // 顶部阻力感 (越小越难拉动)
              dragMomentum={false}         // 🔥 关键：禁用动量，松手即停/回弹，防止乱飘
              onDragEnd={handleDragEnd} 
            >
              <div className={styles.handleBar}>
                <div className={styles.handle} />
              </div>

              <div className={styles.header}>
                <div className={styles.title}>学习设置</div>
              </div>

              <div className={styles.grid}>
                {/* 罗马音 */}
                <div 
                  className={`${styles.toggleCard} ${showRomaji ? styles.active : ''}`}
                  onClick={() => toggleSetting('showRomaji')}
                >
                  <div className={styles.icon}>🅰️</div>
                  <div className={styles.label}>罗马音</div>
                  <div className={styles.status}>{showRomaji ? '显示' : '隐藏'}</div>
                </div>

                {/* 自动发音 */}
                <div 
                  className={`${styles.toggleCard} ${autoAudio ? styles.active : ''}`}
                  onClick={() => toggleSetting('autoAudio')}
                >
                  <div className={styles.icon}>🗣️</div>
                  <div className={styles.label}>自动发音</div>
                  <div className={styles.status}>{autoAudio ? '开启' : '关闭'}</div>
                </div>

                {/* 音效 */}
                <div 
                  className={`${styles.toggleCard} ${soundEffect ? styles.active : ''}`}
                  onClick={() => toggleSetting('soundEffect')}
                >
                  <div className={styles.icon}>🔊</div>
                  <div className={styles.label}>提示音</div>
                  <div className={styles.status}>{soundEffect ? '开启' : '静音'}</div>
                </div>

                {/* 震动 */}
                <div 
                  className={`${styles.toggleCard} ${hapticFeedback ? styles.active : ''}`}
                  onClick={() => toggleSetting('hapticFeedback')}
                >
                  <div className={styles.icon}>📳</div>
                  <div className={styles.label}>震动反馈</div>
                  <div className={styles.status}>{hapticFeedback ? '开启' : '关闭'}</div>
                </div>
              </div>

              <button className={styles.quitButton} onClick={onQuit}>
                🚪 结束本次学习
              </button>

            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}