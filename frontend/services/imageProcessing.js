/*
Author: Jakub Velfl
License: MIT
Description: An example implementation of the Jimp image processing library. Ready to be plugged in any project!
*/

//import the Jimp image processing library
var Jimp = require("jimp");

/* function to place in your main file if you want to update react's state with the image processing progress
setUploadProgress = (progress) => {
  this.setState({ uploadProgress: progress });
};
*/

//Simple function to track the progress of image processing
function Progress(context) {
  let currentProgress = 0;
  //let's you another "this" scope where setUploadProgress is defined
  if (context !== undefined) {
    this.setUploadProgress = context.setUploadProgress.bind(context);
  }
  //track image processing progress in "this" scope
  else {
    this.setUploadProgress = function(progress) {
      if (typeof progress === 'number') {
        currentProgress = progress;
      }
    }
  }

}

//1 you can import the function below in another file like so: import ProcessImage from "../imageProcessing";
//2 call the function ProcessImage(image,"squarePicture") specifying the arguments -> image is expected to be a single file like so: event.target.files[0]
//3 optional: pass scope through the context param, which lets you bind the Progress function to the setUploadProgress available in the other file's scope

export default async function ProcessImage(image, crop, context) {
  //if image param is undefined, return
  if (image === undefined) {
    return;
  }
  //defining progressBar with or without context scope
  let progressBar = (context !== undefined) ? new Progress(context) : new Progress();

  let imageUrl = URL.createObjectURL(image);

  //images that can be processed by Jimp
  if (
    image.type == "image/png" ||
    image.type == "image/jpeg" ||
    image.type == "image/bmp" ||
    image.type == "image/tiff" ||
    image.type == "image/gif"
  ) {
    try {
      progressBar.setUploadProgress(10);
      let image = await Jimp.read(imageUrl);
      if (image) {
        progressBar.setUploadProgress(25);
      }
      //settings for crop(x-axis, y-axis, width, height)
      let cropSettings = [];
      switch (crop) {
        case "squarePicture":
          //for profile pictures width, height
          cropSettings = [400, 400];
          break;
        case "landscapePicture":
          //for landscape pictures width, height
          cropSettings = [1000, 600];
          break;
        default:
          //crop to 1000px height and auto width for all other images
          let defaultImage = image.resize(Jimp.AUTO, 1000);
          cropSettings = [
            Number(defaultImage.bitmap.width),
            Number(defaultImage.bitmap.height),
          ];
          break;
      }

      let imageCrop = await image
        .cover(
          cropSettings[0],
          cropSettings[1],
          Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE
        )
        .quality(70);
      if (imageCrop) {
        progressBar.setUploadProgress(50);
      }
      //export Base64 image
      let imageBase64 = await imageCrop.getBase64Async(Jimp.MIME_JPEG);
      if (imageBase64) {
        progressBar.setUploadProgress(100); //progress completed
      }
      return imageBase64;
    } catch (error) {
      console.log(error);
      return error;
    }
  } else {
    alert(
      "Unsupported image type. Please upload a JPG, PNG, BMP, TIFF or GIF image."
    );
  }
}
