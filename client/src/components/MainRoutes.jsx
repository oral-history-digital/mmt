import { Routes, Route } from 'react-router-dom';

import { Login, Profile, SignUp } from '../modules/auth';
import { UploadPage } from '../modules/upload';
import { DownloadPage } from '../modules/download';
import Layout from './Layout';
import Home from './Home';

export default function MainRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="upload" element={<UploadPage />} />
                <Route path="download" element={<DownloadPage />} />
                <Route path="login" element={<Login />} />
                <Route path="sign-up" element={<SignUp />} />
                <Route path="profile" element={<Profile />} />
            </Route>
        </Routes>
    );
}
