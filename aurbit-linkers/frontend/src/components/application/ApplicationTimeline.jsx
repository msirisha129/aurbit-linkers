import { CheckCircle, Circle, Clock } from 'lucide-react';

export default function ApplicationTimeline({ timeline = [] }) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock size={48} className="text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-slate-600">No application activity available yet.</p>
      </div>
    );
  }

  const formatDateTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
    return `${day} ${month} ${year} • ${hours}:${minutes} ${ampm}`;
  };

  const getStatusConfig = (index, totalItems) => {
    const isLast = index === totalItems - 1;
    const isCompleted = true; // All items in timeline are completed events
    const isCurrent = isLast; // Last item is current step

    if (isCurrent) {
      return {
        bg: 'bg-amber-100',
        border: 'border-amber-300',
        text: 'text-amber-700',
        icon: Clock,
        showPending: false,
      };
    }

    return {
      bg: 'bg-emerald-100',
      border: 'border-emerald-300',
      text: 'text-emerald-700',
      icon: CheckCircle,
      showPending: false,
    };
  };

  return (
    <div className="space-y-0">
      {timeline.map((item, index) => {
        const config = getStatusConfig(index, timeline.length);
        const Icon = config.icon;
        const isLast = index === timeline.length - 1;

        return (
          <div key={index} className="relative flex gap-4">
            {/* Icon and Connector Line */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full ${config.bg} ${config.border} border-2 flex items-center justify-center flex-shrink-0 z-10`}
              >
                <Icon size={20} className={config.text} strokeWidth={2.5} />
              </div>
              {!isLast && <div className="w-0.5 h-full bg-gray-200 mt-2" />}
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-navy-900 mb-1">
                    {item.event || item.status || 'Step ' + (index + 1)}
                  </h4>
                  {item.description && (
                    <p className="text-sm text-slate-600 mb-2">{item.description}</p>
                  )}
                  {item.note && !item.description && (
                    <p className="text-sm text-slate-600 mb-2">{item.note}</p>
                  )}
                </div>
                {item.date && (
                  <span className="text-xs text-slate-500 whitespace-nowrap flex-shrink-0">
                    {formatDateTime(item.date)}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}