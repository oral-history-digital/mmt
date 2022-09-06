import { useTranslation } from 'react-i18next';

import { RequireAuth } from '../auth';
import DownloadableFiles from './DownloadableFiles';

export default function DownloadPage() {
    const { t } = useTranslation();

    return (
        <RequireAuth>
            <section className="section">
                <div className="container">
                    <div className="columns">
                        <div className="column is-two-thirds">
                            <h1 className="title is-spaced">
                                {t('modules.download.title')}
                            </h1>

                            {<DownloadableFiles />}
                        </div>
                    </div>
                </div>
            </section>
        </RequireAuth>
    );
}
