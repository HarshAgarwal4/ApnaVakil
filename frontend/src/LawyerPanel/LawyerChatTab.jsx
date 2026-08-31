import React from "react";
import WhatsAppChat from "../components/WhatsAppChat";

export default function LawyerChatTab() {
  return (
    <div className="w-full">
      <WhatsAppChat isModal={false} />
    </div>
  );
}
