import { useEffect, useRef, useState } from "react";
import "./App.css";
import { ping, API_BASE } from "./api";

export default function App() {
  // UI state
  const [targetLufs, setTargetLufs] = useState(-14);
  const [intensity, setIntensity] = useState(0.7);
  const [preserveBass, setPreserveBass] = useState(false);

  // File picker state
  const [audioFile, setAudioFile] = useState(null);
  const [folderFiles, setFolderFiles] = useState([]);
  const audioInputRef = useRef(null);
  const folderInputRef = useRef(null);

  // Backend status
  const [apiStatus, setApiStatus] = useState("idle");
  const [apiMsg, setApiMsg] = useState("");

  const openAudioPicker = () => audioInputRef.current?.click();
  const openFolderPicker = () => folderInputRef.current?.click();

  const onAudioPicked = (e) => {
    const f = e.target.files?.[0];
    setAudioFile(f || null);
  };

  const onFolderPicked = (e) => {
    // In Chromium you can select a folder with webkitdirectory – we’ll just keep the FileList
    const files = Array.from(e.target.files || []);
    setFolderFiles(files);
  };

  const testBackend = async () => {
    setApiStatus("loading");
    setApiMsg("");
    try {
      const res = await ping();
      setApiStatus("ok");
      setApiMsg(JSON.stringify(res));
    } catch (err) {
      setApiStatus("bad");
      setApiMsg(err?.message || "Ukjent feil");
    }
  };

  useEffect(() => {
    // optional auto-check on first load
    // testBackend();
  }, []);

  return (
    <div className="wrapper">
      {/* HEADER */}
      <div className="header">
        <div className="badge">🎵</div>
        <div>
          <div className="title">Mastering Studio</div>
          <div className="subtitle">
            Profesjonell lydmastering for dine musikkfiler
          </div>
        </div>
      </div>

      {/* FILE UPLOAD */}
      <div className="card">
        <div className="section-title">
          <span className="dot" />
          Filopplasting
        </div>

        <div className="row">
          <button className="btn" onClick={openAudioPicker} type="button" aria-label="Velg lydfil">
            🎵 Velg lydfil
          </button>

          <button className="btn" onClick={openFolderPicker} type="button" aria-label="Velg output-katalog">
            📁 Velg output-katalog
          </button>
        </div>

        {/* Skjulte input-felter som åpnes av knappene */}
        <input
          ref={audioInputRef}
          type="file"
          accept="audio/*,.mp3,.wav,.flac,.aac,.ogg"
          style={{ display: "none" }}
          onChange={onAudioPicked}
        />

        {/* Folder picker (Chromium: webkitdirectory). I andre browsere må bruker velge flere filer manuelt. */}
        <input
          ref={folderInputRef}
          type="file"
          // @ts-ignore – ikke standard, men støttes av Chromium
          webkitdirectory="true"
          directory=""
          multiple
          style={{ display: "none" }}
          onChange={onFolderPicked}
        />

        <div className="hint">
          <span className="square" />
          Velg output-katalog er valgfritt i nettleser-demoen.
        </div>

        {/* Valgstatus */}
        <div style={{ marginTop: 10, color: "var(--muted)", fontSize: 14 }}>
          {audioFile ? (
            <div>🎧 Valgt lydfil: <strong>{audioFile.name}</strong></div>
          ) : (
            <div>🎧 Ingen lydfil valgt ennå</div>
          )}
          {folderFiles?.length ? (
            <div>📂 Valgte filer i katalog: <strong>{folderFiles.length}</strong></div>
          ) : (
            <div>📂 Ingen output-katalog valgt</div>
          )}
        </div>
      </div>

      {/* MASTERING SETTINGS */}
      <div className="card">
        <div className="section-title">
          <span className="dot" />
          Mastering-innstillinger
        </div>

        <div className="range-wrap">
          <div className="value-row">
            <div>Target Loudness</div>
            <div>
              <strong>{targetLufs.toFixed(2)}</strong> <small>LUFS</small>
            </div>
          </div>
          <input
            type="range"
            min={-20}
            max={0}
            step={0.5}
            value={targetLufs}
            onChange={(e) => setTargetLufs(parseFloat(e.target.value))}
          />
          <div className="value-row" style={{ fontSize: 12 }}>
            <small>-20 LUFS</small>
            <small>0 LUFS</small>
          </div>
        </div>

        <div className="range-wrap" style={{ marginTop: 10 }}>
          <div className="value-row">
            <div>Mastering Intensity</div>
            <div>
              <strong>{intensity.toFixed(2)}</strong>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={intensity}
            onChange={(e) => setIntensity(parseFloat(e.target.value))}
          />
          <div className="value-row" style={{ fontSize: 12 }}>
            <small>Subtil (0.00)</small>
            <small>Maksimal (1.00)</small>
          </div>
        </div>

        <label className="checkbox" style={{ marginTop: 12 }}>
          <input
            type="checkbox"
            checked={preserveBass}
            onChange={(e) => setPreserveBass(e.target.checked)}
          />
          <div>
            <div style={{ fontWeight: 700 }}>Preserve Bass</div>
            <small>Behold bassfrekvensnivåer under mastering</small>
          </div>
        </label>

        <div className="actions" style={{ marginTop: 18 }}>
          <button className="cta" disabled title="Demo – kobles på backend senere">
            ▶︎ Start Mastering
          </button>
          <div className="status">
            Dette er en demo – når backend-endepunkt for mastering er klart,
            kobler vi på prosesseringen her.
          </div>
        </div>
      </div>

      {/* BACKEND */}
      <div className="card">
        <div className="section-title">
          <span className="dot" />
          Backend
        </div>

        <div className="actions" style={{ justifyContent: "space-between" }}>
          <button className="testbtn" onClick={testBackend} type="button">
            Test backend
          </button>
          <div className={`status ${apiStatus === "ok" ? "ok" : apiStatus === "bad" ? "bad" : ""}`}>
            {API_BASE
              ? <>Base-URL: <code>{API_BASE}</code></>
              : "Base-URL: (mangler VITE_API_BASE_URL)"}
          </div>
        </div>

        {apiMsg && (
          <>
            <div className="divider" />
            <code style={{ fontSize: 13, color: "var(--muted)" }}>{apiMsg}</code>
          </>
        )}
      </div>
    </div>
  );
}
