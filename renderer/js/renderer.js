const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');

function loadImage(event) {
  // First and only item (our img) from the files array
  const file = event.target.files[0];

  if (!isFileImage(file)) {
    alertError('Please select an image');
    return;
  }

  // Get original dimensions by using the image constructor and the URL object
  const image = new Image();
  // Set the source of the image
  image.src = URL.createObjectURL(file);
  // Fire a function when the image is loaded
  image.onload = function () {
    // Capturing the width an height values and assign them to our HTML elements
    widthInput.value = this.width;
    heightInput.value = this.height;
  };

  // If an image is passed, then make the form visible
  form.style.display = 'block';
  // Set the inner html text for the filename and outpath elements
  filename.innerText = file.name;
  outputPath.innerText = path.join(os.homedir(), 'imageresizer');
}

// Send image data to main
function sendImage(event) {
  // Prevent default because this is just a submit
  event.preventDefault();

  const width = widthInput.value;
  const height = heightInput.value;
  const imagePath = img.files[0].path;

  // Check if width and height are filled in
  if (width === '' || height === '') {
    alertError('Please fill in a width and height');
  }

  // Send to main using ipcRenderer
  ipcRenderer.send('image:resize', { imagePath, width, height }); // send an event

  // Make sure there is an image
  if (!img.files[0]) {
    alertError('Please upload an image');
  }
}

// Catch the image:done event from main
ipcRenderer.on('image:done', () => {
  alertSuccess(`Image resized to ${widthInput.value} x ${heightInput.value}`);
});

// Make sure file is img
function isFileImage(file) {
  const acceptedImageTypes = ['image/png', 'image/gif', 'image/jpeg'];
  return file && acceptedImageTypes.includes(file['type']);
}

function alertError(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: 'red',
      color: 'white',
      textAlign: 'center',
    },
  });
}

function alertSuccess(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: 'green',
      color: 'white',
      textAlign: 'center',
    },
  });
}

// When this img element changes, invoke the loadImage function
img.addEventListener('change', loadImage);
form.addEventListener('submit', sendImage);
