import { GrMultimedia } from 'react-icons/gr';
import { useTranslation } from 'react-i18next';

import './Home.css';

export default function Home() {
    const { t } = useTranslation();

    return (
        <section className="hero is-primary">
            <div className="hero-body">
                <div className="container">
                    <GrMultimedia className="Icon--multimedia" />
                    <p className="title">
                        {t('modules.layout.home.title')}
                    </p>
                    <p className="subtitle">
                        {t('modules.layout.home.subtitle')}
                    </p>
                </div>
            </div>
        </section>
    );
}
