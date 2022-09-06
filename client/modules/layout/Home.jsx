import { useTranslation } from 'react-i18next';

export default function Home() {
    const { t } = useTranslation();

    return (
        <section class="hero is-primary">
            <div class="hero-body">
                <p class="title">
                    {t('modules.layout.home.title')}
                </p>
                <p class="subtitle">
                    {t('modules.layout.home.subtitle')}
                </p>
            </div>
        </section>
    );
}
