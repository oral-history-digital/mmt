import { useTranslation } from 'react-i18next';

import { RequireAuth } from '../auth';
import DownloadableFiles from './DownloadableFiles';

export default function DownloadPage() {
    const { t } = useTranslation();

    return (
        <RequireAuth>
            <div className="container">
                <section className="section">
                    <h1 className="title is-spaced">
                        {t('modules.download.title')}
                    </h1>

                    {<DownloadableFiles />}
                </section>
            </div>
        </RequireAuth>
    );
}
