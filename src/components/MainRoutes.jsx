import { Routes, Route } from 'react-router-dom';

import Layout from './Layout';
import Files from './Files';
import DownloadableFiles from './DownloadableFiles';
import UploadedFiles from './UploadedFiles';
import Home from './Home';
import { Upload } from '../modules/upload';
import { Profile } from '../modules/auth';
import Login from './Login';
import SignUp from './SignUp';

export default function MainRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="files" element={<Files />}>
                    <Route path="uploaded" element={<UploadedFiles />} />
                    <Route path="downloadable" element={<DownloadableFiles />} />
                </Route>
                <Route path="upload" element={<Upload />} />
                <Route path="login" element={<Login />} />
                <Route path="sign-up" element={<SignUp />} />
                <Route path="profile" element={<Profile />} />
            </Route>
        </Routes>
    );
}
