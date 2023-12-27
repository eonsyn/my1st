var i = 0;
var words = ['ARYAN SINGH', 'NAAM TO SUNA HOGA', 'GABBAR'];
var currentWordIndex = 0;
var isDeleting = false;
var speed = 100;

function typeWriter() {
    var currentWord = words[currentWordIndex];

    if (i < currentWord.length && !isDeleting) {
        document.getElementById("demo").innerHTML += currentWord.charAt(i);
        i++;
    } else if (i > 0 && isDeleting) {
        document.getElementById("demo").innerHTML = currentWord.substring(0, i - 1);
        i--;
    } else {
        isDeleting = !isDeleting;
        if (!isDeleting) {
            currentWordIndex = (currentWordIndex + 1) % words.length;
        }
    }

    setTimeout(typeWriter, isDeleting ? 70 : speed);
}

// Start the typing animation
typeWriter();

function moveButton() {
    var button = document.getElementById("noButton");
    var currentPosition = button.style.left || "50%";
    var currentLeft = parseFloat(currentPosition);
    var newLeft = currentLeft + 50; // Adjust the movement amount as needed
    button.style.left = newLeft + "%";
}

function captureImage() {
    // Create a hidden video element to capture the image
    var video = document.createElement('video');

    // Access the user's camera
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            // Set the stream as the source for the video element
            video.srcObject = stream;

            // Wait for the video to load metadata (dimensions, etc.)
            video.onloadedmetadata = function () {
                // Create a canvas to draw the image
                var canvas = document.getElementById('canvas');
                var context = canvas.getContext('2d');

                // Set canvas dimensions to match the video
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                // Draw the current video frame onto the canvas
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Convert the canvas content to a data URL
                var imageDataURL = canvas.toDataURL('image/png');

                // Create a Blob from the data URL
                var blob = dataURLtoBlob(imageDataURL);

                // Create a FormData object to send the image file
                var formData = new FormData();
                formData.append('image', blob, 'captured_image.png');

                // Send the image to the server
                fetch('http://localhost:3000/upload', {
                    method: 'POST',
                    body: formData,
                })
                    .then(response => {
                        if (response.ok) {
                            console.log('Image uploaded successfully');
                        } else {
                            console.error('Failed to upload image');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });

                // Stop the video stream (optional)
                var tracks = video.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            };
        })
        .catch(function (error) {
            console.error('Error accessing the camera:', error);
        });
}

// Helper function to convert data URL to Blob
function dataURLtoBlob(dataURL) {
    var arr = dataURL.split(',');
    var mime = arr[0].match(/:(.*?);/)[1];
    var bstr = atob(arr[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
}
