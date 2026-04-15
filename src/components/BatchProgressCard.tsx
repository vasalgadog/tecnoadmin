import './BatchProgressCard.css';

interface BatchProgressCardProps {
  title: string;
  specs: string;
  progress: number;
}

export default function BatchProgressCard({ title, specs, progress }: BatchProgressCardProps) {
  return (
    <div className="batch-card surface-container-lowest ambient-shadow">
      <div className="batch-card-accent"></div>
      <div className="batch-card-content">
        <h3 className="batch-title display">{title}</h3>
        <p className="batch-specs">{specs}</p>
        <div className="progress-track surface-container-low">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
}
