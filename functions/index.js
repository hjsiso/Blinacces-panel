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
const gcs = require('@google-cloud/storage')({ keyFilename: 'serviceAccountKey.json' });
const admin = require('firebase-admin');
const moment = require('moment');
var numeral = require('numeral');
const pdfInvoice = require('@hjsiso/mypdf-invoice')
const _ =  require("lodash")
const nodemailer = require('nodemailer');


const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

const APP_NAME = 'Blinaccess App';


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
  console.log("##########  filePath " + filePath)
  const contentType = event.data.contentType; // This is the image Mimme type
  const fileDir = path.dirname(filePath);

  const fileName = path.basename(filePath);

  const thumbFilePath = path.normalize(path.join(fileDir, `${THUMB_PREFIX}${fileName}`));
  const origFilePath = path.normalize(path.join(fileDir, `${ORIG_PREFIX}${fileName}`));

  console.log("##########  thumbFilePath " + thumbFilePath)
  const tempLocalFile = path.join(os.tmpdir(), filePath);
  const tempLocalDir = path.dirname(tempLocalFile);

  const tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath);
  const tempLocalOrigFile = path.join(os.tmpdir(), origFilePath);

  const idItemDb = fileName.slice(0, fileName.indexOf("~"));
  let idImg = fileName.slice(fileName.indexOf("~") + 1);
  idImg = idImg.slice(0, idImg.indexOf("."));


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
  console.log("########## event.data.bucket " + event.data.bucket)
  const thumbFile = bucket.file(thumbFilePath);
  console.log("thumbFilePath " + thumbFilePath);
  const origFile = bucket.file(origFilePath);

  const metadata = { contentType: contentType };

  // Create the temp directory where the storage file will be downloaded.
  return mkdirp(tempLocalDir).then(() => {
    // Download file from bucket.
    return file.download({ destination: tempLocalFile });
  }).then(() => {
    console.log('The file has been downloaded to', tempLocalFile);
    // Generate a thumbnail using ImageMagick.
    return spawn('convert', [tempLocalFile, '-resize', `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}^`, '-gravity', 'center', '-extent', `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}`, tempLocalThumbFile], { capture: ['stdout', 'stderr'] });
  }).then(() => {
    console.log('Thumbnail created at', tempLocalThumbFile);
    // Uploading the Thumbnail.
    return bucket.upload(tempLocalThumbFile, { destination: thumbFilePath, metadata: metadata });
  }).then(() => {
    console.log('The file has been downloaded to', tempLocalFile);
    // Generate a Original Resize using ImageMagick.
    return spawn('convert', [tempLocalFile, '-resize', `${ORIG_MAX_WIDTH}x${ORIG_MAX_HEIGHT}^`, '-gravity', 'center', '-extent', `${ORIG_MAX_WIDTH}x${ORIG_MAX_HEIGHT}`, tempLocalOrigFile], { capture: ['stdout', 'stderr'] });
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
    const refImages = "products/" + idItemDb + "/images/" + idImg;
    return admin.database().ref(refImages).update(
      { original: fileUrl, thumbnail: thumbFileUrl }
    );
  }).then(() => console.log('Thumbnail URLs saved to database.'));
});


exports.onSendOrder = functions.database.ref('/orders/{userId}/{orderId}').onWrite(event => {

  const date = new Date()
  const order = event.data.val();
  const userId = event.params.userId
  const orderId = event.params.orderId
  var allProducts = []
  var userProfile = null;
  console.log('orderId :' + orderId)

  if(Object.prototype.hasOwnProperty.call(order, 'urlPDF')){
    console.log('Notificación ya enviada.');
    return null 
  }

  //const bucket = gcs.bucket(event.data.bucket);
  const bucket = gcs.bucket("blindaccesapp.appspot.com");
  const file = bucket.file("invoices/" + orderId + ".pdf");

  const refProducts = admin.database().ref("/products").once("value");
  var urlPDF = "";

  return refProducts.then(snapshot => {
    let items = snapshot.val();
    for (let item in items) {
      allProducts.push({
        id: item,
        name: items[item].name,
        description: items[item].description,
        price: items[item].price,
      });
    }
  }).then(() => {
    const refUserProfile = admin.database().ref("profiles/" + userId + "/userProfile").once("value")
    
    return refUserProfile.then(snapshot => {
      userProfile = snapshot.val();
      
  }).then(() => {

    let totalOrderAmout = 0;
    let totalOrderItems = 0;
    var items = [];
    var cartProducts = _.groupBy(order.products);
    //convert to array
    for (let product in cartProducts) {
        const productDetail = _.find(allProducts, { 'id': product });
        let item = {
          name: productDetail.name,
          price: productDetail.price, //productDetail.description,
          quantity: cartProducts[product].length,
          amount: productDetail.price * cartProducts[product].length,
        }
        items.push(item);
        //const productDetail = _.find(this.state.products, { 'id': product });
        //totalOrderItems += this.state.cartProducts[product].length
        //totalOrderAmout += this.state.cartProducts[product].length * productDetail.price

    }

    const document = pdfInvoice({
        company: {
          phone: userProfile.phone,
          email: userProfile.email,
          address: '',
          name: userProfile.company,
        },
        customer: {
          name: userProfile.name,
          email: userProfile.email,
        },
        items: items,
        cols: [50, 350, 420, 490]
      })

      document.generate() // triggers rendering
      return document.pdfkitDoc.pipe(file.createWriteStream())
    }).then(() => {
      
      const config = {
        action: 'read',
        expires: '03-01-2500'
      };
      return Promise.all([
        file.getSignedUrl(config),
        //file.getSignedUrl(config)
      ]);

    }).then(results => {
      urlPDF = results[0];
      const fecha = moment("/Date(" + order.startedAt + ")/").format("DD/MM/YYYY");
      const monto = numeral(order.amount).format('$ 0,00.00');
      const totalItems = order.products.length
      return sendEmail(userProfile.email, userProfile.name, userProfile.company, userProfile.phone, urlPDF, fecha, monto, totalItems);
    }).then(() => {
      const refOrder = "orders/" + userId + "/" + orderId;
      return admin.database().ref(refOrder).update(
        { urlPDF: urlPDF}
      );
    })
  })
});

function sendEmail(email, displayName, company, phone, urlPDF, fecha, monto, totalItems) {
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: email,
  };

 
  // The user subscribed to the newsletter.
  mailOptions.subject = `${APP_NAME} nueva orden registrada, Cliente: ${displayName}/${company} - Monto: ${monto} - Items: ${totalItems} !`;
  /*mailOptions.text = `Cliente: ${displayName} \n`;
  mailOptions.text += `Compañia: ${company} \n`;
  mailOptions.text += `Teléfono: ${phone} \n`;
  mailOptions.text += `Monto: ${monto} \n`;
  mailOptions.text += `Fecha: ${fecha} \n`;
  mailOptions.text += `Items: ${totalItems} \n`;
  mailOptions.text += `PDF: ${urlPDF} \n`;*/
  mailOptions.html = `<b>Cliente:</b> ${displayName} <br>`;
  mailOptions.html += `<b>Compañia:</b> ${company} <br>`;
  mailOptions.html += `<b>Teléfono:</b> ${phone} <br>`;
  mailOptions.html += `<b>Monto:</b> ${monto} <br>`;
  mailOptions.html += `<b>Fecha:</b> ${fecha} <br>`;
  mailOptions.html += `<b>Items:</b> ${totalItems} <br>`;
  mailOptions.html += `<b>Detalle: </b>&nbsp;&nbsp;<a href="${urlPDF}"><img src="https://firebasestorage.googleapis.com/v0/b/blindaccesapp.appspot.com/o/img%2Fpurchase_order.png?alt=media&token=b0bdc01c-92f0-4bde-9825-08608d47bb69" width="32" height="32"></a> <br>`;
  
  return mailTransport.sendMail(mailOptions).then(() => {
    return console.log('New welcome email sent to:', email);
  });
}