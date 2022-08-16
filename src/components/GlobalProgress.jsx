import { useTranslation } from 'react-i18next';

export default function GlobalProgress({
    numItems,
    percentage,
}) {
    const { t } = useTranslation();

    return (
        <span style={{
            paddingLeft: '0.5rem',
            paddingRight: '0.5rem',
            background: `linear-gradient(90deg, lightblue ${percentage}%, transparent ${percentage}%)`,
        }}>
            {t('modules.layout.primary-nav.uploadWithCount', { count: numItems })}…
        </span>
    );
}
