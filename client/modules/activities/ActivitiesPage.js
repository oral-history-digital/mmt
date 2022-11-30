import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { RequireAuth } from '../auth';
import { clearActivities } from './actions';
import Activities from './Activities';

export default function ActivitiesPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  function handleClearClick() {
    dispatch(clearActivities());
  }

  return (
    <RequireAuth>
      <section className="section">
        <div className="container">
          <h1 className="title is-spaced">
            {t('modules.activities.title')}
          </h1>

          <div className="has-text-right mb-5">
            <button
              type="button"
              className="button"
              onClick={handleClearClick}
            >
              {t('modules.activities.clear')}
            </button>
          </div>

          <Activities />
        </div>
      </section>
    </RequireAuth>
  );
}
