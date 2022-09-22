import { useTranslation } from 'react-i18next';

import { RequireAuth } from '../auth';

export default function ActivitiesPage() {
  const { t } = useTranslation();

  return (
    <RequireAuth>
      <section className="section">
        <div className="container">
          <h1 className="title is-spaced">
            {t('modules.activities.title')}
          </h1>

          <div className="notification is-info is-light">
            {t('modules.activities.no_activities')}
          </div>
        </div>
      </section>
    </RequireAuth>
  );
}
