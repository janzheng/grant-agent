
<script>
  import { marked } from "marked"
  import { JsonView } from '@zerodevx/svelte-json-view'
  import { prompt, chat } from '$lib/utils/convoQuery'
  import { grantStore, userStore } from "$lib/stores"

  import ChatResponse from "$lib/components/ChatResponse.svelte";
  export let convo, loading;
  export let query = ""
  let scrollToDiv;


  console.log('---> convo:', convo, $userStore)

  if(!convo.messages)
    convo.messages = []



	function scrollToBottom() {
		setTimeout(function () {
			scrollToDiv.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
		}, 100)
	}

	const handleSubmit = async () => {
		loading = true
		convo.messages = [...convo.messages, { role: 'user', content: query }]

    let answer = await chat(convo.messages, 
      {
        system: `
        You're a grant reviewing mentor. Given [[this grant: ${JSON.stringify($grantStore.grant.details)}]], you are to drill the user into this question: [[${convo.q}]]. Be short and to the point. Don't explain yourself, but ask probing questions like a psychologist, to help the user explore the question and their answers further, especially towards: [[1. getting deeper on the problem of the grant; what problems are the users solving? 2. identify the gap that hasn't been done before; ask the user what's been done before, and get them to show that they understand the underlying problem and context, and to ID what no one's doing and why, while NARROWING DOWN the focus; help them outline their efforts towards the grant; 3. User's approaches/ieas to fill the gap. What are they doing, and why? Help them outline milestone, costs, scope, is it realistic, team, and help identify partners/collaborators they might be missing; why are they the ones to do it? What facilities or equipment do they have?]]; 4. Is the efforts the right size for the grant budget? Help the user get to sustainability, and help them correctly scope the project based on milestones.
        Make sure your line of questioning adheres to the topic: [[${convo.q}]] (other questions will address other topics)
        `,
        // model: "gpt-3.5-turbo",
        // model: "gpt-3.5-turbo-16k",
        model: "gpt-4",
        temperature: 0,
        skipSystemMessage: true,
      })
    convo.messages = [...convo.messages, { 
      role: 'assistant', 
      content: answer?.message||"", // text that's displayed and sent to OpenAI
      data: answer?.data||null 
    }]
    convo['data'] = {...convo['data'], ...answer?.data}

    $userStore.userData = {...$userStore.userdata, ...convo['data']}
		
    console.log('Fetch Response:', answer, $userStore)


    scrollToBottom()
		loading = false
	};

</script>








<div class="Convo-box| Card-white border-slate-200 px-4 py-2 mt-2 ">
  <details>
    <summary class="Convo-title cursor-pointer">
      {@html marked(`${convo.q}`)}<br>
    </summary>
    <div class="Convo-body | pl-4">
      <div class="">{convo.desc}</div>
      <div class="h-[30vh] w-full rounded-md overflow-y-auto flex flex-col gap-4 | bg-slate-100/50 mb-2 p-2">
        <div class="flex flex-col gap-2">
          <ChatResponse type="assistant" message={`${convo.q}`} />
          {#each convo.messages as message}
            <ChatResponse type={message.role} message={message.content} data={message.data} />
          {/each}
          <!-- {#if answer}
            <ChatResponse type="assistant" message={answer} />
          {/if} -->
          {#if loading}
            <ChatResponse type="assistant" status="loading" message="Loading..." />
          {/if}
        </div>
        <div class="" bind:this={scrollToDiv} />
      </div>
      <div class="Convo-messages">
        <!-- examples -->
        {#if convo.examples}
          <div class="Examples">
            {#each convo.examples as example}
              <button class="Btn-outline --thin mb-1 p-2 text-sm py-1 mr-2" on:click={()=>{query=example.query}}
              >{example.name}</button>
            {/each}
          </div>
        {/if}


        <form
          class="flex w-full rounded-md gap-4 "
          on:submit|preventDefault={() => handleSubmit()}
        >
          <input type="text" class="input input-bordered w-full mt-0 px-2" bind:value={query} />
          <button type="submit" class="btn btn-accent"> Send </button>
        </form>
      </div>
      {#if convo.data && Object.keys(convo.data).length > 0}
        <div class="Convo-data">
          <JsonView json={convo.data} depth={6} />
        </div>
      {/if}
    </div>
  </details>
</div>



<style lang="scss" global>

</style>