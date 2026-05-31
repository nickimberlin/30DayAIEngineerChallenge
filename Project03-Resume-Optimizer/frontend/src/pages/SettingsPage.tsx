import { useState, useEffect, useRef } from "react";
import { Column, Grid, Tile, Button, InlineLoading, Toggle, ProgressBar } from "@carbon/react";
import { Download, TrashCan, Checkmark, Error, WatsonHealth3DPrintMesh, Key } from "@carbon/icons-react";
import { getModelStatus, getUseLocalModel, setUseLocalModel, getSavedApiKeyConfig, setSavedApiKeyConfig } from "../lib/api";
import type { ModelStatus } from "../lib/api";
import { loadModel, unloadModel, onLoadProgress, wasModelEverLoaded, isModelLoaded, PROGRESS_COMPLETE } from "../lib/ai/browser-llm";
import type { ModelStatusType } from "../lib/ai/browser-llm";
import { useToast } from "../components/toast/ToastProvider";
import ApiKeyInput from "../components/api-key/ApiKeyInput";
import type { ApiKeyConfig } from "../components/api-key/ApiKeyInput";

export default function SettingsPage() {
  const { success, error: toastError, info, warning: toastWarning } = useToast();
  const [status, setStatus] = useState<ModelStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [modelLoading, setModelLoading] = useState(false);
  const [modelProgress, setModelProgress] = useState(0);
  const [modelMessage, setModelMessage] = useState<string>("");
  const [useLocal, setUseLocal] = useState(getUseLocalModel);
  const [apiKeyConfig, setApiKeyConfig] = useState<ApiKeyConfig>(getSavedApiKeyConfig);
  const loadedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const s = await getModelStatus();
        if (!cancelled) {
          setStatus(s);
        }
        if (!cancelled && wasModelEverLoaded() && !loadedRef.current) {
          console.log("🔄 Auto-restoring model from cache...");
          loadedRef.current = true;
          setModelLoading(true);
          setModelProgress(0);
          setModelMessage("Restoring model from cache...");
          try {
            await loadModel(true);
            console.log("✅ Auto-restore completed");
          } catch {
            console.log("ℹ️ Auto-restore failed (cache may have been evicted)");
            setModelLoading(false);
            // model files may have been evicted from cache; user can click Load
          }
        }
      } catch {
        if (!cancelled) setStatus(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    onLoadProgress((_status: ModelStatusType, progress: number, message: string) => {
      if (_status === "loading") {
        if (!loadedRef.current) {
          loadedRef.current = true;
          info("Restoring model", "Loading Gemma 4 E2B from cache...");
        }
        setModelLoading(true);
        setModelProgress(progress);
        setModelMessage(message);
      } else if (_status === "ready") {
        loadedRef.current = true;
        setModelLoading(false);
        setModelProgress(PROGRESS_COMPLETE);
        setModelMessage("Model ready");
        success("Model ready", "Gemma 4 E2B is loaded and ready for inference.");
        getModelStatus().then(setStatus).catch(() => setStatus(null));
      } else if (_status === "error") {
        setModelLoading(false);
        setModelMessage(message);
        toastError("Download failed", message);
      }
    });
  }, [info, success, toastError]);

  const fetchStatus = () => getModelStatus().then(setStatus).catch(() => setStatus(null));

  const handleLoadModel = async () => {
    if (isModelLoaded()) {
      console.log("⚡ Model already loaded, refreshing status");
      info("Model already loaded", "Gemma 4 E2B is already loaded. Refreshing status...");
      fetchStatus();
      return;
    }
    console.log("🔄 Starting model download from SettingsPage...");
    loadedRef.current = false;
    setModelLoading(true);
    setModelProgress(0);
    setModelMessage("Starting download...");
    info("Download started", "Starting Gemma 4 E2B download (~2 GB)...");
    try {
      await loadModel();
      console.log("✅ Model download completed successfully");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load model";
      console.error("❌ Model download failed:", msg);
      setModelMessage(msg);
      setModelLoading(false);
      toastError("Download failed", msg);
    }
  };

  const handleRemoveModel = () => {
    unloadModel();
    fetchStatus();
    loadedRef.current = false;
    toastWarning("Model removed", "Gemma 4 E2B has been removed from browser memory.");
  };

  const handleToggleLocal = (checked: boolean) => {
    setUseLocal(checked);
    setUseLocalModel(checked);
    if (checked) {
      info("Local mode enabled", "Analysis will use the browser-based model.");
    } else {
      info("Local mode disabled", "Analysis will use the remote API.");
    }
  };

  const handleApiKeyChange = (config: ApiKeyConfig) => {
    setApiKeyConfig(config);
    setSavedApiKeyConfig(config);
  };

  const loaded = status?.browser_model_loaded ?? false;

  return (
    <div>
      <section style={{ paddingTop: 64, paddingBottom: 32, backgroundColor: "#ffffff" }}>
        <Grid style={{ maxWidth: 720, margin: "0 auto" }}>
          <Column lg={16} md={8} sm={4}>
            <h1 className="r-hero-lg" style={{ fontWeight: 300, lineHeight: 1.2, marginBottom: 8 }}>
              Settings
            </h1>
            <p style={{ fontSize: 16, color: "#525252", letterSpacing: "0.16px", lineHeight: 1.5 }}>
              Configure browser-based AI models and application preferences.
            </p>
          </Column>
        </Grid>
      </section>

      <section style={{ paddingTop: 24, paddingBottom: 64, backgroundColor: "#f4f4f4" }}>
        <Grid style={{ maxWidth: 720, margin: "0 auto" }}>
          <Column lg={16} md={8} sm={4}>
            <Tile style={{ padding: 0 }}>
              <div style={{ padding: 32, borderBottom: "1px solid #e0e0e0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <WatsonHealth3DPrintMesh size={20} style={{ color: "#0f62fe" }} />
                  <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0, letterSpacing: "0.16px" }}>
                    Browser LLM — Gemma 4 E2B
                  </h2>
                  <span
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      fontSize: 12, fontWeight: 500,
                      color: loaded ? "#24a148" : "#8c8c8c",
                      letterSpacing: "0.16px",
                    }}
                  >
                    {loaded ? <Checkmark size={14} /> : <Error size={14} />}
                    {loaded ? "Loaded" : "Not loaded"}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "#525252", margin: 0, letterSpacing: "0.16px" }}>
                  Download and run the Gemma 4 E2B (ONNX) model directly in your browser via
                  transformers.js. No backend, no API keys — everything runs on your machine
                  using WebGPU or WASM.
                </p>
              </div>

              <div style={{ padding: 32 }}>
                <div
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 16px", backgroundColor: "#f4f4f4",
                    marginBottom: 20,
                  }}
                >
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, margin: "0 0 2px", letterSpacing: "0.16px" }}>
                      Gemma 4 E2B (ONNX)
                    </p>
                    <p style={{ fontSize: 12, color: "#525252", margin: 0, letterSpacing: "0.16px" }}>
                      {loaded ? "Loaded in browser" : "~2 GB (quantized q4f16)"}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {!loaded ? (
                      <Button kind="primary" size="sm" onClick={handleLoadModel} disabled={modelLoading} renderIcon={Download}>
                        {modelLoading ? "Loading..." : "Load model"}
                      </Button>
                    ) : (
                      <Button kind="danger--ghost" size="sm" onClick={handleRemoveModel} renderIcon={TrashCan}>
                        Remove
                      </Button>
                    )}
                  </div>
                </div>

                {modelLoading && modelProgress === 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <InlineLoading description={modelMessage || "Starting download..."} />
                  </div>
                )}

                {modelLoading && modelProgress > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <ProgressBar value={Math.round(modelProgress)} max={PROGRESS_COMPLETE} label={modelMessage || "Starting..."} />
                  </div>
                )}

                {!modelLoading && modelProgress === PROGRESS_COMPLETE && (
                  <div style={{ marginBottom: 20 }}>
                    <ProgressBar value={PROGRESS_COMPLETE} max={PROGRESS_COMPLETE} label="Model ready" />
                    <div
                      style={{
                        display: "flex", alignItems: "flex-start", gap: 10,
                        padding: "14px 16px", background: "#defbe6", borderRadius: 4,
                        marginTop: 12, borderLeft: "3px solid #24a148",
                      }}
                    >
                      <Checkmark size={18} style={{ color: "#24a148", flexShrink: 0, marginTop: 1 }} />
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 2px", color: "#161616", letterSpacing: "0.16px" }}>
                          Model ready for use
                        </p>
                        <p style={{ fontSize: 13, color: "#425c3a", margin: 0, letterSpacing: "0.16px" }}>
                          {useLocal
                            ? "Gemma 4 E2B is loaded and ready. Analysis will run in-browser using this model."
                            : 'Gemma 4 E2B is loaded. Enable "Use browser model for analysis" above to route analysis through this model.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {modelMessage && !modelLoading && modelProgress > 0 && modelProgress < PROGRESS_COMPLETE && (
                  <p style={{ fontSize: 13, margin: "0 0 16px", color: "#da1e28", letterSpacing: "0.16px" }}>
                    {modelMessage}
                  </p>
                )}

                <div
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    paddingTop: 20, borderTop: "1px solid #e0e0e0",
                  }}
                >
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 2px", letterSpacing: "0.16px" }}>
                      Use browser model for analysis
                    </p>
                    <p style={{ fontSize: 12, color: "#525252", margin: 0, letterSpacing: "0.16px" }}>
                      When enabled, the analyzer will run the Gemma 4 E2B model in your browser
                      instead of sending data to a remote API.
                    </p>
                  </div>
                  <Toggle id="use-local-toggle" labelA="Off" labelB="On" toggled={useLocal} onToggle={handleToggleLocal} />
                </div>

                {loaded && (
                  <div
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "10px 14px", background: useLocal ? "#defbe6" : "#f4f4f4",
                      borderRadius: 4, marginTop: 12,
                      borderLeft: `3px solid ${useLocal ? "#24a148" : "#8c8c8c"}`,
                    }}
                  >
                    <Checkmark size={16} style={{ color: useLocal ? "#24a148" : "#8c8c8c", flexShrink: 0 }} />
                    <p style={{ fontSize: 13, margin: 0, color: useLocal ? "#425c3a" : "#525252", letterSpacing: "0.16px" }}>
                      {useLocal
                        ? "Using Gemma 4 E2B for analysis — no data leaves your browser."
                        : "Model loaded but analysis is using the remote API. Toggle above to switch."}
                    </p>
                  </div>
                )}
              </div>
            </Tile>
          </Column>

          <Column lg={16} md={8} sm={4}>
            <Tile style={{ padding: 0, marginTop: 24 }}>
              <div style={{ padding: 32, borderBottom: "1px solid #e0e0e0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <Key size={20} style={{ color: "#0f62fe" }} />
                  <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0, letterSpacing: "0.16px" }}>
                    API Keys
                  </h2>
                </div>
                <p style={{ fontSize: 13, color: "#525252", margin: 0, letterSpacing: "0.16px" }}>
                  Manage API keys for cloud-based LLM providers. Keys are stored in your
                  browser and only sent to the API during analysis.
                </p>
              </div>
              <div style={{ padding: 32 }}>
                <ApiKeyInput config={apiKeyConfig} onChange={handleApiKeyChange} />
              </div>
            </Tile>
          </Column>

          {!loaded && !loading && (
            <Column lg={16} md={8} sm={4}>
              <div style={{ textAlign: "center", padding: "32px 0 16px" }}>
                <p style={{ fontSize: 14, color: "#8c8c8c", letterSpacing: "0.16px" }}>
                  Load the Gemma 4 E2B model to run AI analysis entirely in your browser —
                  no API keys, no cloud costs, full privacy.
                </p>
              </div>
            </Column>
          )}
        </Grid>
      </section>
    </div>
  );
}
