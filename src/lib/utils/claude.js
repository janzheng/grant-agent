
import Anthropic, { HUMAN_PROMPT, AI_PROMPT } from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '$env/static/private';

// import { json, error } from '@sveltejs/kit';

/* 
  models: claude-instant-1, claude-2
*/

export const prompt = async (prompt, { 
  max_tokens_to_sample = 100000, 
  model = "claude-instant-1",
  temperature = 0.7,
}={}) => {
  const client = new Anthropic({
    apiKey: ANTHROPIC_API_KEY,
  });
  const params = {
    prompt: `${HUMAN_PROMPT} ${prompt} ${AI_PROMPT}`,
    max_tokens_to_sample: max_tokens_to_sample,
    temperature,
    model: model, // faster, less good
    // model: "claude-2", // slower, more good
  };

  let res = await client.completions.create(params);
  // console.log("====>>>", res)
  return res.completion
}
