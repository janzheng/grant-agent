
/* 

  Extracts content from a grant

*/

import { prompt } from '$lib/utils/claude'
import { hjson } from '$plasmid/utils/sveltekit-helpers'
import { json, error } from '@sveltejs/kit';
import { fQuery } from '$plasmid/modules/llm/fQuery.js'


// https://chat.openai.com/c/67dec763-8be5-4df8-8ec4-611a86c3ee89
let grantPrompt = `
Please help me extract all important details based on the following factors:

| Factor | Description/Things to Consider |

|:-----------------------------|:--------------------------------------------------------------------------------------------------|

| Grant Details | - Title of the grant<br>- Granting organization<br>- Purpose of the grant<br>- Specific focus areas or themes |

| Timelines/Deadlines | - Application submission deadline<br>- Project start and end dates<br>- Reporting deadlines |

| Funding Amount | - Total grant amount available<br>- Maximum and minimum amounts per applicant<br>- Payment schedule (lump sum, installments) |

| Eligibility Criteria | - Type of organizations eligible (e.g., nonprofits, for-profits, individuals)<br>- Geographic restrictions<br>- Specific fields or sectors |

| Assessment Criteria | - How the application will be evaluated<br>- Weightage for different sections<br>- Priority areas or themes |

| Application Process | - Required documents (e.g., proposal, budget, references)<br>- Submission method (online, mail)<br>- Interview or presentation requirements |

| Project Requirements | - Expected outcomes or deliverables<br>- Reporting requirements and frequency<br>- Monitoring and evaluation methods |

| Budgetary Considerations | - Eligible expenses (e.g., salaries, equipment)<br>- Restrictions on budget allocations<br>- Matching funds requirements |

| Grant Terms & Conditions | - Duration of the grant agreement<br>- Renewal possibilities<br>- Clauses on termination or changes |

| Support & Resources | - Training or workshops offered<br>- Access to networks or mentors<br>- Other resources (e.g., templates, guides) |

| Past Recipients | - Previous grant winners<br>- Types of projects funded<br>- Success stories or case studies |

| Feedback Mechanism | - Opportunities to receive feedback on the application<br>- Mechanisms for feedback during the project duration |

| Potential Pitfalls | - Common reasons for rejection<br>- Areas where applicants typically struggle |

Please respond using the example, in JSON. Do not explain yourself.
Only respond in JSON. Do not respond in Markdown. Do not wrap in backticks.
Do not introduce the JSON. Start your response with "{" and end with "}"
`
// let grantPrompt = `
// Please help me extract all important details based on the following factors. Here is an example:
// """
// {
//   "Grant Details": {
//     "Title": "The name of the grant opportunity.",
//     "Granting Organization": "The organization or entity providing the funding.",
//     "Purpose": "The main goal or objective of the grant.",
//     "Specific Focus Areas or Themes": "Areas of particular interest or themes that the grant aims to address."
//   },
//   "Timelines/Deadlines": {
//     "Application Submission Deadline": "The final date by which the grant application must be submitted.",
//     "Project Start and End Dates": "The duration of the project from start to finish.",
//     "Reporting Deadlines": "Dates by which progress or final reports must be submitted."
//   },
//   "Funding Amount": {
//     "Total Grant Amount Available": "The overall amount of funding available for the grant.",
//     "Maximum Amount per Applicant": "The maximum amount of funding an individual applicant can receive.",
//     "Minimum Amount per Applicant": "The minimum amount of funding an individual applicant can receive.",
//     "Payment Schedule": "How the grant funds will be distributed over time."
//   },
//   "Eligibility Criteria": {
//     "Type of Organizations Eligible": "The kinds of organizations that are eligible to apply for the grant.",
//     "Geographic Restrictions": "Any location-based restrictions for applicants.",
//     "Specific Fields or Sectors": "Particular fields or sectors that the grant is targeted toward."
//   },
//   "Assessment Criteria": {
//     "How the Application Will Be Evaluated": "The criteria or factors used to assess and evaluate the grant application.",
//     "Weightage for Different Sections": "The importance or weight given to each section of the application.",
//     "Priority Areas or Themes": "Areas or themes that are given priority during the assessment process."
//   },
//   "Application Process": {
//     "Required Documents": "Documents that must be submitted as part of the grant application.",
//     "Submission Method": "The method by which the application must be submitted.",
//     "Interview or Presentation Requirements": "Any requirement for an interview or presentation as part of the application process."
//   },
//   "Project Requirements": {
//     "Expected Outcomes or Deliverables": "The results or products that should be produced by the project.",
//     "Reporting Requirements and Frequency": "The reports that must be submitted and how often they should be submitted.",
//     "Monitoring and Evaluation Methods": "The methods used to monitor and evaluate the project."
//   },
//   "Budgetary Considerations": {
//     "Eligible Expenses": "Expenses that can be covered using the grant funds.",
//     "Restrictions on Budget Allocations": "Any restrictions on how the budget can be allocated.",
//     "Matching Funds Requirements": "Any requirements for matching funds from other sources."
//   },
//   "Grant Terms & Conditions": {
//     "Duration of the Grant Agreement": "The length of time the grant agreement is in effect.",
//     "Renewal Possibilities": "Options for renewing the grant agreement.",
//     "Clauses on Termination or Changes": "Conditions under which the grant agreement can be terminated or altered."
//   },
//   "Support & Resources": {
//     "Training or Workshops Offered": "Any training or workshops provided as part of the grant.",
//     "Access to Networks or Mentors": "Access to networks or mentors that is provided.",
//     "Other Resources Available": "Any other resources, like guides or templates, that are provided."
//   },
//   "Past Recipients": {
//     "Previous Grant Winners": "Individuals or organizations that have won the grant in the past.",
//   },
//   "Feedback Mechanism": {
//     "Opportunities to Receive Feedback on the Application": "Options for receiving feedback on the grant application.",
//     "Mechanisms for Feedback During the Project Duration": "Ways to receive feedback during the project."
//   },
//   "Potential Pitfalls": {
//     "Common Reasons for Rejection": "Frequent reasons why grant applications are not successful.",
//   }
// }

// """

// Please respond using the example, in JSON. Do not explain yourself.
// Only respond in JSON. Do not respond in Markdown. Do not wrap in backticks.
// Do not introduce the JSON. Start your response with "{" and end with "}"
// `











export async function POST({ request, url }) {
  let obj
  try {
    const {
      text,
      // extract=['metadata', 'summary', 'body'],
      temperature, top_p, frequency_penalty, presence_penalty, max_tokens
    } = await request.json()

    // let grant = {
    //   data: {
    //     "type": "application/json",
    //     result: {}
    //   }
    // }

    console.log('[grant] extracting text:', text.length)

    let result = await prompt(`${grantPrompt} ###\n${text}\n###`, {
      model: "claude-2"
    })

    let jsonObject
    var pattern = /(\{[\s\S]*\})|(\[[\s\S]*\])/;
    var match = result.match(pattern);

    console.log('RAW JSON OBJECT:::', result)


    if (match) {
      try {
        jsonObject = JSON.parse(match[0]);
        console.log(jsonObject);
      } catch (e) {
        console.log("Error parsing JSON: ", e);
      }
    }

    // get html of the details

    let htmlPrompt = `Given this data, please give me a airy TailwindCSS report; if using tables please restrict the number of columns but use rows freely, using text-sm and plenty of padding; avoid using grays, wrapped in a <div></div>; prefer using table-auto, thin 1px lines, light drop shadows; make it look like Cloudflare, Vercel, or Linear
Create a report of ALL of the data found here: """${JSON.stringify(jsonObject)}""". Add each item from the data on its own row. Please don't output <head> or <title> or other parts of html.
    `

    let html = await fQuery().prompt(htmlPrompt, {model: "gpt-4"})
    console.log('RAW HTML OUTPUT:::', html)

    pattern = /<div[\s\S]*<\/div>/;
    match = html.match(pattern);

    if (match) {
      html = match[0]
    } else {
      console.log("No matching HTML block found.");
    }





    console.log("jsonObject ---***", jsonObject, " html $$$$$:", html, "PROOOOOOOMPT::::::::::::",htmlPrompt);
    return json({ text: result, obj: jsonObject, html })
    // return hjson(grant)
  } catch (err) {
    // _err(err)
    console.error('[api/grant/POST]', err.message || err?.response?.data, obj)
    throw error(500, err.message)
  }
}


