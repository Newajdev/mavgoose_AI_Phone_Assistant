import React, { useEffect, useState } from "react";
import TechnicianCard from "../components/TechnicianCard";
import TransferConditions from "../components/TransferConditions";
import {
  getTransferContactsApi,
  getCallTransferRulesApi,
} from "../libs/callTransfer.api";
import toast from "react-hot-toast";

export default function CallTransfer() {
  const [contacts, setContacts] = useState([]);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContacts();
    fetchRules();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await getTransferContactsApi();
      setContacts(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to load transfer contacts");
    }
  };

  const fetchRules = async () => {
    try {
      const res = await getCallTransferRulesApi();
      setRules(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to load transfer rules");
    }
  };

  return (
    <div className="space-y-8">
      {/* Transfer Contact Section */}
      <div className="bg-[#0F172B80] border-2 border-[#2B7FFF33] rounded-2xl overflow-hidden">
        <div className="p-8 border-b border-[#2B7FFF33]">
          <h1 className="text-2xl font-medium text-white mb-2">
            Call Transfer
          </h1>
          <p className="text-sm text-[#90A1B9]">
            Calls will be transferred based on selected conditions
          </p>
        </div>

        <div className="p-8">
          {contacts.map((contact, index) => (
            <TechnicianCard
              key={contact.id}
              priority={index + 1}
              name={contact.name}
              phoneNumber={contact.phone_number}
              available={contact.is_active}
            />
          ))}
        </div>
      </div>

      {/* Conditions Section */}
      <TransferConditions rules={rules} />
    </div>
  );
}
