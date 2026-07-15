import React from 'react';
import { FileText, Target, ClipboardList, Mail, Edit, Trash2, UserX, UserCheck } from 'lucide-react';

export default function ProfileActionBar({ onEdit, onDeactivate, onActivate, onDelete, onViewReport, onAssignTask, onTaskSummary, onSendMessage }) {
  const actions = [
    { icon: FileText, label: 'View Report', onClick: onViewReport },
    { icon: Target, label: 'Assign Tasks', onClick: onAssignTask },
    { icon: ClipboardList, label: 'Task Summary', onClick: onTaskSummary },
    { icon: Mail, label: 'Send Message', onClick: onSendMessage },
    { icon: Edit, label: 'Edit Profile', onClick: onEdit },
  ];

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
            onClick={action.onClick}
            className={`flex items-center gap-2.5 px-8 py-3 rounded-sm text-sm font-semibold transition-colors border ${
              i === 0
                ? 'bg-white text-[#1A6FC4] border-white hover:bg-gray-50'
                : 'bg-transparent text-white border-white hover:bg-white/10'
            }`}
          >
            <Icon size={14} />
            {action.label}
          </button>
        );
      })}
      {onActivate && (
        <button
          onClick={onActivate}
          className="flex items-center gap-2.5 px-8 py-3 rounded-sm text-sm font-semibold transition-colors border border-green-400 text-green-300 hover:bg-green-400/10"
        >
          <UserCheck size={14} />
          Activate
        </button>
      )}
      {onDeactivate && (
        <button
          onClick={onDeactivate}
          className="flex items-center gap-2.5 px-8 py-3 rounded-sm text-sm font-semibold transition-colors border border-yellow-400 text-yellow-300 hover:bg-yellow-400/10"
        >
          <UserX size={14} />
          Deactivate
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="flex items-center gap-2.5 px-8 py-3 rounded-sm text-sm font-semibold transition-colors border border-red-400 text-red-300 hover:bg-red-400/10"
        >
          <Trash2 size={14} />
          Delete
        </button>
      )}
    </div>
  );
}
