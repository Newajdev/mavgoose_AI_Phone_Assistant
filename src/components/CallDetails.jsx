import React from "react";
import { Icon } from "@iconify/react";


export default function CallDetails({ call }) {
  if (!call) {
    return (
      <div className="bg-[#0F172B80] border-2 border-[#2B7FFF33] rounded-2xl p-8 flex items-center justify-center text-[#90A1B9] h-full">
        Select a call to view details
      </div>
    );
  }
  const getStatusStyle = (status) => {
    switch (status) {
      case "AI Resolved":
        return "text-[#00D1FF] bg-[#00D1FF10] border-[#00D1FF33]";
      case "Warm Transfer":
        return "text-[#FF8904] bg-[#FF890410] border-[#FF890433]";
      case "Appointment":
        return "text-[#2B7FFF] bg-[#2B7FFF10] border-[#2B7FFF33]";
      case "Dropped":
        return "text-[#FF2056] bg-[#FF205610] border-[#FF205633]";
      default:
        return "text-[#90A1B9] bg-[#90A1B910] border-[#90A1B933]";
    }
  };

  return (
    <div className="bg-[#1D293D80]/50 border border-[#2B7FFF33] rounded-2xl p-8 h-full overflow-y-auto">
      <h2 className="text-xl text-white font-semibold mb-6">Call Details</h2>

      <div className="border-t border-[#2B7FFF33] -p-8 ">
        <div className="grid grid-cols-2 gap-y-4 gap-x-8 my-6">
          {/* Phone Number */}
          <div>
            <p className="text-base text-[#90A1B9]">Phone Number</p>
            <p className="text-white font-semibold text-lg">{call.phoneNumber}</p>
          </div>

          {/* Duration */}
          <div>
            <p className="text-base text-[#90A1B9]">Duration</p>
            <p className="text-white font-semibold text-lg">{call.duration}</p>
          </div>

          {/* Date & Time */}
          <div>
            <p className="text-base text-[#90A1B9]">Date & Time</p>
            <p className="text-white font-semibold text-lg">{call.date} {call.time}</p>
          </div>

          {/* Issue Type */}
          <div>
            <p className="text-base text-[#90A1B9]">Issue Type</p>
            <p className="text-white text-lg font-semibold">{call.issueType}</p>
          </div>
        </div>

        {/* Call Type Badge */}
        <div className="mb-4">
          <p className="text-base text-[#90A1B9]">Call Type</p>
          <span className={`inline-block ${getStatusStyle(
            call.status
          )} font-semibold text-[12px] px-2 py-1 rounded-md border mt-1`}>
            {call.callType}
          </span>
        </div>

        {/* Outcome */}
        <div className="mb-4">
          <p className="text-base text-[#90A1B9]">Outcome</p>
          <p className="text-white font-semibold text-base mb-6">{call.outcome}</p>
        </div>

        {
          call.audioUrl && (
            <audio
              controls
              className="w-full mb-6 rounded bg-[#1E293B]"
              src={call.audioUrl}
            />
          )
        }

        <h3 className="text-lg text-white font-semibold mb-4">Conversation Transcript</h3>

        <div className="space-y-4 bg-[#0a1120] p-4  max-h-87.5 overflow-y-auto rounded-lg">
          {call.transcripts.length === 0 ? (
            <p className="text-sm text-[#90A1B9]">No transcript available</p>
          ) : (
            call.transcripts.map((msg, idx) => (
              <div key={idx}>
                <p className={`${msg.speaker === "AI" ? "text-[#05DF72]" : "text-[#51A2FF]"} text-sm font-semibold `}>
                  {msg.speaker === "AI" ? "AI Assistant" : msg.speaker}:
                </p>

                <p className="text-sm text-white opacity-90">{msg.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div >
  );
}
