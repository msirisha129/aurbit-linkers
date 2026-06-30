import { CheckCircle, Clock, AlertCircle, XCircle, FileQuestion } from 'lucide-react';

const statusConfig = {
  'Documents Pending': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: Clock,
  },
  'Query Raised': {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: AlertCircle,
  },
  'Under Review': {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    icon: FileQuestion,
  },
  'Completed': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: CheckCircle,
  },
  'Rejected': {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: XCircle,
  },
};

export default function ApplicationStatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig['Documents Pending'];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text} border ${config.border}`}>
      <Icon size={14} strokeWidth={2.5} />
      {status}
    </span>
  );
}