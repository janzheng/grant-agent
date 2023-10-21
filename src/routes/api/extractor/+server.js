
/* 
  File Extractor Strategies

  - Word / doc / docx:
    - Mammoth WORKS VERY WELL — takes buffers, and properly converts to HTML (with all styling intact!) 

  - PDF:


*/

import { hjson } from '$plasmid/utils/sveltekit-helpers'
import { json } from '@sveltejs/kit';

import { getMdFromPdf, getHtmlFromWord } from './';

// 
// send a form with file and type is sent as a POST to this endpoint
// gets the text!
export const POST = async ({ request }) => {
  // console.log('extractor request::', request)
  const data = await request.formData(); // or .json(), or .text(), etc
  const form = Object.fromEntries(data);
  const file = data.get('file')
  const type = data?.get('type');
  const url = data?.get('url');
  let buffer


  // turn file from a blob into a buffer
  //
  if(file) {
    buffer = await new Response(file).arrayBuffer()
    buffer = Buffer.from(buffer)
  }

  console.log('extractor data::', file, type, url, buffer)

  let result
  if(url && type == 'pdf') {
    result = await getMdFromPdf({url})
    // return hjson({text: await getMdFromPdf({url})})
  } else if(url && type == 'word') {
    result = await getHtmlFromWord({url})
    // return hjson({text: await getHtmlFromWord({url})})
  } else if(file && type == 'pdf') {
    result = await getMdFromPdf({buffer})
    // return hjson({text: await getMdFromPdf({buffer})})
  } else if(file && type == 'word') {
    result = await getHtmlFromWord({buffer})
    // return hjson({text: await getHtmlFromWord({buffer})})
  }

  if(result) {
    console.log('extractor result::', result)
    return hjson({text: result})
  }

  return hjson({text: null})
}

