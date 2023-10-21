import { persisted } from 'svelte-persisted-store'

// First param `preferences` is the local storage key.
// Second param is the initial value.
export const grantStore = persisted("grantStore", {});
export const userStore = persisted("userStore", {
  userData: {},
  conversations: [
    {
      q: "Tell me about your group and your work!",
      desc: "Please give me some context ",
      messages: [],
      data: {},
      examples: [
        { name: "lab biobank", query: "my lab works with phage and bacteria, and builds a physical 'biobank' of phages and bacteria." },
        { name: "working on...", query: "we work with all kinds of phages, but usually ESKAPE pathogens and phages. We have ~500 phages and are doing genomics and mapping their effectiveness against the bacterial hosts." },
      ]
    },
  ]
});





// sample
export const grantData = persisted('grantData', {
  banana: true
})
export const userData = persisted('userData', {
  banana: true
})