import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Message } from '../ui';
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
      <Message type="info">
        {t('modules.activities.no_activities')}
      </Message>
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
