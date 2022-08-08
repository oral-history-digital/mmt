(function app() {
    console.log('hello world');

})();


const fileInput = document.getElementById('file-input');

if (fileInput) {
    fileInput.addEventListener('change', handleFileChange);
}

let currentRequest = null;


function handleFileChange(event) {
    fileInput.disabled = true;

    const files = event.target.files;
    const firstFile = files[0];

    console.log(firstFile);

    const req = new XMLHttpRequest();
    currentRequest = req;
    req.open('POST', '/upload');

    const formData = new FormData();
    formData.append('files', firstFile, firstFile.name);

    req.addEventListener('load', (event) => {
        console.log('transaction completed');
    });

    req.addEventListener('progress', (event) => {
        // The progress event is for the response!
        console.log(event.lengthComputable, event.loaded, event.total);
    });

    const uploadObject = req.upload;

    console.log(uploadObject);
    uploadObject.addEventListener('progress', (event) => {
        console.log(event.lengthComputable, event.loaded, event.total);

        if (event.lengthComputable) {
            const percentage = Math.round(100 / event.total * event.loaded);

            const progressBar = document.getElementById('progress-bar');

            progressBar.value = event.loaded;
            progressBar.innerHTML = `${percentage}%`;
        }
    });

    uploadObject.addEventListener('load', (event) => {
        console.log('upload complete');

        fileInput.value = null;
        fileInput.disabled = false;
        currentRequest = null;

        removeProgressBar(firstFile.name);
    });

    addProgressBar(firstFile);

    req.send(formData);

    console.log(req);
}

function addProgressBar(file) {
    const progressDiv = document.createElement('div');
    progressDiv.className = 'mr-5';
    progressDiv.style.flexGrow = 1;


    const filename = file.name;
    const filesize = Math.round(file.size / 1024);

    const container = document.getElementById('progress-bar-container');
    const message = document.createElement('p');

    message.id = 'progress-bar-message';
    message.innerHTML = `Uploading file <b>${filename}</b> with ${filesize.toLocaleString()}KiB…`;


    const progressBar = document.createElement('progress');

    console.log(progressBar);

    progressBar.id = 'progress-bar';
    progressBar.className = 'progress is-primary mt-3';
    progressBar.max = file.size;
    progressBar.value = 0;
    progressBar.innerHTML = '0%';

    const abortButton = document.createElement('button');
    abortButton.innerHTML = 'Abort';
    abortButton.type = 'button';
    abortButton.className = 'button';
    abortButton.style.marginLeft = 'auto';

    abortButton.addEventListener('click', (event) => {
        currentRequest.abort();
        currentRequest = null;
        fileInput.value = null;
        fileInput.disabled = false;

        removeProgressBar();
    });

    progressDiv.append(message);
    progressDiv.append(progressBar);
    container.append(progressDiv);
    container.append(abortButton);
}

function removeProgressBar() {
    const container = document.getElementById('progress-bar-container');
    container.innerHTML = '';
}
