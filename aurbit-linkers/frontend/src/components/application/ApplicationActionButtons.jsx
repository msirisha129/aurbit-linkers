import { Upload, Download, FileText, LayoutDashboard } from 'lucide-react';

export default function ApplicationActionButtons({
  showReceipt = false,
  showApplications = false,
  showDashboard = true,
  onReceipt,
  onApplications,
  onDashboard,
}) {
  const buttons = [];

  if (showReceipt) {
    buttons.push({
      label: 'Download Receipt',
      icon: Download,
      onClick: onReceipt,
      variant: 'secondary',
    });
  }

  if (showApplications) {
    buttons.push({
      label: 'View My Applications',
      icon: FileText,
      onClick: onApplications,
      variant: 'secondary',
    });
  }

  if (showDashboard) {
    buttons.push({
      label: 'Go To Dashboard',
      icon: LayoutDashboard,
      onClick: onDashboard,
      variant: 'secondary',
    });
  }

  return (
    <div className="space-y-3">
      {buttons.map((button, index) => {
        const Icon = button.icon;
        const isPrimary = button.variant === 'primary';

        return (
          <button
            key={index}
            onClick={button.onClick}
            className={`w-full h-[48px] rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
              isPrimary
                ? 'bg-[#1a2744] text-white hover:bg-[#15203a]'
                : 'border border-gray-200 bg-white text-navy-900 hover:bg-gray-50'
            }`}
          >
            <Icon size={16} />
            {button.label}
          </button>
        );
      })}
    </div>
  );
}