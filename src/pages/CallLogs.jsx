import React, { useEffect, useState } from "react";
import CallSearchFilter from "../components/CallSearchFilter";
import CallList from "../components/CallList";
import CallDetails from "../components/CallDetails";
import toast from "react-hot-toast";

import { getCallLogsApi } from "../libs/callLogs.api";
import { adaptCall } from "../utils/callAdapter";

export default function CallLogs() {
  const [calls, setCalls] = useState([]);
  const [selectedCall, setSelectedCall] = useState(null);

  const fetchCalls = async (params = {}) => {
    try {
      const res = await getCallLogsApi(params);
      const adaptedCalls = res.data.map(adaptCall);
      setCalls(adaptedCalls);
      setSelectedCall(adaptedCalls[0] || null);
    } catch (err) {
      toast.error("Failed to load call logs");
    }
  };

  useEffect(() => {
    fetchCalls({ date: "today" });
  }, []);

  return (
    <div className="p-2">
      <CallSearchFilter
        onSearch={(v) => fetchCalls({ search: v })}
        onTypeChange={(v) =>
          fetchCalls({ call_type: v === "all" ? "" : v })
        }
        onIssueChange={(v) =>
          fetchCalls({ issue: v === "all" ? "" : v })
        }
        onDateChange={(v) => fetchCalls({ date: v })}
      />

      <div className="flex flex-col xl:flex-row gap-8 items-stretch">
        <div className="xl:w-[45%]">
          <CallList
            calls={calls}
            selectedId={selectedCall?.id}
            onSelect={setSelectedCall}
          />
        </div>

        <div className="xl:flex-1">
          <CallDetails call={selectedCall} />
        </div>
      </div>
    </div>
  );
}
