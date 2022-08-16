import { useTranslation } from 'react-i18next';

export default function Home() {
    const { t } = useTranslation();

    return (
        <section className="section">
            <h1 className="title">
                {t('modules.layout.home.title')}
            </h1>

            <p className="subtitle">
                {t('modules.layout.home.subtitle')}
            </p>
        </section>
    );
}
