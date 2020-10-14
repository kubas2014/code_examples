/*
Meteor.js example methods that work with AWS APIs.
*/

// sends temporary signed download url to client (expires in 3min)
  'get_image_url': function(id) {
      let images = Images.findOne({_id: id}); //find the id of the image
      if (images) { //if images are found
        var params = {
              Bucket: Meteor.settings.AWS.bucket,
              Key: images.image_key,
              Expires: 180
        };
        //call AWS and await response
        let url = new Promise( function (resolve,reject) {
          s3.getSignedUrl('getObject', params, function (err, result) {
          if (err) { reject(err); }
          else { resolve(result); }
          });
        });
        return url; //return image url to client (or error)
      }
  },

//removes image from s3 and then from the database
  'remove_image': function(id) {
    const role = Meteor.users.findOne({ _id: this.userId }).roles;

    if (role == 'admin' || role == 'superuser') { //check if the user has rights to perform the operation
      //find images to be deleted in the db
      var images = Images.find({ _id: id}).fetch()
      //parameters to pass to AWS S3
      var params = {
       Bucket: Meteor.settings.AWS.bucket,
       Delete: {
         Objects: new Array(),
       },
      };

      if (images) { //if the images exist
        //pass the image keys to the parameters object
        for (i=0; i < images.length; i++){
          var key = { Key: images[i].image_key};
          params.Delete.Objects[i] = new Object({ Key: images[i].image_key});

        }
        //attempt to delete objects from AWS
        s3.deleteObjects(params, function(err, data) {
             if (err) {
               console.log(err, err.stack); return err} // an error occurred
             else {
               console.log(data); //success message
             };
          });
        //delete the images from our database
        Images.remove({ _id: id });
      }
      else { console.log("Images do not exist"); } //silently fail if images do not exist
      }
    else { console.log("Not enough rights for this operation"); } //silently fail if not enough rights

  },
