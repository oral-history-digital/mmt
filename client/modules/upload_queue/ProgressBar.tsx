import { FC } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

type ProgressBarProps = {
  percentage: number;
  className?: string;
};

const ProgressBar: FC<ProgressBarProps> = ({
  percentage,
  className,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const percentageStr = percentage.toLocaleString(lang, {
    maximumFractionDigits: 1,
  });

  return (
    <progress
      className={classNames('progress-bar', className)}
      value={percentage}
      max={100}
      aria-label={`${percentageStr} %`}
      title={`${percentageStr} %`}
    >
      {percentageStr} %
    </progress>
  );
}

export default ProgressBar;
