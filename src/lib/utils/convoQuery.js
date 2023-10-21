




export const prompt = async(text) => {

  try {
    if (!text)
      return null

    const url = `/api/cmd`

    const res = await fetch(
      url, {
      method: 'POST',
      body: JSON.stringify({
        input: text, 
        cmd: 'prompt'
      })
    })


    let json = await res.json();
    return {
      message: json.result,
    };
  } catch (e) {
    console.log('[query/prompt] error:', e)
  }
}



export const chat = async (messages, config) => {

  try {
    if (!messages)
      return null

    const url = `/api/cmd`
    let res, json, returnObj = {}

    // have the conversation
    res = await fetch(
      url, {
      method: 'POST',
      body: JSON.stringify({
        input: messages.map(m => ({ role: m.role, content: m.content })),
        config,
        cmd: 'prompt'
      })
    })
    json = await res.json();
    returnObj['message'] = json.result

    // extract some details
    res = await fetch(
      url, {
      method: 'POST',
      body: JSON.stringify({
        input: JSON.stringify(messages[messages.length-1].content),
        config: {
          system: "You're a data analyst and grant reviewer mentor. Given this user message, please extract any details [names, ideas, strategies, keywords, quotes] into a JSON output",
          model: "gpt-4",
          addons: ['json']
        },
        cmd: 'json'
      })
    })
    json = await res.json();
    returnObj['data'] = json.result

    return returnObj
  } catch (e) {
    console.log('[query/prompt] error:', e)
  }
}





export const getQuestions = async (input, config) => {

  try {
    if (!input)
      return null

    console.log('getQuestions', input)

    const url = `/api/cmd`
    let res, json, returnObj = {}

    // extract some details
    res = await fetch(
      url, {
      method: 'POST',
      body: JSON.stringify({
        input,
        config: {
          system: `You're a data analyst and grant reviewer mentor. Given the grant details and existing user information/conversations and approach to the grant, please generate a few more questions that helps the user think wider or deeper into their work and how they can approach the grant. Think about when helping someone out with their grant, what are some key questions to guide them down the path? E.g.: 1) wat problems are you addressing, 2) what's gap / hasn't been done before / show you understand the problem 3) what are your approaches to fill the gap, how are you doing it (within constraints of the grant) 4) why are you best suited 
          - Ask hard questions
          - Don't ask questions that already have been answered
          - Please only return JSON output
          - Please use this format in your responses:
          [
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
  `,
          model: "gpt-4",
          addons: ['json']
        },
        cmd: 'json'
      })
    })
    json = await res.json();
    returnObj = json.result?.questions || json.result

    return returnObj
  } catch (e) {
    console.log('[query/prompt] error:', e)
  }
}
