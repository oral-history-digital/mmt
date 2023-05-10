import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { Login, Profile, SignUp } from '../auth/index.js';
import { UploadPage } from '../upload/index.ts';
import { DownloadPage } from '../download/index.js';
import { Layout, Home } from '../layout/index.js';

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
