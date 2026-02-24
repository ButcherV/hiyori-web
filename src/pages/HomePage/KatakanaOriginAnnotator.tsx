import { useState, useEffect, useCallback } from 'react';
import { KATAKANA_SEION } from '../../datas/kanaData/groups/k-seion';

type KanaEntry = { kana: string; romaji: string; kanaKanjiOrigin: string };
type GroupInfo = { id: string; element?: string; radical?: string };

const KANA_LIST: KanaEntry[] = Object.values(KATAKANA_SEION);
const KANA_MAP: Record<string, KanaEntry> = Object.fromEntries(KANA_LIST.map(k => [k.kana, k]));
const RADICAL_CLASS = 'kana-radical';

const ROWS = [
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

function getKvgAttr(el: Element, localName: string): string | undefined {
  // Try direct attribute first (works when namespace not declared)
  const direct = el.getAttribute(`kvg:${localName}`);
  if (direct) return direct;
  // Fallback: iterate attributes to find by localName
  for (let i = 0; i < el.attributes.length; i++) {
    if (el.attributes[i].localName === localName) return el.attributes[i].value;
  }
  return undefined;
}

export function KatakanaOriginAnnotator() {
  const [currentKana, setCurrentKana] = useState<KanaEntry>(KANA_LIST[0]);
  const [svgText, setSvgText] = useState('');
  const [groups, setGroups] = useState<GroupInfo[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);
  const [copyLabel, setCopyLabel] = useState('复制 SVG');

  const currentIndex = KANA_LIST.findIndex(k => k.kana === currentKana.kana);

  useEffect(() => {
    setSvgText('');
    setGroups([]);
    setSelected(new Set());
    setSaved(false);

    fetch(`/katakanaOrigin/kata_${currentKana.romaji}.svg`)
      .then(r => { if (!r.ok) throw new Error('not found'); return r.text(); })
      .then(raw => {
        // Clean SVG: remove XML declaration, doctype, style blocks, stroke-number group
        const clean = raw
          .replace(/<\?xml.*?\?>/g, '')
          .replace(/<!DOCTYPE.*?>/g, '')
          .replace(/<style.*?<\/style>/gs, '')
          .replace(/<g[^>]*StrokeNumbers[^>]*>[\s\S]*?<\/g>/g, '');
        setSvgText(clean);

        const parser = new DOMParser();
        const doc = parser.parseFromString(clean, 'image/svg+xml');
        const found: GroupInfo[] = [];
        const pre = new Set<string>();

        doc.querySelectorAll('g[id]').forEach(el => {
          found.push({
            id: el.id,
            element: getKvgAttr(el, 'element'),
            radical: getKvgAttr(el, 'radical'),
          });
          if (el.classList.contains(RADICAL_CLASS)) pre.add(el.id);
        });

        setGroups(found);
        setSelected(pre);
      })
      .catch(err => console.error('Failed to load SVG:', err));
  }, [currentKana]);

  const toggle = useCallback((id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setSaved(false);
  }, []);

  // Click on SVG → find innermost <g> with id
  const handleSvgClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    let el = e.target as Element | null;
    while (el && el.tagName !== 'DIV') {
      if (el.tagName.toLowerCase() === 'g' && el.id) {
        toggle(el.id);
        return;
      }
      el = el.parentElement;
    }
  }, [toggle]);

  const buildModifiedSvg = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, 'image/svg+xml');
    doc.querySelectorAll('g[id]').forEach(el => {
      el.classList.remove(RADICAL_CLASS);
      if (selected.has(el.id)) el.classList.add(RADICAL_CLASS);
    });
    return new XMLSerializer().serializeToString(doc.documentElement);
  };

  const handleDownload = () => {
    const svg = buildModifiedSvg();
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), {
      href: url,
      download: `kata_${currentKana.romaji}.svg`,
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSaved(true);
  };

  const handleCopy = async () => {
    const svg = buildModifiedSvg();
    await navigator.clipboard.writeText(svg);
    setCopyLabel('已复制 ✓');
    setTimeout(() => setCopyLabel('复制 SVG'), 2000);
  };

  // CSS to highlight selected groups inside the SVG preview
  const highlightCss = groups.map(({ id }) =>
    selected.has(id)
      ? `[id="${id}"] path { stroke: #FF3B30 !important; stroke-width: 9px !important; }`
      : `[id="${id}"] path { stroke: #e0e0e0 !important; stroke-width: 5px !important; }`
  ).join('\n');

  const displaySvg = svgText
    ? svgText.replace(/<svg\b/, '<svg style="width:100%;height:100%;display:block"')
    : '';

  const btn = (
    onClick: () => void,
    label: string,
    primary = false,
    green = false,
  ) => (
    <button
      onClick={onClick}
      style={{
        padding: '6px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontWeight: primary ? 600 : 400,
        border: primary ? 'none' : '1px solid #d0d0d0',
        background: green ? '#34C759' : primary ? '#007AFF' : '#fff',
        color: primary ? '#fff' : '#333',
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ padding: 16, background: '#f0f4ff', borderRadius: 12, margin: '12px 0', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, color: '#333' }}>片假名字源标注工具</div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

        {/* ── 左侧：假名表格 + 翻页 ── */}
        <div style={{ flexShrink: 0 }}>
          {ROWS.map((row, ri) => (
            <div key={ri} style={{ display: 'flex', gap: 3, marginBottom: 3 }}>
              {row.map((k, ci) => {
                const data = k ? KANA_MAP[k] : null;
                const active = k === currentKana.kana;
                return (
                  <div
                    key={ci}
                    onClick={() => data && setCurrentKana(data)}
                    style={{
                      width: 32, height: 32,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: 5, fontSize: 15, fontWeight: active ? 700 : 400,
                      cursor: data ? 'pointer' : 'default',
                      background: active ? '#007AFF' : data ? '#fff' : 'transparent',
                      color: active ? '#fff' : '#333',
                      border: data ? '1px solid #d0d0d0' : 'none',
                    }}
                  >
                    {k}
                  </div>
                );
              })}
            </div>
          ))}
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            {btn(() => currentIndex > 0 && setCurrentKana(KANA_LIST[currentIndex - 1]), '← 上一个')}
            {btn(() => currentIndex < KANA_LIST.length - 1 && setCurrentKana(KANA_LIST[currentIndex + 1]), '下一个 →')}
          </div>
        </div>

        {/* ── 中间：SVG 交互区 ── */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ fontSize: 12, color: '#555', marginBottom: 6 }}>
            <strong style={{ fontSize: 18 }}>{currentKana.kana}</strong>
            {' '}源自{' '}
            <strong style={{ fontSize: 16 }}>「{currentKana.kanaKanjiOrigin}」</strong>
            {' '}的局部
          </div>
          <div style={{ fontSize: 11, color: '#999', marginBottom: 6 }}>
            点击 SVG 笔画选中所在组 / 在右侧列表直接勾选
          </div>

          {/* SVG 显示 */}
          <div
            onClick={handleSvgClick}
            style={{
              width: 220, height: 220,
              background: '#fff', border: '1px solid #ccc', borderRadius: 8,
              overflow: 'hidden', cursor: 'crosshair', position: 'relative',
            }}
          >
            <style>{highlightCss}</style>
            {displaySvg
              ? <div dangerouslySetInnerHTML={{ __html: displaySvg }} style={{ width: '100%', height: '100%' }} />
              : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#bbb', fontSize: 12 }}>加载中…</div>
            }
          </div>

          {/* 操作按钮 */}
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            {btn(() => { setSelected(new Set()); setSaved(false); }, '清除全部')}
            {btn(handleCopy, copyLabel)}
            {btn(handleDownload, saved ? '已下载 ✓' : '下载 SVG', true, saved)}
          </div>
          <div style={{ marginTop: 5, fontSize: 10, color: '#bbb', fontFamily: 'monospace' }}>
            → public/katakanaOrigin/kata_{currentKana.romaji}.svg
          </div>
        </div>

        {/* ── 右侧：group 列表 ── */}
        <div style={{ flex: 1, minWidth: 140 }}>
          <div style={{ fontSize: 12, color: '#555', marginBottom: 6, fontWeight: 500 }}>笔画组</div>
          <div style={{ overflowY: 'auto', maxHeight: 280 }}>
            {groups.map(({ id, element, radical }) => {
              const isSelected = selected.has(id);
              const shortId = id.split(':').pop() ?? id; // e.g. "0963f-g1"
              return (
                <div
                  key={id}
                  onClick={() => toggle(id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '5px 8px', marginBottom: 3, borderRadius: 5,
                    cursor: 'pointer',
                    background: isSelected ? '#FFE5E5' : '#fff',
                    border: `1px solid ${isSelected ? '#FF3B30' : '#e0e0e0'}`,
                  }}
                >
                  <span style={{
                    width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                    border: `2px solid ${isSelected ? '#FF3B30' : '#ccc'}`,
                    background: isSelected ? '#FF3B30' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isSelected && <span style={{ color: '#fff', fontSize: 9, lineHeight: 1 }}>✓</span>}
                  </span>
                  <span style={{ fontSize: 13, color: isSelected ? '#FF3B30' : '#555', fontWeight: isSelected ? 600 : 400 }}>
                    {element ?? '—'}
                  </span>
                  <span style={{ fontSize: 10, color: '#aaa', fontFamily: 'monospace', marginLeft: 'auto' }}>
                    {shortId}
                    {radical ? ` (${radical})` : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
