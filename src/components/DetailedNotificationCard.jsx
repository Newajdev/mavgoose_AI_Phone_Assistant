import React from 'react';
import { Icon } from '@iconify/react';

export default function DetailedNotificationCard({ notification, onMarkRead, onDismiss }) {
    const getIcon = (type) => {
        switch (type) {
            case 'USER': return { icon: 'mdi:account-plus', color: 'text-[#AD46FF]', bg: 'bg-[#AD46FF15]' };
            case 'CALLS': return { icon: 'mdi:phone-check', color: 'text-[#2B7FFF]', bg: 'bg-[#2B7FFF15]' };
            case 'SYSTEM': return { icon: 'mdi:cog', color: 'text-[#90A1B9]', bg: 'bg-[#90A1B915]' };
            default: return { icon: 'mdi:bell', color: 'text-[#2B7FFF]', bg: 'bg-[#2B7FFF15]' };
        }
    };

    const { icon, color, bg } = getIcon(notification.type);


    return (
        <div className={`relative rounded-2xl p-6 mb-4 group transition-all 
  bg-linear-to-r from-[#1D293D80] to-[#1D293DCC] 
  hover:shadow-lg hover:-translate-y-1 ${notification.unread ? 'border-l-4 border-l-[#2B7FFF]' : 'border border-[#2B7FFF33]'}`}>

            <div className="flex items-start gap-5">
                <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 relative ${bg}`}>
                    <Icon icon={icon} className={color} width={24} />
                    {notification.unread && <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#2B7FFF] rounded-full animate-pulse" />}
                </div>

                <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                        <h3 className="text-white font-medium text-lg leading-tight">{notification.title}</h3>
                        {notification.highPriority && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#FF205620] text-[#FF2056] border border-[#FF205633] shadow-[0_0_10px_#FF2056]">
                                High Priority
                            </span>
                        )}
                    </div>
                    <p className="text-[#90A1B9] text-sm leading-relaxed max-w-3xl">{notification.description}</p>
                    <p className="text-[#7A8BA4] text-[12px] pt-1 uppercase">{notification.time}</p>
                    {notification.unread && (
                        <button onClick={() => onMarkRead(notification.id)} className="mt-4 flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#2B7FFF20] text-[#2B7FFF] border border-[#2B7FFF33] text-xs font-medium hover:bg-[#2B7FFF30] transition-colors">
                            <Icon icon="mdi:check" />
                            Mark Read
                        </button>
                    )}
                </div>
            </div>

            <button onClick={() => onDismiss(notification.id)} className="absolute top-4 right-4 text-[#90A1B9] hover:text-[#FF2056] transition-colors p-1">
                <Icon icon="mdi:close" width={18} />
            </button>
        </div>

    );
}
