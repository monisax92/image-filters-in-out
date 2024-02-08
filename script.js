const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const input = document.querySelector('#img');

// select all the buttons
const grayscaleBtn = document.querySelector('#grayscale');
const monotoneBtn = document.querySelector('#monotone');
const duotoneBtn = document.querySelector('#duotone');
const resetBtn = document.querySelector('#reset');
const downloadBtn = document.querySelector('#download-btn');

let imgWidth = null;
let imgHeight = null;
let originalImg = null;

//////////////////// whenever user uploads a file
// ---------- create img element and config sizes
const img = new Image(); //creates <img> HTML el
img.addEventListener('load', () => {
	imgWidth = img.width;
	imgHeight = img.height;

	canvas.width = imgWidth;
	canvas.height = imgHeight;
	ctx.drawImage(img, 0, 0);
});

// ---------- read file content of uploaded img saves its src
const imgReader = new FileReader();
imgReader.addEventListener('load', () => {
	img.src = imgReader.result;
	originalImg = imgReader.result; //for reset case
});

// ---------- display img in canvas
input.addEventListener('change', () => {
	imgReader.readAsDataURL(input.files[0]);
});

//////////////////// apply filters
const applyFilter = filter => {
	if (!imgWidth || !imgHeight) {
		return alert('Please upload image first 😬');
	}
	const img = ctx.getImageData(0, 0, imgWidth, imgHeight);
	//data property holds rgba info about each px (4 subsequent values for each pixel, creating huge array of 4*[nrOfPixels] elements)
	const imgData = img.data;

	//access and update Red Green Blue of each px
	for (let i = 0; i < imgData.length; i += 4) {
		const pxRed = imgData[i];
		const pxGreen = imgData[i + 1];
		const pxBlue = imgData[i + 2];
		const avgValue = (pxRed + pxGreen + pxBlue) / 3;

		switch (filter) {
			case 'grayscale':
				imgData[i] = avgValue;
				imgData[i + 1] = avgValue;
				imgData[i + 2] = avgValue;
				break;
			case 'monotone':
				imgData[i] = avgValue;
				imgData[i + 1] = avgValue;
				imgData[i + 2] = avgValue;
				break;
			case 'duotone':
				const diff = Math.round((128 / 100) * avgValue);
				imgData[i] = avgValue + diff;
				imgData[i + 1] = avgValue;
				imgData[i + 2] = 255 - diff;
				break;
			default:
				throw Error('There is no such filter');
		}
	}

	//update img in canvas
	ctx.putImageData(img, 0, 0);
	//and update href for download purposes
	downloadBtn.href = canvas.toDataURL();
};

//////////////////// handle reset
const handleReset = () => {
	if (!img || !ctx || !originalImg) {
		return alert('Nothing to be reset ¯\\_(ツ)_/¯');
	} else {
		img.src = originalImg;
		ctx.drawImage(img, 0, 0);
	}
};

grayscaleBtn.addEventListener('click', () => applyFilter('grayscale'));
monotoneBtn.addEventListener('click', () => applyFilter('monotone'));
duotoneBtn.addEventListener('click', () => applyFilter('duotone'));

resetBtn.addEventListener('click', handleReset);
