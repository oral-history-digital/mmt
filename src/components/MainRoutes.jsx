import { Routes, Route } from 'react-router-dom';

import Layout from './Layout';
import Files from './Files';
import Home from './Home';
import Upload from './Upload';

export default function MainRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="files" element={<Files />} />
                <Route path="upload" element={<Upload />} />
            </Route>
        </Routes>
    );
}
