import './Sidebar.css';

import { Activities } from '../activities';

export default function Sidebar() {
    return (
        <aside className="Sidebar has-text-white has-background-info-dark">
            <Activities />
        </aside>
    );
}
