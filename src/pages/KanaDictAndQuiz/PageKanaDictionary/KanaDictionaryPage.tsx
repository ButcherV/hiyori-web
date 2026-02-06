import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { KanaBoard } from '../KanaBoard';

export const KanaDictionaryPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // 状态管理
  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana'>(
    'hiragana'
  );
  const [showRomaji, setShowRomaji] = useState(true);

  // 这里的 Tab 选项
  const tabOptions = useMemo(
    () => [
      { id: 'hiragana', label: t('kana_dictionary.tabs.hiragana') },
      { id: 'katakana', label: t('kana_dictionary.tabs.katakana') },
    ],
    [t]
  );

  const handleItemClick = (data: any) => {
    console.log('Clicked:', data);
    // navigate(...)
  };

  return (
    <KanaBoard
      // State
      activeTab={activeTab}
      showRomaji={showRomaji}
      tabOptions={tabOptions}
      // I18n Texts
      title={t('kana_dictionary.title')}
      // romajiLabel={t('kana_dictionary.romaji_label')}
      seionTitle={t('kana_dictionary.sections.seion')}
      dakuonTitle={t('kana_dictionary.sections.dakuon')}
      yoonTitle={t('kana_dictionary.sections.yoon')}
      // Handlers
      onBackClick={() => navigate('/')}
      onTabChange={setActiveTab}
      onToggleRomaji={() => setShowRomaji(!showRomaji)}
      onItemClick={handleItemClick}
    />
  );
};

export default KanaDictionaryPage;
