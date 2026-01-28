import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import TimeSelector from "../components/TimeSelector";
import {
  getAIBehaviorApi,
  createAIBehaviorApi,
  updateAIBehaviorApi,
} from "../libs/aiBehavior.api";

/* ================= Helper Transformers ================= */

const dayMap = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
};

const reverseDayMap = Object.fromEntries(
  Object.entries(dayMap).map(([k, v]) => [v, k])
);

const toBusinessHoursArray = (businessHours) =>
  Object.entries(businessHours).map(([day, time]) => ({
    day: dayMap[day],
    is_open: time.start !== "---",
    open_time: time.start === "---" ? null : time.start,
    close_time: time.end === "---" ? null : time.end,
  }));

const fromBusinessHoursArray = (arr = []) => {
  const result = {
    monday: { start: "---", end: "---" },
    tuesday: { start: "---", end: "---" },
    wednesday: { start: "---", end: "---" },
    thursday: { start: "---", end: "---" },
    friday: { start: "---", end: "---" },
    saturday: { start: "---", end: "---" },
    sunday: { start: "---", end: "---" },
  };

  arr.forEach((b) => {
    const day = reverseDayMap[b.day];
    result[day] = b.is_open
      ? { start: b.open_time, end: b.close_time }
      : { start: "---", end: "---" };
  });

  return result;
};

/* ================= Component ================= */

export default function AISettings({ storeId }) {
  const [loading, setLoading] = useState(false);

  const [greetings, setGreetings] = useState({
    opening: "",
    closed: "",
  });

  const [tone, setTone] = useState("friendly");

  const [businessHours, setBusinessHours] = useState({
    monday: { start: "---", end: "---" },
    tuesday: { start: "---", end: "---" },
    wednesday: { start: "---", end: "---" },
    thursday: { start: "---", end: "---" },
    friday: { start: "---", end: "---" },
    saturday: { start: "---", end: "---" },
    sunday: { start: "---", end: "---" },
  });

  const [escalation, setEscalation] = useState({
    retryAttempts: 3,
    fallbackResponse: "",
    keywords: [],
  });

  const [newKeyword, setNewKeyword] = useState("");

  /* ================= LOAD FROM BACKEND ================= */

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {

    console.log("➡️ loadConfig called, storeId =", storeId);

    try {
      const res = await getAIBehaviorApi(storeId);
      console.log("✅ GET ai-behavior response:", res.data);
      const data = res.data;

      setTone(data.tone);

      setGreetings({
        opening: data.greetings?.opening_hours_greeting || "",
        closed: data.greetings?.closed_hours_message || "",
      });

      setBusinessHours(fromBusinessHoursArray(data.business_hours));

      setEscalation({
        retryAttempts: data.retry_attempts_before_transfer,
        fallbackResponse: data.fallback_response,
        keywords: data.auto_transfer_keywords.map((k) => k.keyword),
      });
    } catch (err) {
        console.log("❌ GET ai-behavior error:", err.response || err);
      if (err.response?.status === 404) {
        await createAIBehaviorApi(storeId, buildPayload());
      }
    }
  };

  /* ================= SAVE ================= */

  const handleSaveSettings = async () => {
    console.log("💾 Save button clicked");
    setLoading(true);
    try {
      await updateAIBehaviorApi(storeId, buildPayload());
      console.log("✅ AI settings saved successfully");
      alert("AI Settings saved successfully ✅");
    } finally {
      setLoading(false);
    }
  };

  /* ================= PAYLOAD ================= */

  const buildPayload = () => ({
    tone,
    retry_attempts_before_transfer: escalation.retryAttempts,
    fallback_response: escalation.fallbackResponse,
    greetings: {
      opening_hours_greeting: greetings.opening,
      closed_hours_message: greetings.closed,
    },
    business_hours: toBusinessHoursArray(businessHours),
    auto_transfer_keywords: escalation.keywords.map((k) => ({ keyword: k })),
  });
  console.log("📦 Payload sending to backend:", buildPayload());

  /* ================= KEYWORDS ================= */

  const handleAddKeyword = () => {
    const kw = newKeyword.trim().toLowerCase();
    if (kw && !escalation.keywords.includes(kw)) {
      setEscalation({
        ...escalation,
        keywords: [...escalation.keywords, kw],
      });
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (kw) => {
    setEscalation({
      ...escalation,
      keywords: escalation.keywords.filter((k) => k !== kw),
    });
  };

  /* ================= UI (UNCHANGED) ================= */

  return (
    <div className="p-6 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Greeting Scripts */}
        <div className="bg-[#1D293D80] border-2 border-[#2B7FFF33] rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Greeting Scripts
          </h2>

          <textarea
            value={greetings.opening}
            onChange={(e) =>
              setGreetings({ ...greetings, opening: e.target.value })
            }
            placeholder="Opening greeting"
            className="w-full mb-4 bg-[#0F172B60] border rounded-xl p-4 text-white"
          />

          <textarea
            value={greetings.closed}
            onChange={(e) =>
              setGreetings({ ...greetings, closed: e.target.value })
            }
            placeholder="Closed message"
            className="w-full bg-[#0F172B60] border rounded-xl p-4 text-white"
          />
        </div>

        {/* Tone */}
        <div className="bg-[#1D293D80] border-2 border-[#2B7FFF33] rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Tone & Personality
          </h2>

          {["friendly", "professional", "sales"].map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`block w-full mb-2 p-3 rounded-xl ${
                tone === t
                  ? "bg-[#2B7FFF] text-white"
                  : "bg-[#0F172B] text-[#90A1B9]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Business Hours */}
      <div className="bg-[#1D293D80] border-2 border-[#2B7FFF33] rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Business Hours
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(businessHours).map(([day, times]) => (
            <div key={day}>
              <p className="text-white capitalize mb-2">{day}</p>
              <div className="flex gap-2">
                <TimeSelector
                  value={times.start}
                  onChange={(v) =>
                    setBusinessHours({
                      ...businessHours,
                      [day]: { ...times, start: v },
                    })
                  }
                  disabled={day === "sunday"}
                />
                <TimeSelector
                  value={times.end}
                  onChange={(v) =>
                    setBusinessHours({
                      ...businessHours,
                      [day]: { ...times, end: v },
                    })
                  }
                  disabled={day === "sunday"}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Escalation */}
      <div className="bg-[#1D293D80] border-2 border-[#2B7FFF33] rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Escalation Rules
        </h2>

        <select
          value={escalation.retryAttempts}
          onChange={(e) =>
            setEscalation({
              ...escalation,
              retryAttempts: Number(e.target.value),
            })
          }
          className="mb-4 p-3 rounded-xl"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n} attempts
            </option>
          ))}
        </select>

        <textarea
          value={escalation.fallbackResponse}
          onChange={(e) =>
            setEscalation({
              ...escalation,
              fallbackResponse: e.target.value,
            })
          }
          className="w-full mb-4 p-4 rounded-xl"
          placeholder="Fallback response"
        />

        <div className="flex gap-2 mb-4">
          <input
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            className="flex-1 p-3 rounded-xl"
            placeholder="Add keyword"
          />
          <button
            onClick={handleAddKeyword}
            className="px-4 rounded-xl bg-[#2B7FFF] text-white"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {escalation.keywords.map((k) => (
            <span
              key={k}
              onClick={() => handleRemoveKeyword(k)}
              className="bg-red-500 text-white px-3 py-1 rounded-lg cursor-pointer"
            >
              {k} ✕
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={handleSaveSettings}
        disabled={loading}
        className="w-full bg-[#05DF72] text-white font-bold py-3 rounded-xl"
      >
        {loading ? "Saving..." : "Save AI Settings"}
      </button>
    </div>
  );
}
