import { HIRAGANA_SEION } from '../../datas/kanaData/groups/h-seion';
import { KATAKANA_SEION } from '../../datas/kanaData/groups/k-seion';
import { OriginBadge } from '../../components/OriginBadge';

const H_ROWS: string[][] = [
  ['あ', 'い', 'う', 'え', 'お'],
  ['か', 'き', 'く', 'け', 'こ'],
  ['さ', 'し', 'す', 'せ', 'そ'],
  ['た', 'ち', 'つ', 'て', 'と'],
  ['な', 'に', 'ぬ', 'ね', 'の'],
  ['は', 'ひ', 'ふ', 'へ', 'ほ'],
  ['ま', 'み', 'む', 'め', 'も'],
  ['や', '', 'ゆ', '', 'よ'],
  ['ら', 'り', 'る', 'れ', 'ろ'],
  ['わ', '', '', '', 'を'],
  ['ん', '', '', '', ''],
];

const K_ROWS: string[][] = [
  ['ア', 'イ', 'ウ', 'エ', 'オ'],
  ['カ', 'キ', 'ク', 'ケ', 'コ'],
  ['サ', 'シ', 'ス', 'セ', 'ソ'],
  ['タ', 'チ', 'ツ', 'テ', 'ト'],
  ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ'],
  ['ハ', 'ヒ', 'フ', 'ヘ', 'ホ'],
  ['マ', 'ミ', 'ム', 'メ', 'モ'],
  ['ヤ', '', 'ユ', '', 'ヨ'],
  ['ラ', 'リ', 'ル', 'レ', 'ロ'],
  ['ワ', '', '', '', 'ヲ'],
  ['ン', '', '', '', ''],
];

function KanaTable({
  title,
  rows,
  db,
}: {
  title: string;
  rows: string[][];
  db: Record<string, { kana: string; romaji: string; kanaKanjiOrigin: string }>;
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8 }}>{title}</div>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((kana, ci) => {
                const data = kana ? db[kana] : null;
                return (
                  <td
                    key={ci}
                    style={{
                      padding: '8px 4px',
                      textAlign: 'center',
                      verticalAlign: 'top',
                      border: '1px solid #e0e0e0',
                      background: kana ? '#fff' : '#f0f0f0',
                      minWidth: 60,
                    }}
                  >
                    {data ? (
                      <>
                        <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>{kana}</div>
                        <OriginBadge
                          char={data.kana}
                          romaji={data.romaji}
                          kanjiOrigin={data.kanaKanjiOrigin}
                        />
                      </>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function HiraganaOriginChecker() {
  return (
    <div style={{ padding: '16px 12px', background: '#f8f8f8', borderRadius: 12, margin: '12px 0' }}>
      <KanaTable title="平假名清音 OriginBadge 核对表" rows={H_ROWS} db={HIRAGANA_SEION} />
      <KanaTable title="片假名清音 OriginBadge 核对表" rows={K_ROWS} db={KATAKANA_SEION} />
    </div>
  );
}
