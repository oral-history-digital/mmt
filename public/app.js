(function app() {
    console.log('hello world');

})();


const fileInput = document.getElementById('file-input');

fileInput.addEventListener('change', handleFileChange);


function handleFileChange(event) {
    const files = event.target.files;
    const firstFile = files[0];

    console.log(firstFile);

    const req = new XMLHttpRequest();

    console.log(req);
}
