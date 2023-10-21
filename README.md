# Hi! My name is Hugh 🤵🏼‍♂️👋
and together, we will land your Dream Grant™️.

This is a 24-hour project built during the Sydney AI Agent hackathon. The goal is to build a "reverse prompt" system where the LLM guides the user to think about and write better grants.


## What’s Included

- Drag and drop a Word Doc or PDF  and it converts it to Markdown
- Recursively builds a simple json tree object of a semantic markdown doc
- Builds a data model as you upload data or chat with the LLM



## For the Future

### Product / Grant Writing Notes + Wishlist

Here's a bunch of things that didn't make it in the 24 hour buildathon:
- Feedback loop asking progressively harder questions, summarizing and extracting key points from user, then feeding that back to harder questions 
- CV to biotech outline to back and forth to fill out the missing pieces that makes it impressive
- ask AI and PDF questions; these questions generate longer-term summaries back into the data model
- Recursive section summaries
- lancedb vector
- Upload your own work, skills, personnel CV or websites
- Have it generate ideas for places where they cross
- budget and effort guidelines
- upload what successful grant applications look like, and feedback — this will guide the next section
- section by section draft + checklist
    - for each section, this is what you need
    - this is what's left to give me
    - document uploads too
    - recursive summarization for each section
- outline / variations of draft outputs
- biosketch writing support
    - upload CV and previous biosketches
    - outline a biosketch w/ details it needs
    - then can spit out biosketch variations
- multiplayer — everyone's working on parts of the same thing



### Design Notes
- Improve UI for going back/forth with the LLM under each section so it feels more organic
- Add multiplayer and a real database for storing / processing lots of data
- Add standard account functionality, or at least generate unique IDs so users can come back and share / invite others
- Inviting others to complete subsections, like upload CVs, fill out biosketches, grant 

### Technical Notes
- Recursively summarize each leaf of the markdown/json tree object for better content referencing
- Add a combination of Vector DB and something like elasticsearch to make searching easier

### Random Design Notes from the Hackathon
- Ask questions from user in the form of generated reusable form, instead of a back and forth convo;  
    - if lots of questions, generate a Supergrid form or Tiptap entry on the fly
- Task directory - which ones require oversight which ones can just go; risk score or high med low 
-  UX — Mind Map / Tree Structure exploration of an idea: GRANT WRITING
    - Tree Spread Graph
    - Block text entry
- What it Needs to Do
    - UI Input
        - Block level text input
        - Unlimited document uploading / dragging + parsing
        - Store long text paste like Claude // separate text input block; modular (Claude doesn't let you edit) — even modularly edit uploaded documents!
    - Step 1: Details + Structure
        - Parse the document
        - Extract key points / summarize crtiial elements: Submission Criteria, Due Dates, Funding Amounts [ask cGPT about more of these]
        - Implicit Requirements — infer unstated but potentially important criteria the grant committee might look for
        - Timeline + Checklist — generate a checklist, draft worksheet, with timelines for each part
    - Step 2: Your Team, Science
        - Prompts to elicit the user to type stuff; maybe this is just one big text entry?
            - Brainstorm section text entry
            - Collaborators
            - Upload key papers, abstracts, team members
        - Generate Questions
            - "Describe the core objective of your research.",
            - "List any previous works or papers you have published.",
            - "What is the innovative element in your current work?",
            - // Add more questions based on grant criteria
        - Goals; expand or contract goals of project
            - Research Goals
            - Funding goals
            - Map intent to a set of followup questions:
                - 'research_goal': ["Can you elaborate on your methodology?", "What is your target audience?"],
                - 'funding': ["How much funding do you need?", "What are your funding sources?"],
    - Step 3: Ideation and Validation
        - Recursive ideation, user-scoring of each idea "fine tuning" or rating good/bad
        - Selecting best ideas forward
    - Reach Goals: Brainstorming Simulators
        - THREE PERSONAS: Supportive, Challenging, Constructive
        - Innovation Brainstorming; boundaries / generate research questions or hypthothesis
        - Pilot study design
        - Interdisciplinary Collaborations
        - Narrative and Storytelling guide / back and forth crafting
        - Iterative Feedback
        - Peer Review / Grant Review simulation / Mock Review
        - Risk Assessment
        - Feasibility Assessment
        - Budget / Team Alignment / Resource Mapping
        - Socratic Questioning Engine / Assisted Rubber Ducking / Rubber Duck
- Data Model
    - Conversation: Basic directed tree JSON; 
        - which part of the convo are we adding to?
        - root of tree are LLM-directed questions; ID potential follow-up questions
        - LLM-reflection of whether questions are answered or not
    - User Facts
    - Grant Facts

- RUBBER DUCK AGENT???
    - Two-layer agent
        - think about the goal as meta task, and current ask, and previous convo — then ask probing questions to challenge a lab member's assumptions, methods, or conclusions — kind of like a devil's advocate
        - prompt it to come up with multiple angles; user can choose one ore more to explore in the UI
    - Stores and extracts data and context as you talk
    - Stores all messages
    - Can go down tangents — UI supports tangent exploration by extracting LLM answers as structured JSON data



## Dev Notes

The entire project is built on Sveltekit and a bunch of other modules, slapped together. There's a dependency on one of my own Git repos which might cause Vercel and other deployment issues. 

The project is setup to deploy on Vercel, but the LLM queries to OpenAI and Claude will probably fail since these are very long-running tasks. So clone this and run it locally!


### Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
