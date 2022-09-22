
import { useTranslation } from 'react-i18next';

import { RequireAuth } from '../auth';
import Activities from './Activities';

export default function ActivitiesPage() {
  const { t } = useTranslation();

  return (
    <RequireAuth>
      <section className="section">
        <div className="container">
          <h1 className="title is-spaced">
            {t('modules.activities.title')}
          </h1>

          <Activities />
        </div>
      </section>
    </RequireAuth>
  );
}
