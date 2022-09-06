import { useDispatch, useSelector } from 'react-redux';
import { useSWRConfig } from 'swr';
import { useTranslation } from 'react-i18next';

import { filesEndPoint, uploadEndPoint } from '..//api';
import { RequireAuth } from '../auth';
import { addUpload, uploadProgress, removeUpload } from './actions';
import ProgressBar from './ProgressBar';
import { getUploads } from './selectors';
import useFiles from './useFiles';

const requests = {};

export default function Upload() {

    if (!files) {
        return null;
    }

    return (
        <RequireAuth>
            <section className="section">
                {Object.keys(allUploads).map(id => {
                    const upload = allUploads[id];
                    const percentage = 100 / upload.total * upload.transferred;

                    return (
                        <ProgressBar
                            key={id}
                            id={id}
                            percentage={percentage}
                            onAbort={handleAbort}
                        />
                    );
                })}
            </section>
        </RequireAuth>
    );
}
