import React from 'react';
import { FileText, Target, ClipboardList, Mail, Edit } from 'lucide-react';

const actions = [
    { icon: FileText, label: 'View Report' },
    { icon: Target, label: 'Assign Tasks' },
    { icon: ClipboardList, label: 'Task Summary' },
    { icon: Mail, label: 'Send Message' },
    { icon: Edit, label: 'Edit Profile' },
];

export default function ProfileActionBar({ onEdit }) {
    return (
        <div
            className="px-7 py-2.5 flex items-center justify-between gap-8 flex-wrap"
            style={{ background: 'linear-gradient(135deg, #0B4E89, #0F5D98)' }}
        >
            {actions.map((action, i) => {
                const Icon = action.icon;
                return (
                    <button
                        key={i}
                        onClick={i === 4 && onEdit ? onEdit : undefined}
                        className={`flex items-center gap-2.5 px-8 py-3 rounded-sm text-sm font-semibold transition-colors border ${i === 0
                                ? 'bg-white text-[#1A6FC4] border-white hover:bg-gray-50'
                                : 'bg-transparent text-white border-white hover:bg-white/10'
                            }`}
                    >
                        <Icon size={14} />
                        {action.label}
                    </button>
                );
            })}
        </div>
    );
}
