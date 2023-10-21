
<script>
  import Convo from "$lib/components/Convo.svelte";

  import { JsonView } from '@zerodevx/svelte-json-view'
  import { getQuestions } from '$lib/utils/convoQuery'
  import { grantStore, userStore } from "$lib/stores"
  import { short, long, grantDetailsObj, grantHtml } from "$lib/sample"

  let loadingMore=false
  async function loadMoreQuestions() {
    loadingMore = true
    let res = await getQuestions(JSON.stringify({
      grant: $grantStore.grant.details, $userStore
    }))
    console.log('questions:::', res)
    if(res && Array.isArray(res)) {
      $userStore.conversations = [...$userStore.conversations, ...res] 
    }
    loadingMore = false
  }

  $: if($userStore.conversations.length < 4) {
    loadMoreQuestions()
  }

  console.log('LabDetails:', $userStore)
</script>




<div class="Converse | mt-8">
  <div class="Commandbar | mb-8">
    <h2 class="mb-2">Let’s get down to business...</h2>
    <button class="Btn-outline" on:click={()=>{loadMoreQuestions()}}>
      🤵🏼‍♂️🎲 Ask More Hard Questions!
    </button>
  </div>

  {#if loadingMore}
    <h2 class="mb-2"><svg class="inline mb-1 animate-spin h-5 w-5 text-white !text-neutral-400 " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Coming up with some hard questions...</h2>
  {:else}
    {#each $userStore.conversations as convo}
      <Convo {convo} />
    {/each}

  {/if}
</div>




{#if $userStore}
  <div class="UserDetails | mt-8">
    <h2>Here‘s what you’ve told me so far:</h2>
    <JsonView json={$userStore} depth={1} />
  </div>
{/if}













<style global lang="postcss" >
  p {
    /* padding-bottom: 20px; */
    /* @apply py-2; */
  }

</style>