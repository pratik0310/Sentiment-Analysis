// pages/Analyze.jsx  (was Upload.jsx)
import { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── helpers ─────────────────────────────────────────────────────────────── */

function sentimentLabel(score) {
  if (score > 0.3)  return { text: 'BULLISH',  color: '#00d97e' };
  if (score < -0.3) return { text: 'BEARISH',  color: '#ff5757' };
  return                    { text: 'NEUTRAL',  color: '#f0b429' };
}

function ScoreBar({ score }) {
  // score: –1 … +1  →  bar left: 0–100%
  const pct   = ((score + 1) / 2) * 100;
  const label = sentimentLabel(score);
  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '6px',
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '11px',
        letterSpacing: '0.08em',
      }}>
        <span style={{ color: '#2a3f2a' }}>BEARISH</span>
        <span style={{ color: label.color, fontWeight: 500 }}>
          {score > 0 ? '+' : ''}{score.toFixed(2)} — {label.text}
        </span>
        <span style={{ color: '#2a3f2a' }}>BULLISH</span>
      </div>

      <div style={{
        height: '6px',
        background: '#0d180d',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* center tick */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: 0, bottom: 0,
          width: '1px',
          background: '#1e3a1e',
        }}/>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.abs(score) * 50}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: 0, bottom: 0,
            left:  score >= 0 ? '50%' : undefined,
            right: score <  0 ? '50%' : undefined,
            background: label.color,
          }}
        />
      </div>
    </div>
  );
}

function FlagList({ flags, type }) {
  const bull = type === 'green';
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '10px',
        letterSpacing: '0.14em',
        color: bull ? '#00d97e' : '#ff5757',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span style={{
          display: 'inline-block',
          width: '8px', height: '8px',
          background: bull ? '#00d97e' : '#ff5757',
          clipPath: bull
            ? 'polygon(50% 0%, 0% 100%, 100% 100%)'
            : 'polygon(0% 0%, 100% 0%, 50% 100%)',
        }}/>
        {bull ? 'GREEN FLAGS' : 'RED FLAGS'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {flags.map((flag, i) => (
          <div key={i} style={{
            display: 'flex',
            gap: '10px',
            fontSize: '13px',
            color: bull ? '#4d8a4d' : '#8a4d4d',
            lineHeight: 1.55,
            fontWeight: 300,
          }}>
            <span style={{
              flexShrink: 0,
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              color: bull ? '#1e3a1e' : '#3a1e1e',
              marginTop: '2px',
            }}>{String(i + 1).padStart(2, '0')}</span>
            {flag}
          </div>
        ))}
      </div>
    </div>
  );
}

function StockCard({ item, index }) {
  const label = item.analysis?.score !== undefined
    ? sentimentLabel(item.analysis.score)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      style={{
        background: '#070d07',
        borderTop: '1px solid #141f14',
        borderRight: '1px solid #141f14',
        borderBottom: '1px solid #141f14',
        borderLeft: `2px solid ${item.error ? '#ff5757' : (label?.color ?? '#1e3a1e')}`,
        padding: '24px',
      }}
    >
      {/* Card header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid #0d180d',
      }}>
        <div>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '28px',
            letterSpacing: '0.06em',
            color: '#e8f5e8',
            lineHeight: 1,
          }}>
            {item.stock}
          </div>
          {item.headlinesFound > 0 && (
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              color: '#2a3f2a',
              letterSpacing: '0.1em',
              marginTop: '5px',
            }}>
              {item.headlinesFound} ARTICLES SCANNED
            </div>
          )}
        </div>

        {label && (
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.14em',
            color: label.color,
            border: `1px solid ${label.color}22`,
            padding: '5px 12px',
            background: `${label.color}0a`,
          }}>
            {label.text}
          </div>
        )}
      </div>

      {item.error ? (
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '12px',
          color: '#ff5757',
          background: '#1a0808',
          border: '1px solid #3a1515',
          padding: '12px 16px',
          letterSpacing: '0.06em',
        }}>
          ERR // {item.error}
        </div>
      ) : (
        <>
          {/* Score bar */}
          {item.analysis?.score !== undefined && (
            <div style={{ marginBottom: '20px' }}>
              <ScoreBar score={item.analysis.score} />
              {(item.analysis.analysisType || item.analysis.confidence) && (
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '10px',
                  color: '#2a3f2a',
                  letterSpacing: '0.08em',
                  marginTop: '8px',
                }}>
                  {[
                    item.analysis.analysisType && `TYPE: ${item.analysis.analysisType.toUpperCase()}`,
                    item.analysis.confidence   && `CONFIDENCE: ${item.analysis.confidence.toUpperCase()}`,
                  ].filter(Boolean).join('  //  ')}
                </div>
              )}
            </div>
          )}

          {item.analysis?.redFlags?.length   > 0 && <FlagList flags={item.analysis.redFlags}   type="red"   />}
          {item.analysis?.greenFlags?.length > 0 && <FlagList flags={item.analysis.greenFlags} type="green" />}

          {/* Summary */}
          {item.analysis?.summary && (
            <div style={{
              borderLeft: '2px solid #1e3a1e',
              paddingLeft: '14px',
              marginTop: '16px',
            }}>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '10px',
                color: '#2a3f2a',
                letterSpacing: '0.1em',
                marginBottom: '8px',
              }}>
                SUMMARY
              </div>
              <p style={{
                fontSize: '13px',
                color: '#4d6a4d',
                lineHeight: 1.75,
                fontWeight: 300,
                margin: 0,
              }}>
                {item.analysis.summary}
              </p>
            </div>
          )}

          {/* Note */}
          {item.analysis?.note && (
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              color: '#1e3a1e',
              letterSpacing: '0.06em',
              marginTop: '14px',
              paddingTop: '12px',
              borderTop: '1px solid #0d180d',
            }}>
              // {item.analysis.note}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

/* ─── main component ──────────────────────────────────────────────────────── */

export default function Analyze() {
  const { user } = useUser();

  const [file,       setFile]       = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result,     setResult]     = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [dragging,   setDragging]   = useState(false);
  const [loadMsg,    setLoadMsg]    = useState('');

  const inputRef = useRef(null);

  const LOAD_MSGS = [
    'EXTRACTING SYMBOLS...',
    'FETCHING MARKET FEED...',
    'RUNNING SENTIMENT MODEL...',
    'SCORING RED & GREEN FLAGS...',
    'COMPILING VERDICT...',
  ];

  function pickFile(f) {
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setResult(null);
    setError(null);
  }

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('image/')) pickFile(f);
  }, []);

  async function handleUpload() {
    if (!file) return;

    const form = new FormData();
    form.append('image', file);
    setLoading(true);
    setError(null);
    setResult(null);

    let msgIdx = 0;
    setLoadMsg(LOAD_MSGS[0]);
    const ticker = setInterval(() => {
      msgIdx = (msgIdx + 1) % LOAD_MSGS.length;
      setLoadMsg(LOAD_MSGS[msgIdx]);
    }, 1800);

    try {
      const res = await axios.post('/analyze', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: {
          userEmail: user?.primaryEmailAddress?.emailAddress,
          userName:  user?.fullName || user?.username || 'Valued Investor',
          userId:    user?.id,
        },
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Analysis failed');
    } finally {
      clearInterval(ticker);
      setLoading(false);
    }
  }

  function reset() {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  }

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      color: '#d4e8d4',
      minHeight: '100vh',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&family=Bebas+Neue&display=swap');

        @keyframes fw-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fw-scan {
          0%   { top: 0; opacity: 0.6; }
          50%  { opacity: 1; }
          100% { top: 100%; opacity: 0.6; }
        }

        .fw-upload-zone {
          border: 1px dashed #1e3a1e;
          background: #060d06;
          padding: 48px 32px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          position: relative;
          overflow: hidden;
        }
        .fw-upload-zone:hover,
        .fw-upload-zone.dragging {
          border-color: #3a6a3a;
          background: #080f08;
        }
        .fw-analyze-btn {
          width: 100%;
          background: #c8ff00;
          color: #050905;
          border: none;
          padding: 14px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%);
          transition: background 0.15s;
        }
        .fw-analyze-btn:hover:not(:disabled) { background: #dfff4f; }
        .fw-analyze-btn:disabled {
          background: #0d180d;
          color: #1e3a1e;
          cursor: not-allowed;
          clip-path: none;
        }
        input[type="file"] { display: none; }
      `}</style>

      {/* Page header */}
      <div style={{
        borderBottom: '1px solid #111d11',
        paddingBottom: '24px',
        marginBottom: '40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            color: '#2a3f2a',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ display: 'inline-block', width: '16px', height: '1px', background: '#2a3f2a' }}/>
            Sentiment Engine
          </div>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(36px, 5vw, 56px)',
            letterSpacing: '0.04em',
            color: '#e8f5e8',
            lineHeight: 0.95,
            margin: 0,
          }}>
            ANALYZE<br/>
            <span style={{ color: '#c8ff00' }}>YOUR STOCK</span>
          </h1>
        </div>

        {user && (
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.1em',
            color: '#2a3f2a',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid #111d11',
            padding: '8px 16px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00d97e', display: 'inline-block' }}/>
            {(user.fullName || user.username || 'TRADER').toUpperCase()}
          </div>
        )}
      </div>

      {/* Upload + preview row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: previewUrl ? '1fr 1fr' : '1fr',
        gap: '24px',
        marginBottom: '40px',
        transition: 'grid-template-columns 0.3s',
      }}>

        {/* Upload panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            color: '#2a3f2a',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            paddingBottom: '10px',
            borderBottom: '1px solid #0d180d',
          }}>
            01 / Upload Screenshot
          </div>

          {/* Drop zone */}
          <div
            className={`fw-upload-zone${dragging ? ' dragging' : ''}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={(e) => pickFile(e.target.files[0])}
              disabled={loading}
            />

            {file ? (
              <div>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '11px',
                  color: '#00d97e',
                  letterSpacing: '0.08em',
                  marginBottom: '6px',
                }}>
                  ✓ FILE LOADED
                </div>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '10px',
                  color: '#2a3f2a',
                }}>
                  {file.name}
                </div>
              </div>
            ) : (
              <div>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ marginBottom: '16px', opacity: 0.4 }}>
                  <rect x="4" y="8" width="28" height="22" rx="2" stroke="#00d97e" strokeWidth="1.5" fill="none"/>
                  <polyline points="18,14 18,24" stroke="#00d97e" strokeWidth="1.5" strokeLinecap="round"/>
                  <polyline points="13,19 18,14 23,19" stroke="#00d97e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="30" x2="24" y2="30" stroke="#00d97e" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '11px',
                  color: '#2a3f2a',
                  letterSpacing: '0.1em',
                  marginBottom: '6px',
                }}>
                  DROP SCREENSHOT HERE
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#1a2e1a',
                  fontWeight: 300,
                }}>
                  or click to browse
                </div>
              </div>
            )}
          </div>

          {/* Analyze button */}
          <button
            className="fw-analyze-btn"
            onClick={handleUpload}
            disabled={loading || !file}
          >
            {loading ? loadMsg : 'RUN SENTIMENT ANALYSIS →'}
          </button>

          {file && !loading && (
            <button
              onClick={reset}
              style={{
                background: 'transparent',
                border: '1px solid #141f14',
                color: '#2a3f2a',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '10px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '10px',
                cursor: 'pointer',
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={(e) => { e.target.style.borderColor = '#2a5c2a'; e.target.style.color = '#3d5c3d'; }}
              onMouseLeave={(e) => { e.target.style.borderColor = '#141f14'; e.target.style.color = '#2a3f2a'; }}
            >
              Clear & Reset
            </button>
          )}

          {/* Loading state */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  border: '1px solid #1e3a1e',
                  borderLeft: '2px solid #00d97e',
                  padding: '16px 20px',
                  background: '#060d06',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div style={{
                  width: '20px', height: '20px',
                  border: '1.5px solid #1e3a1e',
                  borderTop: '1.5px solid #00d97e',
                  borderRadius: '50%',
                  flexShrink: 0,
                  animation: 'fw-spin 0.8s linear infinite',
                }}/>
                <div>
                  <div style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '11px',
                    color: '#00d97e',
                    letterSpacing: '0.1em',
                    marginBottom: '4px',
                  }}>
                    {loadMsg}
                  </div>
                  <div style={{ fontSize: '12px', color: '#2a3f2a', fontWeight: 300 }}>
                    Rate-limited API — may take up to 60s
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error state */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  border: '1px solid #3a1515',
                  borderLeft: '2px solid #ff5757',
                  padding: '16px 20px',
                  background: '#0a0505',
                }}
              >
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '10px',
                  color: '#ff5757',
                  letterSpacing: '0.1em',
                  marginBottom: '6px',
                }}>
                  ERR / ANALYSIS FAILED
                </div>
                <div style={{ fontSize: '13px', color: '#6a3a3a', fontWeight: 300 }}>
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Preview panel */}
        <AnimatePresence>
          {previewUrl && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.35 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '10px',
                color: '#2a3f2a',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                paddingBottom: '10px',
                borderBottom: '1px solid #0d180d',
              }}>
                02 / Preview
              </div>

              <div style={{
                border: '1px solid #111d11',
                background: '#060d06',
                padding: '12px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '200px',
                flex: 1,
              }}>
                <img
                  src={previewUrl}
                  alt="Uploaded screenshot"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '420px',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results */}
      <AnimatePresence>
        {result?.results && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Results header */}
            <div style={{
              borderTop: '1px solid #111d11',
              paddingTop: '40px',
              marginBottom: '32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '16px',
            }}>
              <div>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '10px',
                  color: '#2a3f2a',
                  letterSpacing: '0.16em',
                  marginBottom: '8px',
                }}>
                  — Analysis complete
                </div>
                <h2 style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(28px, 4vw, 44px)',
                  letterSpacing: '0.04em',
                  color: '#e8f5e8',
                  margin: 0,
                  lineHeight: 0.95,
                }}>
                  {result.stocksFound?.join(' · ')}
                </h2>
              </div>

              {/* Summary stats */}
              {result.summary && (
                <div style={{ display: 'flex', gap: '1px' }}>
                  {[
                    { label: 'TOTAL',    val: result.summary.total,    color: '#e8f5e8' },
                    { label: 'SCANNED',  val: result.summary.analyzed, color: '#00d97e' },
                    { label: 'FAILED',   val: result.summary.failed,   color: '#ff5757' },
                  ].map((s) => (
                    <div key={s.label} style={{
                      background: '#070d07',
                      border: '1px solid #111d11',
                      padding: '12px 20px',
                      textAlign: 'center',
                      minWidth: '72px',
                    }}>
                      <div style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: '28px',
                        color: s.color,
                        lineHeight: 1,
                      }}>
                        {s.val}
                      </div>
                      <div style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: '9px',
                        color: '#2a3f2a',
                        letterSpacing: '0.12em',
                        marginTop: '4px',
                      }}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stock cards grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '1px',
              background: '#0d180d',
              border: '1px solid #0d180d',
            }}>
              {result.results.map((item, i) => (
                <StockCard key={i} item={item} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}