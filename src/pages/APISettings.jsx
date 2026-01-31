import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import {
  getApiConfig,
  updateApiConfig,
} from "../libs/apiConfig.api";

const STORE_ID = 3; // later auth/context theke dynamic hobe

export default function APISettings() {
  const [apiKey, setApiKey] = useState("vapi_sk_••••••••••••••••••••••••••");
  const [showKey, setShowKey] = useState(false);

  const [modelConfig, setModelConfig] = useState({
    model: "GPT-40 (Recommend)",
    temperature: 0.7,
    maxTokens: 150,
  });

  const [performance, setPerformance] = useState({
    timeout: 10,
    retryAttempts: "2 attempts",
    voiceProvider: "Eleven Labs",
  });

  const [sttSettings, setSTTSettings] = useState({
    provider: "Google Speech-to-Text",
    language: "English",
    punctuation: true,
    noiseSuppression: false,
  });

  /* ✅ ERROR LOGS */
  const errorLogs = [
    {
      type: "warning",
      message: "API timeout - retry successful",
      time: "2025-12-18 10:23:45",
    },
    {
      type: "warning",
      message: "STT processing delay - 2.3s",
      time: "2025-12-18 09:15:22",
    },
    {
      type: "error",
      message: "Rate limit reached - waiting",
      time: "2025-12-17 16:48:01",
    },
  ];

  /* ================= LOAD CONFIG ================= */
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await getApiConfig(STORE_ID);
        const { ai_config, stt_config, api_key } = res.data;

        if (api_key?.key) setApiKey(api_key.key);

        if (ai_config) {
          setModelConfig({
            model: ai_config.model ?? modelConfig.model,
            temperature: ai_config.temperature ?? modelConfig.temperature,
            maxTokens: ai_config.max_tokens ?? modelConfig.maxTokens,
          });

          setPerformance({
            timeout: ai_config.timeout ?? performance.timeout,
            retryAttempts:
              ai_config.retry_attempts ?? performance.retryAttempts,
            voiceProvider:
              ai_config.voice_provider ?? performance.voiceProvider,
          });
        }

        if (stt_config) {
          setSTTSettings({
            provider: stt_config.provider ?? sttSettings.provider,
            language: stt_config.language ?? sttSettings.language,
            punctuation:
              stt_config.punctuation ?? sttSettings.punctuation,
            noiseSuppression:
              stt_config.noise_suppression ??
              sttSettings.noiseSuppression,
          });
        }
      } catch {
        toast.error("Failed to load API config");
      }
    };

    loadConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ================= HANDLERS ================= */

  const handleSaveKey = async () => {
    try {
      await updateApiConfig(STORE_ID, {
        api_key: { key: apiKey },
      });
      toast.success("API key saved ✅");
    } catch {
      toast.error("Failed to save API key ❌");
    }
  };

  /* ✅ FIXED: handleTestConnection EXISTS */
  const handleTestConnection = () => {
    toast("Test connection endpoint backend এ এখনো implement করা হয়নি");
  };

  const handleSaveSettings = async () => {
    try {
      const payload = {
        api_key: {
          key: apiKey,
        },
        ai_config: {
          model: modelConfig.model,
          temperature: modelConfig.temperature,
          max_tokens: modelConfig.maxTokens,
          timeout: performance.timeout,
          retry_attempts: performance.retryAttempts,
          voice_provider: performance.voiceProvider,
        },
        stt_config: {
          provider: sttSettings.provider,
          language: sttSettings.language,
          punctuation: sttSettings.punctuation,
          noise_suppression: sttSettings.noiseSuppression,
        },
      };

      await updateApiConfig(STORE_ID, payload);
      toast.success("Settings saved successfully ✅");
    } catch (err) {
      console.error(err.response?.data);
      toast.error("Failed to save settings ❌");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="p-6 space-y-8">
      {/* API Key Management */}
      <div className="bg-[#1D293D80] border-2 border-[#2B7FFF33] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Icon icon="mdi:key-variant" className="text-[#2B7FFF]" width={24} />
          <h2 className="text-xl font-bold text-white">
            API Key Management
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[#90A1B9] text-sm font-medium mb-2 block">
              Vapi API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-[#0F172B60] border-2 border-[#2B7FFF15] rounded-xl px-4 py-3 pr-12 text-white text-sm"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#90A1B9]"
              >
                <Icon
                  icon={showKey ? "mdi:eye-off" : "mdi:eye"}
                  width={20}
                />
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSaveKey}
              className="bg-[#05DF72] text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2"
            >
              <Icon icon="mdi:content-save" width={18} />
              Save Key
            </button>

            <button
              onClick={handleTestConnection}
              className="bg-[#1D293D] border border-[#2B7FFF33] text-white px-6 py-3 rounded-xl"
            >
              Test Connection
            </button>
          </div>
        </div>
      </div>

      {/* ERROR LOGS */}
      <div className="bg-[#1D293D80] border-2 border-[#2B7FFF33] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Icon
            icon="mdi:alert-circle-outline"
            className="text-[#FF2056]"
            width={24}
          />
          <h2 className="text-xl font-bold text-white">
            Error Logs
          </h2>
        </div>

        <div className="space-y-3">
          {errorLogs.map((log, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-[#0F172B60] border border-[#2B7FFF15] rounded-xl"
            >
              <Icon
                icon={
                  log.type === "warning"
                    ? "mdi:alert"
                    : "mdi:close-circle"
                }
                className={
                  log.type === "warning"
                    ? "text-[#FF8904]"
                    : "text-[#FF2056]"
                }
                width={20}
              />
              <div className="flex-1">
                <p className="text-white text-sm">
                  {log.message}
                </p>
                <p className="text-[#90A1B9] text-xs mt-1">
                  {log.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSaveSettings}
        className="w-full bg-[#05DF72] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"
      >
        <Icon icon="mdi:content-save" width={20} />
        Save Settings
      </button>
    </div>
  );
}
