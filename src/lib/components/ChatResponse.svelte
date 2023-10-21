<script>
  // import Tiptap from '$lib/components/tiptap/Tiptap.svelte'

	export let message;
  export let type = "assistant";

  export let data;
  // export let formHtml="";

  let settings = {
    placeholder: "Type something"
  };
  let tiptapHtml;
</script>



<div class="Chat {type === 'user' ? 'chat-end' : 'chat-start'} justify-end">
  <div class="chat-header flex flex-row gap-2 items-center">
    <div class="chat-image avatar">
      <div class="w-10 rounded-sm p-2 | bg-slate-200 text-center">
        <!-- <img
          src="https://ui-avatars.com/api/?name={type === 'user' ? 'Me' : 'H'}"
          alt="{type} avatar"
        /> -->
        {#if type == 'user'}
          ME
        {:else}
          🤵🏼‍♂️
        {/if}
      </div>
    </div>
    <div class="chat-header">
      <!-- {type === 'user' ? 'Me' : 'Bot'} -->
      {#if message}
        <span class="chat-bubble max-w-xl inline-block p-2 rounded-md bg-blue-100
          {type === 'user' ? 'chat-bubble-primary' : 'chat-bubble-secondary'}
          ">
          {message}
        </span>
      {/if}

      
    </div>
  </div>
  
  
<!-- 
  {#if data?.htmlContent}
    <div class="Tiptap-Interaction | Card-light p-2 mt-2 mr-4">
      <Tiptap 
        elementClasses={"bg-white p-2"}
        content={data?.htmlContent}
        placeholder={settings.placeholder}
        bind:html={tiptapHtml}
      ></Tiptap>
    </div>
  {/if} -->

</div>




<style lang="postcss">

  .chat-bubble-primary {

  }

  .chat-end {
    @apply self-end;
    .chat-header {
      @apply flex-row-reverse;
    }
  }
</style>