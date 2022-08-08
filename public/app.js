(function app() {
    console.log('hello world');

})();


const fileInput = document.getElementById('file-input');

if (fileInput) {
    fileInput.addEventListener('change', handleFileChange);
}


function handleFileChange(event) {
    fileInput.disabled = true;

    const files = event.target.files;
    const firstFile = files[0];

    console.log(firstFile);

    const req = new XMLHttpRequest();
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
    });

    uploadObject.addEventListener('load', (event) => {
        console.log('upload complete');

        fileInput.value = null;
        fileInput.disabled = false;
    });

    req.send(formData);

    console.log(req);
}
