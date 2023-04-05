const AWS = require('aws-sdk');

const multer = require('multer');

const multerS3 = require('multer-s3');

const express = require('express');

const app = express();

// Set the S3 endpoint to your S3 region

const s3 = new AWS.S3({

  endpoint: 's3.your-region.amazonaws.com',

  accessKeyId: 'your-access-key-id',

  secretAccessKey: 'your-secret-access-key'

});

// Set up multer middleware for file upload

const upload = multer({

  storage: multerS3({

    s3: s3,

    bucket: 'your-bucket-name',

    acl: 'public-read',

    contentType: multerS3.AUTO_CONTENT_TYPE,

    key: (req, file, cb) => {

      cb(null, Date.now().toString() + '-' + file.originalname);

    }

  })

});

// Set up route for file upload

app.post('/upload', upload.array('images', 10), (req, res) => {

  const files = req.files;

  files.forEach(file => {

    // Set the S3 parameters

    const params = {

      Bucket: 'your-bucket-name',

      Key: file.key,

      Body: file.buffer

    };

    // Upload the file to S3

    s3.putObject(params, (err, data) => {

      if (err) {

        console.log(err);

      } else {

        console.log(`Successfully uploaded ${file.originalname} to S3`);

      }

    });

  });

  res.send('Files uploaded successfully');

});

const AWS = require('aws-sdk');

const sharp = require('sharp');

const fs = require('fs');

// Set the S3 endpoint to your S3 region

const s3 = new AWS.S3({

  endpoint: 's3.your-region.amazonaws.com',

  accessKeyId: 'your-access-key-id',

  secretAccessKey: 'your-secret-access-key'

});

// Set the input and output directories

const inputDir = './images/input/';

const outputDir = './images/output/';

// Loop through each image in the input directory

fs.readdirSync(inputDir).forEach(file => {

  const inputFile = inputDir + file;

  const outputFile = outputDir + file;

  // Use sharp to resize and optimize the image

  sharp(inputFile)

    .resize(800, 600)

    .jpeg({ quality: 90, progressive: true })

    .toFile(outputFile, (err, info) => {

      if (err) {

        console.log(err);

      } else {

        // Read the file from disk

        const fileContent = fs.readFileSync(outputFile);

        // Set the S3 parameters

        const params = {

          Bucket: 'your-bucket-name',

          Key: file,

          Body: fileContent,

          ContentType: 'image/jpeg'

        };

        // Upload the file to S3

        s3.putObject(params, (err, data) => {

          if (err) {

            console.log(err);

          } else {

            console.log(`Successfully uploaded ${file} to S3`);

          }

        });

      }

    });

});


app.listen(3000, () => {

  console.log('Server listening on port 3000');

});

