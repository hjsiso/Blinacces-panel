/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for t`he specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const functions = require('firebase-functions');
const mkdirp = require('mkdirp-promise');
// Include a Service Account Key to use a Signed URL
const gcs = require('@google-cloud/storage')({keyFilename: 'blindaccesapp-firebase-adminsdk-6slth-5b8ff25c00.json'});
const admin = require('firebase-admin');


admin.initializeApp(functions.config().firebase);


const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');

// Max height and width of the thumbnail in pixels.
const THUMB_MAX_HEIGHT = 120;
const THUMB_MAX_WIDTH = 120;
// Thumbnail prefix added to file names.
const THUMB_PREFIX = 'thumb_';

// Max height and width of the thumbnail in pixels.
const ORIG_MAX_HEIGHT = 350;
const ORIG_MAX_WIDTH = 350;
// Thumbnail prefix added to file names.
const ORIG_PREFIX = 'orig_';

/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 * After the thumbnail has been generated and uploaded to Cloud Storage,
 * we write the public URL to the Firebase Realtime Database.
 */
exports.generateThumbnail = functions.storage.object().onChange(event => {
  // File and directory paths.
  const filePath = event.data.name;
  const contentType = event.data.contentType; // This is the image Mimme type
  const fileDir = path.dirname(filePath);
  const fileName = path.basename(filePath);

  const thumbFilePath = path.normalize(path.join(fileDir, `${THUMB_PREFIX}${fileName}`));
  const origFilePath = path.normalize(path.join(fileDir, `${ORIG_PREFIX}${fileName}`));

  const tempLocalFile = path.join(os.tmpdir(), filePath);
  const tempLocalDir = path.dirname(tempLocalFile);

  const tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath);
  const tempLocalOrigFile = path.join(os.tmpdir(), origFilePath);

  const idItemDb = fileName.slice(0, fileName.indexOf("~"));

  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith('image/')) {
    console.log('This is not an image.');
    return null;
  }

  // Exit if the image is already a thumbnail.
  if (fileName.startsWith(ORIG_PREFIX) || fileName.startsWith(THUMB_PREFIX)) {
    console.log('Already a converted.');
    return null;
  }

  // Exit if this is a move or deletion event.
  if (event.data.resourceState === 'not_exists') {
    console.log('This is a deletion event.');
    return null;
  }

  // Cloud Storage files.
  const bucket = gcs.bucket(event.data.bucket);
  const file = bucket.file(filePath);

  const thumbFile = bucket.file(thumbFilePath);
  const origFile = bucket.file(origFilePath);

  const metadata = { contentType: contentType };

  // Create the temp directory where the storage file will be downloaded.
  return mkdirp(tempLocalDir).then(() => {
    // Download file from bucket.
    return file.download({destination: tempLocalFile});
  }).then(() => {
    console.log('The file has been downloaded to', tempLocalFile);
    // Generate a thumbnail using ImageMagick.
    return spawn('convert', [tempLocalFile, '-resize', `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}`, '-gravity center', tempLocalThumbFile], {capture: ['stdout', 'stderr']});
  }).then(() => {
    console.log('Thumbnail created at', tempLocalThumbFile);
    // Uploading the Thumbnail.
    return bucket.upload(tempLocalThumbFile, { destination: thumbFilePath, metadata: metadata });
  }).then(() => {
    console.log('The file has been downloaded to', tempLocalFile);
    // Generate a Original Resize using ImageMagick.
    return spawn('convert', [tempLocalFile, '-resize', `${ORIG_MAX_WIDTH}x${ORIG_MAX_HEIGHT}`, '-gravity center', tempLocalOrigFile], {capture: ['stdout', 'stderr']});
  }).then(() => {
    console.log('Original Resized created at', tempLocalOrigFile);
    // Uploading the Original Resize.
    return bucket.upload(tempLocalOrigFile, { destination: origFilePath, metadata: metadata });
  }).then(() => {
    console.log('Original Resize uploaded to Storage at', origFilePath);
    // Once the image has been uploaded delete the local files to free up disk space.
    fs.unlinkSync(tempLocalFile);
    fs.unlinkSync(tempLocalOrigFile);
    fs.unlinkSync(tempLocalThumbFile);
    // Get the Signed URLs for the thumbnail and original image.
    const config = {
      action: 'read',
      expires: '03-01-2500'
    };
    return Promise.all([
      thumbFile.getSignedUrl(config),
      origFile.getSignedUrl(config)
      //file.getSignedUrl(config)
    ]);
  }).then(results => {
    console.log('Got Signed URLs.');
    const thumbResult = results[0];
    const originalResult = results[1];
    const thumbFileUrl = thumbResult[0];
    const fileUrl = originalResult[0];
    // Add the URLs to the Database
    const refImages = "products/" +  idItemDb + "/images";
    return admin.database().ref(refImages).push({original: fileUrl, thumbnail: thumbFileUrl});
  }).then(() => console.log('Thumbnail URLs saved to database.'));
});

