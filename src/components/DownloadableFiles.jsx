export default function DownloadableFiles() {
    const downloadFiles = [];

    return (
        <div className="content">
            <ul>
                {downloadFiles.map(file => (
                    <li>
                        <a href="/download?filename={{this.encoded}}" download>
                            {file.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
