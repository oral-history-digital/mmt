import { useSelector } from 'react-redux';

import ProgressBar from './ProgressBar';
import { getActivities } from './selectors';

export default function Activities() {
    const allUploads = useSelector(getActivities);

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
