export const adaptCall = (call) => {
  const start = new Date(call.started_at);

  const statusMap = {
    AI_RESOLVED: "AI Resolved",
    WARM_TRANSFER: "Warm Transfer",
    DROPPED: "Dropped",
    APPOINTMENT: "Appointment",
  };

  return {
    id: call.id,
    phoneNumber: call.phone_number,

    date: start.toLocaleDateString(),
    time: start.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),

    duration: call.duration,

    status: statusMap[call.call_type] || call.call_type,

    outcome: call.outcome
      ? call.outcome.replaceAll("_", " ")
      : "-",

    issueType: call.issue_name || "Unknown",

    audioUrl: call.audio_url,

    transcript:
      call.transcripts?.map((t) => ({
        role: t.speaker,
        content: t.message,
      })) || [],
  };
};
