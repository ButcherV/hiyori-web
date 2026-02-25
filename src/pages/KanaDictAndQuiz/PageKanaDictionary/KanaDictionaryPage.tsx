import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { KanaBoard } from '../KanaBoard';
import BottomSheet from '../../../components/BottomSheet';
import { KanaDetailSheet } from './KanaDetailSheet';
import type { AnyKanaData } from '../../../datas/kanaData/core';

export const KanaDictionaryPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana'>('hiragana');
  const [showRomaji, setShowRomaji] = useState(true);
  const [selectedRomaji, setSelectedRomaji] = useState<string | null>(null);

  const tabOptions = useMemo(
    () => [
      { id: 'hiragana', label: t('kana_dictionary.tabs.hiragana') },
      { id: 'katakana', label: t('kana_dictionary.tabs.katakana') },
    ],
    [t]
  );

  const handleItemClick = (data: AnyKanaData) => {
    setSelectedRomaji(data.romaji);
  };

  return (
    <>
      <KanaBoard
        activeTab={activeTab}
        showRomaji={showRomaji}
        tabOptions={tabOptions}
        title={t('kana_dictionary.title')}
        seionTitle={t('kana_dictionary.sections.seion')}
        dakuonTitle={t('kana_dictionary.sections.dakuon')}
        yoonTitle={t('kana_dictionary.sections.yoon')}
        onBackClick={() => navigate('/')}
        onTabChange={setActiveTab}
        onToggleRomaji={() => setShowRomaji(!showRomaji)}
        onItemClick={handleItemClick}
      />

      <BottomSheet
        isOpen={selectedRomaji !== null}
        onClose={() => setSelectedRomaji(null)}
      >
        {selectedRomaji && <KanaDetailSheet romaji={selectedRomaji} />}
      </BottomSheet>
    </>
  );
};

export default KanaDictionaryPage;
