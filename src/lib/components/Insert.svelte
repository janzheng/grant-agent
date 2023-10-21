
<script>

  export let demoMode = false

  import { marked } from "marked"
  import { md2json } from "$lib/utils/md2json.js"
  import { JsonView } from '@zerodevx/svelte-json-view'

  import { grantStore } from "$lib/stores"
  import { short, long, grantDetailsObj, grantHtml } from "$lib/sample"

  // export let grantText = short; // ''
  export let grantText = long; // ''

  export let openTextInput=false, isAutofillLoading, autofillMessage;
  export let files=[], fileUpload;
  export let uploadHtmlText = `<div class="text-lg mt-3 text-slate-800">Upload Grant Requirements (PDF / Word)</div>`;

  export let dropContainerClasses = ` | p-2 rounded-lg bg-gray-50 border-gray-300 `;
  export let dropClasses = `rounded-lg border-2 border-dashed hover:bg-gray-100 pt-4`;

  
  $: if($grantStore) {
    console.log("[grantStore]", $grantStore)
  }
  
  
  async function extractFile() {

    try {
      if(!(files && files[0]))
        return null

      fileUpload = files[0]
      autofillMessage = `
      <svg class="animate-spin h-5 w-5 text-white !text-neutral-400 " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Extracting: ${fileUpload?.name || "text"}
      <br>
      <svg class="animate-spin h-5 w-5 text-white !text-neutral-400 " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processing grant details...`
      isAutofillLoading = true

      const fileFormData = new FormData();
      fileFormData.append('file', fileUpload)
      if(fileUpload?.type.includes('/pdf')) {
        fileFormData.append('type', 'pdf')
      } else if (fileUpload?.type.includes('word') || fileUpload?.type.includes('office')) {
        fileFormData.append('type', 'word')
      }

      // console.log('[uploaded file]:', fileUpload);
      // console.log('sending :::', fileFormData, fileFormData.get('file'))
      const extractorUrl = `/api/extractor`

      const res = await fetch(
        // `/api/extractor`, {
        extractorUrl, {
        method: 'POST',
        body: fileFormData
      })
      const fileData = await res.json()
      isAutofillLoading = false
      console.log('[extracted file] MD & JSON:', md2json(fileData.text), "from", fileData.text);
      $grantStore = {
        grant: {
          md: fileData.text,
          json: md2json(fileData.text)
        }
      }

      autofillMessage = `
      ✅ Extracting: ${fileUpload?.name || "text"}
      <br>
      <svg class="animate-spin h-5 w-5 text-white !text-neutral-400 " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processing grant details...`



      if(demoMode) {
        $grantStore.grant.details = grantDetailsObj
        $grantStore.grant.html = grantHtml
        autofillMessage = `
        ✅ Extracting: ${fileUpload?.name || "text"}
        <br>
        ✅ Processing grant details...
        <br>🤵🏼‍♂️ <b>Grant details extracted!
          `
        isAutofillLoading = false
      } else {
        await extractGrantDetails({
          text: $grantStore.grant.json
        });
      }
      // autofillMessage = 'Text processed ...'
    } catch(e) {
      console.log('error :::', e)
      isAutofillLoading = false
      autofillMessage = 'Server error'

    }
  }
  
 


  async function extractGrantDetails(obj) {
    isAutofillLoading = true

    let fetchUrl = "/api/grantExtract"

    console.log('extractGrantDetails URL:', fetchUrl, obj)
    let resExtract = await fetch(fetchUrl, {
      method: 'POST',
      body: JSON.stringify({ ...obj})
    })
    let resExtractData = await resExtract.json()
    autofillMessage = `
    ✅ Extracting: ${fileUpload?.name || "text"}
    <br>
    ✅ Processing grant details...
    <br>🤵🏼‍♂️ <b>Grant details extracted!
      `
    isAutofillLoading = false
    console.log('Extracted Grant Data', resExtractData)

    $grantStore['grant']['details'] = resExtractData.obj
    $grantStore['grant']['html'] = resExtractData.html
  }

</script>







<div class="Insert |">
  <div class="Insert-container | Card-white border-slate-200 p-4 mt-2 ">
    {@html marked(`### What grants are you working on? \nTo get started, tell me what grant you're applying for:`)}
    <div class="Insert-uploader">
      <!-- preload tw -->
      <span class="whitespace-pre hidden border-transparent p-4 mb-1 focus-within:border-slate-500 hover:border-slate-700 ease-in-out hover:ease-in-out focus-within:ease-in-out"></span>
      <div class="Grant-upload dropzone-container grid mb-2 {dropContainerClasses} ">
        <label for="dropzone-file" class="items-center relative w-full cursor-pointer  text-center | {dropClasses}">
          <div class="text-center items-center w-full ">
            <svg class="fill-slate-500 w-full" viewBox="0 0 1024 1024" focusable="false" data-icon="inbox" width="2em" height="2em" fill="currentColor" aria-hidden="true"><path d="M885.2 446.3l-.2-.8-112.2-285.1c-5-16.1-19.9-27.2-36.8-27.2H281.2c-17 0-32.1 11.3-36.9 27.6L139.4 443l-.3.7-.2.8c-1.3 4.9-1.7 9.9-1 14.8-.1 1.6-.2 3.2-.2 4.8V830a60.9 60.9 0 0060.8 60.8h627.2c33.5 0 60.8-27.3 60.9-60.8V464.1c0-1.3 0-2.6-.1-3.7.4-4.9 0-9.6-1.3-14.1zm-295.8-43l-.3 15.7c-.8 44.9-31.8 75.1-77.1 75.1-22.1 0-41.1-7.1-54.8-20.6S436 441.2 435.6 419l-.3-15.7H229.5L309 210h399.2l81.7 193.3H589.4zm-375 76.8h157.3c24.3 57.1 76 90.8 140.4 90.8 33.7 0 65-9.4 90.3-27.2 22.2-15.6 39.5-37.4 50.7-63.6h156.5V814H214.4V480.1z"></path></svg>
            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">{@html uploadHtmlText}</p>
          </div>
          <input id="dropzone-file" type="file" class="cursor-pointer absolute top-0 left-0 w-full h-full opacity-0" bind:files={files} on:change={()=>{extractFile()}} />
        </label>
      </div>
    </div>

    <div class="Insert-text-paste | text-center ">
      <button class="Btn-outline border-slate-600 text-slate-600 | mx-auto inline-block" on:click={()=>{openTextInput=true}}>or Copy + Paste grant details</button> 
      <span class="text-evg-green-dark">
      </span>
      {#if openTextInput}
        <div class="mt-2">
          <textarea class="Grant-textarea w-full | Card-white border-slate-300 " 
            rows={8}
            placeholder="Paste your full grant details here" bind:value={grantText} 
            on:change={()=>{
              autofillMessage = `
              ✅ Extracting: ${fileUpload?.name || "text"}
              <br>
              <svg class="animate-spin h-5 w-5 text-white !text-neutral-400 " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processing grant details...`
              
              if(demoMode) {
                $grantStore = {
                  grant: {
                    md: grantText,
                    json: md2json(grantText)
                  }
                }
                $grantStore.grant.details = grantDetailsObj
                $grantStore.grant.html = grantHtml
                autofillMessage = `
                ✅ Extracting: ${fileUpload?.name || "text"}
                <br>
                ✅ Processing grant details...
                <br>🤵🏼‍♂️ <b>Grant details extracted!
                  `
                isAutofillLoading = false
              } else {
                extractGrantDetails({
                  extract:"metadata, body",
                  text: grantText
                })
              }
          }}></textarea>
        </div>
      {/if}
    </div> 

    {#if autofillMessage}
      <div class="Insert-text-message Card-outline --card-outline-evergreen p-1 pl-4 mt-2 mb-0">
        {@html autofillMessage}
      </div>
    {/if}



    {#if $grantStore?.grant?.details}
      <div class="GrantDetails | pt-2 pb-0">
        <details >
          <summary class="cursor-pointer">
            {@html marked(`Alright, here’s a rundown on your grant:`)}
          </summary>
          <div class="GrantReport " >
            {#if $grantStore?.grant?.html}
              {@html $grantStore?.grant?.html}
            {/if}
          </div>
          <div class="Card-white bg-white rounded-lg shadow-md mt-2 text-sm" >
            Data Preview:
            <JsonView json={$grantStore?.grant?.details} depth={-1} />
          </div>
        </details>
      </div>
    {/if}
<!-- 
    {#if $grantStore?.grant?.details}
      <div class="GrantDetails | pb-0">
        {@html marked(`Alright, here’s a rundown on your grant:`)}
        <div class="GrantReport " >
          {#if $grantStore?.grant?.html}
            {@html $grantStore?.grant?.html}
          {/if}
        </div>
        <div class="Card-white bg-white rounded-lg shadow-md mt-2 text-sm" >
          Data Preview:
          <JsonView json={$grantStore?.grant?.details} depth={-1} />
        </div>
      </div>
    {/if} -->

  </div>
</div>

























<style global lang="postcss" >
  ._form-input{
    background-color: white !important;
  }

  /* prevent fraunces in body text */
  .tiptap_serif {
    .element-wrapper {
      &, * {
        /* font-family: 'Merriweather', serif !important; */
        font-family: 'Georgia', 'serif' !important;
        color: #212;
      }
    }
  }

  .tiptap_body {
    .element-wrapper  {
      font-size: 1.13rem;
      color: #212;
    }
  }
  
  /* loading state for some form elements */
  ._loading ._waitForExtraction {
    opacity: 0.2;
  }
</style>