import { useSelector } from 'react-redux';

import { getUploads } from '../upload';
import ProgressBar from './ProgressBar';

export default function Activities() {
    const allUploads = useSelector(getUploads);

    function handleAbort() {
        // TODO
    }

    return Object.keys(allUploads).map(id => {
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
    });
}
