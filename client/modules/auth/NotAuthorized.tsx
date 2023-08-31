import { useTranslation } from 'react-i18next';

export default function NotAuthorized() {
  const { t } = useTranslation();

  return (
    <section className="section">
      <div className="container">
        <h1 className="title is-spaced">
          {t('modules.auth.not_authorized')}
        </h1>
      </div>
    </section>
  );
}
