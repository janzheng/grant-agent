
/* 

  Extracts content from a grant

*/

export const config = {
  runtime: 'edge',
};


import { prompt } from '$lib/utils/claude'
import { hjson } from '$plasmid/utils/sveltekit-helpers'
import { json, error } from '@sveltejs/kit';
import { fQuery } from '$plasmid/modules/llm/fQuery.js'


export async function POST({ request, url }) {
  let obj
  try {
    const {
      input, config, cmd, model="gpt-4"
    } = await request.json()
    let result

    if (cmd == 'prompt') {
      result = await fQuery().prompt(input, { ...config, model })
    }

    if (cmd == 'json') {
      result = await fQuery().json(input, { ...config })
    }

    return json({ result })
  } catch (err) {
    // _err(err)
    console.error('[api/cmd/POST]', err.message || err?.response?.data, obj)
    throw error(500, err.message)
  }
}


