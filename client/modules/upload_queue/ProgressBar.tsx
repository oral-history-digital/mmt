import { FC } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

type ProgressBarProps = {
  percentage: number;
  alt?: boolean,
  className?: string;
};

const ProgressBar: FC<ProgressBarProps> = ({
  percentage,
  alt,
  className,
}) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const percentageStr = percentage.toLocaleString(lang, {
    maximumFractionDigits: 1,
  });

  return (
    <progress
      className={classNames('progress-bar', className, {
        'progress-bar--alt': alt,
      })}
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
