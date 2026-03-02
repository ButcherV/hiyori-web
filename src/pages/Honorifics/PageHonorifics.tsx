import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { HonorificsContent } from './HonorificsContent';
import styles from './PageHonorifics.module.css';

export function PageHonorifics() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.systemHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.iconBtn} onClick={() => navigate('/')}>
            <ChevronLeft size={24} color="white" />
          </div>
          <div className={styles.titleWrapper}>
            <span className={styles.headerTitle}>
              {t('home.drills.honorifics')}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.workspace}>
        <HonorificsContent />
      </div>
    </div>
  );
}
