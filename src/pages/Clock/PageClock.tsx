import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TimeDrumPicker } from './TimeDrumPicker';
import styles from './PageClock.module.css';

export function PageClock() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const pageRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={pageRef} className={styles.page}>
      <div className={styles.systemHeader}>
        <div className={styles.headerLeft}>
          <button className={styles.iconBtn} onClick={() => navigate('/')}>
            <ChevronLeft size={24} />
          </button>
          <span className={styles.headerTitle}>
            {t('clock_study.title')}
          </span>
        </div>
      </div>
      <div className={styles.workspace}>
        <TimeDrumPicker />
      </div>
      
    </div>
  );
}
