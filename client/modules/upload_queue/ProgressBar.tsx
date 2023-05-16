import { FC } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

type ProgressBarProps = {
  percentage: number;
  color: string,
  label: string,
  className?: string;
};

const ProgressBar: FC<ProgressBarProps> = ({
  percentage,
  color,
  label,
  className,
}) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const percentageStr = percentage.toLocaleString(lang, {
    maximumFractionDigits: 1,
  });

  return (
    <progress
      className={classNames('progress-bar', className)}
      style={{['--bar-color' as any]: color}}
      value={percentage}
      max={100}
      aria-label={`${label}: ${percentageStr} %`}
      title={`${label}: ${percentageStr} %`}
    >
      {percentageStr} %
    </progress>
  );
}

export default ProgressBar;
