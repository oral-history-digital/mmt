import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

import { getActivities } from './selectors';
import ProgressBar from './ProgressBar';
import ActivityTile from './ActivityTile';

const REFRESH_INTERVAL = 10 * 1000;

export default function Activities() {
  const { t } = useTranslation();
  const activities = useSelector(getActivities);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  });

  function handleAbort() {
    // TODO
  }

  const activitiesList = Object.values(activities);

  if (activitiesList.length === 0) {
    return (
      <div className="notification is-info is-light">
        {t('modules.activities.no_activities')}
      </div>
    );
  }

  return activitiesList.map((activity) => (
    <ActivityTile
      key={activity.id}
      activity={activity}
      currentTime={currentTime}
    />
  ));
}
