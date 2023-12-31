import { GrMultimedia } from 'react-icons/gr';
import { useTranslation } from 'react-i18next';

declare var __VERSION__: string;

export default function Home() {
  const { t } = useTranslation();

  return (
    <section className="hero is-primary">
      <div className="hero-body">
        <div className="container">
          <div className="media">
            <GrMultimedia className="media-left icon--multimedia" />

            <div className="media-content">
              <p className="title mt-5">
                {t('modules.layout.home.title')}
                {' '}
                <span className="is-size-7">{__VERSION__}</span>
              </p>
              <p className="subtitle">
                {t('modules.layout.home.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
