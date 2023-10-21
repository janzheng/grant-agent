
/* 
  Text Extract Strategies

  - Word / doc / docx:
    - Mammoth WORKS VERY WELL — takes buffers, and properly converts to HTML (with all styling intact!)

  - PDF:


*/



import textract from 'textract'


// let getTextract = async (file) => {
//   let res = await textract.fromFileWithPath(file)
//   return res
// }

// urls to test: (in Airtable under a test account)
// https://dl.airtable.com/.attachments/ece32b51895f5e57952d0d5d1cb58f04/f2f5630a/2022_VOM_abstract_ver5.docx
// https://dl.airtable.com/.attachments/c10302e398effac51cb81f2251b3dbab/6f3e7aac/Hayes_Sidney_clinical_Evergreen2021_abstract-sidney_hayesusask_ca.pdf

// does not work for PDFs?
export const textractFromUrl = async (url, options={
  pdftotextOptions: {
    layout: 'htmlmeta'
  }
}) => {
  return new Promise((resolve, reject) => {
    textract.fromUrl(url, options, (err, text) => {
      if (err) {
        reject(err)
      }
      resolve(text)
    })
  })
}

export const pdfFromUrl = async (url) => {
  return new Promise((resolve, reject) => {
    filepathFromUrl(url, (err, filepath) => {
      if (err) {
        reject(err)
      }
      console.log('[pdfFromUrl] filepath', filepath)
      resolve(filepath)
    })
  })
}







// yoinked from https://github.com/dbashford/textract/blob/master/lib/index.js

import fetch from 'node-fetch';
import pdf from 'pdf-parse/lib/pdf-parse';

export function filepathFromUrl(url, cb) {
  let callbackCalled = false;
  let dataBuffer = null;

  fetch(url)
    .then(function (response) {
      // Create an array buffer to store the file data
      return response.arrayBuffer();
    })
    .then(function (arrayBuffer) {
      dataBuffer = Buffer.from(arrayBuffer);

      if (!callbackCalled) {
        pdf(dataBuffer).then(function (data) {
          // use data
          cb(null, data);
        });
      }
    })
    .catch(function (error) {
      callbackCalled = true;
      cb(error);
    });
}




// doesn't support styling
import WordExtractor from 'word-extractor';

export function wordExtract(url, cb) {
  let callbackCalled = false;
  let dataBuffer = null;

  const extractor = new WordExtractor();

  fetch(url)
    .then(function (response) {
      // Create an array buffer to store the file data
      return response.arrayBuffer();
    })
    .then(function (arrayBuffer) {
      dataBuffer = Buffer.from(arrayBuffer);

      if (!callbackCalled) {
        extractor.extract(dataBuffer).then(function (data) {
          // use data
          console.log('wordExtract:', data)
          cb(null, data);
        });
      }
    })
    .catch(function (error) {
      callbackCalled = true;
      cb(error);
    });
}



// THIS IS GREAT FOR WORD DOCS

import mammoth from 'mammoth';

export function wordMammoth(url, cb) {
  let callbackCalled = false;
  let dataBuffer = null;

  const extractor = new WordExtractor();

  fetch(url)
    .then(function (response) {
      // Create an array buffer to store the file data
      return response.arrayBuffer();
    })
    .then(function (arrayBuffer) {
      dataBuffer = Buffer.from(arrayBuffer);

      if (!callbackCalled) {
        mammoth.convertToHtml({ buffer: dataBuffer }).then(function (data) {
          // use data
          console.log('wordMammoth:', data)
          cb(null, data);
        });
      }
    })
    .catch(function (error) {
      callbackCalled = true;
      cb(error);
    });
}




import pdf2md from '@opendocsg/pdf2md'
export function convertpdf2md(url, cb) {
  let callbackCalled = false;
  let dataBuffer = null;

  fetch(url)
    .then(function (response) {
      // Create an array buffer to store the file data
      return response.arrayBuffer();
    })
    .then(function (arrayBuffer) {
      dataBuffer = Buffer.from(arrayBuffer);

      if (!callbackCalled) {
        pdf2md(dataBuffer).then(function (data) {
          // use data
          console.log('convertpdf2md:', data)
          cb(null, data);
        });
      }
    })
    .catch(function (error) {
      callbackCalled = true;
      cb(error);
    });
}