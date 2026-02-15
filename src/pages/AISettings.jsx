import React, { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../provider/AuthContext";
import TimeSelector from "../components/TimeSelector";
import toast from "react-hot-toast";
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
  const base = {
    monday: { is_open: false, start: "---", end: "---" },
    tuesday: { is_open: false, start: "---", end: "---" },
    wednesday: { is_open: false, start: "---", end: "---" },
    thursday: { is_open: false, start: "---", end: "---" },
    friday: { is_open: false, start: "---", end: "---" },
    saturday: { is_open: false, start: "---", end: "---" },
    sunday: { is_open: false, start: "---", end: "---" },
  };

  arr.forEach((b) => {
    const day = reverseDayMap[b.day];
    if (!day) return;

    base[day] = {
      is_open: b.is_open,
      start: b.is_open ? b.open_time : "---",
      end: b.is_open ? b.close_time : "---",
    };
  });

  return base;
};

/* ================= Component ================= */

export default function AISettings() {
  const { getActiveStoreId } = useContext(AuthContext);
  const storeId = getActiveStoreId();

  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [tone, setTone] = useState(null);

  const [greetings, setGreetings] = useState({
    opening: "",
    closed: "",
  });

  const [businessHours, setBusinessHours] = useState({
    monday: { is_open: false, start: "---", end: "---" },
    tuesday: { is_open: false, start: "---", end: "---" },
    wednesday: { is_open: false, start: "---", end: "---" },
    thursday: { is_open: false, start: "---", end: "---" },
    friday: { is_open: false, start: "---", end: "---" },
    saturday: { is_open: false, start: "---", end: "---" },
    sunday: { is_open: false, start: "---", end: "---" },
  });

  const toneOptions = [
    { label: "Friendly & Warm", value: "friendly" },
    { label: "Professional", value: "professional" },
    { label: "Sales-Oriented", value: "sales" },
  ];

  const [escalation, setEscalation] = useState({
    retryAttempts: 3,
    fallbackResponse: "",
    keywords: [],
  });

  const [newKeyword, setNewKeyword] = useState("");

  const firstLoadRef = useRef(true);

  /* ================= LOAD CONFIG ================= */

  useEffect(() => {
    if (!storeId) return;

    loadConfig(!firstLoadRef.current);
    firstLoadRef.current = false;
  }, [storeId]);

  const loadConfig = async (showToast = false) => {
    try {
      setLoading(true);

      const res = await getAIBehaviorApi(storeId);
      const data = res.data;

      setNotFound(false);

      setTone(data.tone || null);

      setGreetings({
        opening: data.greetings?.opening_hours_greeting || "",
        closed: data.greetings?.closed_hours_message || "",
      });

      // business hours
      const bh = {};
      (data.business_hours || []).forEach((b) => {
        const day = reverseDayMap[b.day];
        bh[day] = {
          is_open: b.is_open,
          start: b.open_time || "---",
          end: b.close_time || "---",
        };
      });
      setBusinessHours((prev) => ({ ...prev, ...bh }));

      setEscalation({
        retryAttempts:
          data.retry_attempts_before_transfer || 3,
        fallbackResponse: data.fallback_response || "",
        keywords:
          data.auto_transfer_keywords?.map((k) => k.keyword) || [],
      });

      if (showToast) {
        toast.success("AI settings updated for selected store");
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setNotFound(true);
        if (showToast) {
          toast("No AI settings found for this store");
        }
      } else {
        console.error("Failed to load AI behavior", err);
        toast.error("Failed to load AI settings");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= SAVE ================= */

  const handleSaveSettings = async () => {
    if (!storeId) {
      toast.error("Please select a store first");
      return;
    }

    setLoading(true);
    try {
      const payload = buildPayload();

      if (notFound) {
        await createAIBehaviorApi(storeId, payload);
        setNotFound(false);
        toast.success("AI Settings created successfully ✅");
      } else {
        await updateAIBehaviorApi(storeId, payload);
        toast.success("AI Settings saved successfully ✅");
      }
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error("Failed to save AI Settings ❌");
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
    auto_transfer_keywords: [...new Set(escalation.keywords)].map(
      (k) => ({ keyword: k })
    ),
  });

  /* ================= KEYWORDS ================= */

  const handleAddKeyword = () => {
    const kw = newKeyword.trim().toLowerCase();
    if (!kw || escalation.keywords.includes(kw)) return;

    setEscalation({
      ...escalation,
      keywords: [...escalation.keywords, kw],
    });
    setNewKeyword("");
  };

  const handleRemoveKeyword = (kw) => {
    setEscalation({
      ...escalation,
      keywords: escalation.keywords.filter((k) => k !== kw),
    });
  };

  /* ================= UI ================= */

  if (!storeId) {
    return (
      <div className="p-10 text-center text-white">
        <h2 className="text-xl font-bold mb-2">No store selected</h2>
        <p>Please select a store to configure AI behavior.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="grid lg:grid-cols-3 gap-6 p-8">
        {/* Greeting Scripts - 2 columns wide */}
        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg lg:col-span-2 border border-blue-500">
          <h2 className="text-white text-xl font-bold mb-4">Greeting Scripts</h2>

          <div className="space-y-4">
            <div>
              <label className="text-gray-300 font-semibold mb-1 block">
                Opening Hours Greeting
              </label>
              <textarea
                value={greetings.opening}
                onChange={(e) =>
                  setGreetings({ ...greetings, opening: e.target.value })
                }
                placeholder="Hi there! Welcome to our store."
                className="w-full p-4 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 mt-2"
              />
            </div>

            <div>
              <label className="text-gray-300 font-semibold mb-1 block">
                Closed Hours Message
              </label>
              <textarea
                value={greetings.closed}
                onChange={(e) =>
                  setGreetings({ ...greetings, closed: e.target.value })
                }
                placeholder="Sorry, we're closed. Please visit us during business hours."
                className="w-full p-4 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Tone - 1 column wide */}
        <div className="bg-[#1D293D80] p-6 rounded-2xl lg:col-span-1 border border-blue-500">
          <h2 className="text-white font-bold mb-4">Tone</h2>
          {toneOptions.map((t) => (
            <button
              key={t.value}
              onClick={() => setTone(t.value)}
              className={`block w-full mb-2 p-3 rounded-xl cursor-pointer hover:bg-slate-700 ${tone === t.value
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-gray-400"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>


      {/* Business Hours */}

      <div className="bg-[#1F2937] p-6 rounded-2xl shadow-lg border border-blue-500 ">
        <h2 className="text-white text-xl font-bold mb-4">Business Hours</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(businessHours).map(([day, times]) => (
            <div
              key={day}
              className="p-4 rounded-2xl shadow-md transition-colors bg-gray-700"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-white font-semibold capitalize">{day}</p>
                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={times.is_open}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setBusinessHours({
                        ...businessHours,
                        [day]: {
                          ...times,
                          is_open: checked,
                          start: checked ? times.start : "---",
                          end: checked ? times.end : "---",
                        },
                      });
                    }}
                    className="w-5 h-5 accent-blue-500"
                  />
                  Open
                </label>
              </div>

              {times.is_open ? (
                <div className="flex gap-2 mt-2">
                  <TimeSelector
                    value={times.start}
                    onChange={(v) =>
                      setBusinessHours({
                        ...businessHours,
                        [day]: { ...times, start: v },
                      })
                    }
                  />
                  <TimeSelector
                    value={times.end}
                    onChange={(v) =>
                      setBusinessHours({
                        ...businessHours,
                        [day]: { ...times, end: v },
                      })
                    }
                  />
                </div>
              ) : (
                <p className=" mt-2 text-base font-semibold text-red-400">Closed</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Escalation */}
      <div className="bg-[#1D293D80] p-6 rounded-2xl border border-blue-500 shadow-lg space-y-4">
        <h2 className="text-white font-bold text-xl mb-2">Escalation Rules</h2>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Retry Attempts */}
          <div className="flex-1 flex flex-col">
            <label className="text-gray-300 font-semibold mb-1">
              Retry Attempts Before Transfer
            </label>
            <select
              value={escalation.retryAttempts}
              onChange={(e) =>
                setEscalation({
                  ...escalation,
                  retryAttempts: Number(e.target.value),
                })
              }
              className="p-3 rounded-xl bg-gray-800 text-white border border-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} attempts
                </option>
              ))}
            </select>
          </div>

          {/* Fallback Response */}
          <div className="flex-1 flex flex-col">
            <label className="text-gray-300 font-semibold mb-1">
              Fallback Response
            </label>
            <textarea
              value={escalation.fallbackResponse}
              onChange={(e) =>
                setEscalation({ ...escalation, fallbackResponse: e.target.value })
              }
              placeholder="Fallback response"
              className="w-full p-3 rounded-xl bg-gray-800 text-white border border-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
            />
          </div>
        </div>

        {/* Keywords */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-300 font-semibold">Auto Transfer Keywords</label>
          <div className="flex gap-2">
            <input
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="Add keyword"
              className="flex-1 p-3 rounded-xl border border-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-[#1D293D80]/50 text-white"
            />
            <button
              onClick={handleAddKeyword}
              className="bg-blue-600/25 border border-blue-500 text-white px-4 rounded-xl cursor-pointer hover:bg-blue-700"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {escalation.keywords.map((k) => (
              <span
                key={k}
                onClick={() => handleRemoveKeyword(k)}
                className="bg-[#FB2C36]/20 text-[#FF6467] px-3 py-1 rounded-lg cursor-pointer border border-[#FB2C36]/40"
              >
                {k} ✕
              </span>
            ))}
          </div>
        </div>
      </div>


      <button
        onClick={handleSaveSettings}
        disabled={loading}
        className="w-full bg-green-500 text-white py-3 rounded-xl font-bold cursor-pointer hover:bg-green-600 disabled:bg-green-400"
      >
        {loading
          ? "Saving..."
          : notFound
            ? "Create AI Settings"
            : "Save AI Settings"}
      </button>
    </div >
  );
}

