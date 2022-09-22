import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { formatDistance } from 'date-fns';
import { de } from 'date-fns/locale';

export default function ActivityTile({
  activity,
  currentTime
}) {
  const { t, i18n } = useTranslation();

  const localeOptions = {};
  if (i18n.language === 'de') {
    localeOptions.locale = de;
  }

  const percentage = 100 / activity.total * activity.current;
  const isFinished = activity.total === activity.current;

  const elapsedTime = formatDistance(activity.startedAt, currentTime, {
    addSuffix: true,
    ...localeOptions,
  });

  const elapsed = currentTime - activity.startedAt;

  const totalTime = elapsed / percentage * 100;
  const toGo = totalTime - elapsed;

  let remainingTime = t('modules.activities.not_calculable');
  if (Number.isFinite(toGo)) {
    const dateInFuture = new Date(currentTime.getTime() + toGo);
    remainingTime = formatDistance(dateInFuture, currentTime, {
      addSuffix: true,
      ...localeOptions,
    });
  }
  if (isFinished) {
    remainingTime = '';
  }

  return (
    <article className={classNames('box',
      {'has-background-success-light': !isFinished})}
    >
      <div>
        <span className="tag">
          {t(`modules.activities.types.${activity.type}`)}
        </span>
      </div>

      <h3 className="is-size-4">
        {activity.name}
      </h3>

      <p>
        {percentage.toLocaleString(i18n.language)} %
      </p>

      <p>
        {t('modules.activities.started')} {elapsedTime}
      </p>

      <p>
      {t('modules.activities.finished')} {remainingTime}
      </p>
    </article>
  );
}
