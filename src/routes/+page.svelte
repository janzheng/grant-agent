<script>
  import { marked } from "marked"
  import { Textarea } from "$lib/components/ui/textarea";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import * as Select from "$lib/components/ui/select";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";

	import { fade } from 'svelte/transition';
  import { grantStore } from "$lib/stores"
   
  import Intro from "$lib/components/Intro.svelte";
  import Insert from "$lib/components/Insert.svelte";
  import LabDetails from "$lib/components/LabDetails.svelte";

  import { grantData, userData } from '$lib/stores';


  // $: {
    console.log('[Page Datalog]', $grantData, $userData);
  // }

</script>


<div class="Content | my-8">
  
  <Intro />
  <Insert />

  {#if $grantStore.grant?.details}
    <div class="" transition:fade={{ delay: 250, duration: 300 }} >
      <LabDetails />
    </div>
  {/if}
  

  <!-- <div class="mb-4">
    <Textarea placeholder="Type your message here." />
  </div> -->
<!--   
  <div class="mb-4">
    <Card.Root class="w-[350px]">
      <Card.Header>
        <Card.Title>Create project</Card.Title>
        <Card.Description>Deploy your new project in one-click.</Card.Description>
      </Card.Header>
      <Card.Content>
        <form>
          <div class="grid w-full items-center gap-4">
            <div class="flex flex-col space-y-1.5">
              <Label for="name">Name</Label>
              <Input id="name" placeholder="Name of your project" />
            </div>
            <div class="flex flex-col space-y-1.5">
              <Label for="framework">Framework</Label>
              <Select.Root>
                <Select.Trigger id="framework">
                  <Select.Value placeholder="Select" />
                </Select.Trigger>
                <Select.Content>
                  {#each frameworks as framework}
                    <Select.Item value={framework.value} label={framework.label}
                      >{framework.label}</Select.Item
                    >
                  {/each}
                </Select.Content>
              </Select.Root>
            </div>
          </div>
        </form>
      </Card.Content>
      <Card.Footer class="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </Card.Footer>
    </Card.Root>
  </div> -->
</div>
