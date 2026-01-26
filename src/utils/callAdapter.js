export const adaptCall = (call) => {
  const start = call.started_at ? new Date(call.started_at) : null;

  const statusMap = {
    AI_RESOLVED: "AI Resolved",
    WARM_TRANSFER: "Warm Transfer",
    DROPPED: "Dropped",
    APPOINTMENT: "Appointment",
  };

  return {
    // IDs
    id: call.id,

    // Phone
    phoneNumber: call.phone_number || "-", 

    // Date & Time (UI safe)
    date: start ? start.toLocaleDateString() : "-",
    time: start
      ? start.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-",

    // Duration
    duration: call.duration || "-",

    // Call type
    callType: call.call_type,
    status: statusMap[call.call_type] || call.call_type || "-",

    // Outcome
    outcomeRaw: call.outcome,
    outcome: call.outcome
      ? call.outcome.replaceAll("_", " ")
      : "-",

    // Issue
    issueId: call.issue,
    issueType: call.issue_name || "Unknown",

    // Audio
    audioUrl: call.audio_url || null,

    // Transcripts (backend aligned)
    transcripts: Array.isArray(call.transcripts)
      ? call.transcripts.map((t) => ({
          speaker: t.speaker,
          message: t.message,
          timestamp: t.timestamp,
        }))
      : [],

    // Meta (future use)
    startedAt: call.started_at,
    endedAt: call.ended_at,
    createdAt: call.created_at,
  };
};
