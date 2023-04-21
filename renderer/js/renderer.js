const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');

function loadImage(event) {
  // first and only item (our img) from the files array
  const file = event.target.files[0];

  if (!isFileImage(file)) {
    console.log('Please select an image file');
    return;
  }

  // get original dimensions by using the image constructor and the URL object
  const image = new Image();
  // set the source of the image
  image.src = URL.createObjectURL(file);
  // fire a function when the image is loaded
  image.onload = function () {
    // capturing the width an height values and assign them to our HTML elements
    widthInput.value = this.width;
    heightInput.value = this.height;
  };

  // if an image is passed, then make the form visible
  form.style.display = 'block';
  filename.innerText = file.name;
}

// make sure file is img
function isFileImage(file) {
  const acceptedImageTypes = ['image/png', 'image/gif', 'image/jpeg'];
  return file && acceptedImageTypes.includes(file['type']);
}

// when this img element changes, invoke the loadImage function
img.addEventListener('change', loadImage);

// Some JavaScript to load the image and show the form. There is no actual backend functionality. This is just the UI

// const form = document.querySelector('#img-form');

// function loadImage(e) {
//   const file = e.target.files[0];

//   if (!isFileImage(file)) {
//       alert('Please select an image file');
//         return;
//   }

//   form.style.display = 'block';
//   document.querySelector(
//     '#filename'
//   ).innerHTML = file.name;
// }

// function isFileImage(file) {
//     const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
//     return file && acceptedImageTypes.includes(file['type'])
// }

// document.querySelector('#img').addEventListener('change', loadImage);
