import './StatusChip.css';

interface StatusChipProps {
  status: 'pending' | 'processing' | 'done';
  label: string;
}

export default function StatusChip({ status, label }: StatusChipProps) {
  return (
    <span className={`status-chip chip-${status}`}>
      {label}
    </span>
  );
}
