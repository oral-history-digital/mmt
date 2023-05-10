import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container">
        <div className="content has-text-centered">
          <p>
            <b>
              Media Management Tool
            </b>
            {' '}
            {t('modules.layout.footer.description')}
            {' '}
            <a
              href="https://www.oral-history.digital/"
              target="_blank"
              rel="noreferrer"
            >
              Oral History.Digital.
            </a>
          </p>
          <p>
            <a
              href="https://www.oral-history.digital/impressum/index.html"
              target="_blank"
              rel="noreferrer"
            >
              {t('modules.layout.footer.imprint')}
            </a>
            {' · '}
            <a
              href="https://www.oral-history.digital/kontakt/index.html"
              target="_blank"
              rel="noreferrer"
            >
              {t('modules.layout.footer.contact')}
            </a>
            {' · '}
            <a
              href="https://www.oral-history.digital/impressum/datenschutzhinweise/index.html"
              target="_blank"
              rel="noreferrer"
            >
              {t('modules.layout.footer.privacy')}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
