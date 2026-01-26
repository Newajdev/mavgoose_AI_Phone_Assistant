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

  return (
    <div className="bg-[#0F172B80] border-2 border-[#2B7FFF33] rounded-2xl p-8 h-full overflow-y-auto">
      <h2 className="text-xl text-white font-medium mb-6">
        Call Details
      </h2>

      <p className="text-white mb-2">
        <strong>Phone: </strong> {call.phoneNumber}
      </p>
      <p className="text-white mb-2">
        <strong>Date: </strong> {call.date} {call.time}
      </p>
      <p className="text-white mb-2">
        <strong>Duration: </strong> {call.duration}
      </p>
      <p className="text-white mb-6">
        <strong>Outcome: </strong> {call.outcome}
      </p>

      {call.audioUrl && (
        <audio controls className="w-full mb-6">
          <source src={call.audioUrl} />
        </audio>
      )}

      <h3 className="text-lg text-white font-medium mb-4">
        Conversation Transcript
      </h3>

      <div className="space-y-4">
        {call.transcripts.length === 0 ? (
          <p className="text-sm text-[#90A1B9]">
            No transcript available
          </p>
        ) : (
          call.transcripts.map((msg, i) => (
            <div key={i}>
              <p className="text-sm font-bold text-[#2B7FFF]">
                {msg.speaker}:
              </p>
              <p className="text-sm text-white opacity-90">
                {msg.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
