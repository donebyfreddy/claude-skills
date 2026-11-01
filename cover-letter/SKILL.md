---
name: cover-letter
description: Write Federico's cover letter PDF for a job offer in his own plain, direct style. Use when he pastes a job offer (LinkedIn text or URL) and asks for a cover letter, "carta", or a PDF to apply.
---

# Cover letter for Federico

Input: a pasted job offer (often a LinkedIn page dump, sometimes with the company URL). Output: `cover-letters/letters/<Company>.txt` and a one-page PDF at `cover-letters/out/<Company> - Cover Letter.pdf` (the file name is always the company name, then " - Cover Letter"; build.mjs already names it that way, never rename or add a different name), sent to him with SendUserFile.

## Steps

1. Read the offer. Note role, city, remote/hybrid, required languages, must-have and nice-to-have tech, regulated sector, and whether the offer says a cover letter is optional.
2. Analyse ALL his sources before writing, then match them to the offer's requirements one by one. Never invent facts. For every must-have in the offer, find what he really has and name it in the letter. Sources:
   - `cv-src/data.mjs` (English block), the current CV facts.
   - His website https://fomencuccini.com/ (WebFetch, or `index.html` in the repo).
   - His LinkedIn https://www.linkedin.com/in/fomencuccini/ : open it with the Claude in Chrome extension (load the `mcp__claude-in-chrome__*` tools with ToolSearch, open a new tab, `get_page_text`, close the tab afterwards). If LinkedIn does not load or asks for a login, STOP and tell him so he can fix it, then continue. Saved copies are in `linkedin/*.txt` and `linkedin/linkedin-copy.md` as a fallback.
   Reference style: `cover-letters/letters/PSI.txt`; reference result: `example-aity.txt` in this skill folder.
3. Write `cover-letters/letters/<Company>.txt` (use `<Company>-<City>` if the company already has a letter).
4. Build: `node cover-letters/build.mjs cover-letters/letters/<Company>.txt` (needs Google Chrome). Check `pdfinfo` says 1 page.
5. Send the PDF with SendUserFile (display: render), then report briefly in Spanish (he writes to me in Spanish, the letter is in English unless the offer demands another language).
6. Do not commit unless he asks. Letters and `out/` are untracked on purpose.

## His writing style (this is the most important part)

He writes plain, direct, CV-structured letters, not conversational ones. Past attempts that failed with him: "I read your posting twice", "What attracts me most is the chance to...", "it taught me that good governance pays for itself", any storytelling or cleverness. He said those read as AI.

Structure, 5 paragraphs, no bullets:
1. "I am writing to apply for the <role> position in <city>. I currently work as a Cloud Operations & AI Engineer at Hirint.io, where my role is strongly focused on <the offer's own themes>." Then years of experience (more than five years in IT) and certifications: AZ-104, AZ-900, AWS Solutions Architect Associate, Advanced Program in Cloud Architectures at UNIR (April 2026).
2. What he does day to day at Hirint matched to the offer (Azure networking, private endpoints, Front Door WAF, Key Vault, OIDC, Azure Monitor, Log Analytics, Defender) plus FinOps result.
3. Automation / IaC / development: CI/CD with Azure DevOps and GitHub Actions, Terraform in personal projects (StockCloud, cloud resume site), the 12 internal apps, Sales Studio. He likes developing and polishing tools.
4. Security / identity / working style: Cadarso (Entra ID, Conditional Access, MFA, Intune, 1Password rollout), strong problem solver, believes in thorough documentation.
5. Where he lives and relocation, languages, motivation (see below), and a closing line about contributing to that company's specific thing. Then "Kind regards," + "Federico Oliver Mencuccini".

Motivation line (mandatory in every letter, he asked for it explicitly): one plain sentence in paragraph 4 or 5 saying he is very motivated and eager to learn, and that he thinks outside the box. Example: "I am very motivated to take the next step in my career as a cloud engineer, I learn quickly, I am always eager to work with new technologies, and I like to think outside the box to find better solutions." Keep it in his plain style, one sentence, no flourishes, and keep the letter on one page.

Rules: never use jargon he does not use himself (for example "runbooks", "operational excellence", "hands-on", "ownership"); copy the offer's nouns only when they are plain and say "documentation" for docs. He flags these as AI style. Never mention the number of Azure resources ("320 resources", "around 320") in a letter; it stays on the CV only. First person, plain sentences, patterns he uses ("I have strong experience in...", "I am a strong problem solver", "I strongly believe in thorough documentation", "I would be excited to contribute my ... to <Company>'s ..."). Match the offer's keywords. No em dashes, no emojis, no buzzword stacking, no rhetorical flourishes. One A4 page. Greeting is "Dear Hiring Team at <Company>,".

## Facts he has stated in chat (use unless he says otherwise)

- Tools he HAS, name them whenever the offer asks for them: Terraform; Docker; CI/CD with Azure DevOps (Azure Repos and Pipelines) and GitHub Actions; Azure Container Registry; Linux, including Ubuntu and Debian; Bash and Python scripting.
- Achievements to include: he has built many integrations (Clientify, Aircall, Chatwoot, Slack, SendGrid, Notion, Google Drive, Event Grid) besides the 12 internal apps and Sales Studio. Mention them when the offer values automation, APIs or integration.
- Extra facts from his website and LinkedIn (use when relevant): 16 web apps across 11 deployment slots and 21 private endpoints with Front Door and WAF at Hirint; compliance evidence automation for ISO 27001/42001, ENS, NIS2 and GDPR; n8n with AI for log analysis; monthly clean-up of orphaned resources as a FinOps habit; Python and n8n automation; three recommendation letters (Cadarso, Amundi, COFB); client websites DV Love and Volquetes Bombita; ModernSMTP (PHP and Graph API) sold on Payhip. Never mention the number of Azure resources (the old "320").
- ALWAYS include the FinOps result with the number: he saved 1,800 euros in Azure costs (cost reporting, budgets, anomaly alerts).

- Lives in Barcelona, is moving to Switzerland, can move without any problem. For Swiss offers say this in the last paragraph. For offers elsewhere adapt or ask.
- FinOps: saved 1,800 euros in Azure costs (cost reporting, budgets, anomaly alerts). Note: `cv-src/data.mjs` still says "€1,000+"; flag the mismatch to him if it is still there.
- Built 12 internal apps (FinOps, monitoring, compliance, security) and Sales Studio (calls, emails, meetings, proposals in one place, with KPIs).
- Languages: English and Italian native, Spanish and Catalan fluent. Write the level the same way as the existing letters.
- Mencuccini Studio exists as a side business; only mention it if the offer is consulting or client-facing.

## Honesty and when to ask

Never claim anything he has not done (German, Terragrunt, Kubernetes, or any tool/sector not in `cv-src/data.mjs`). But also never write sentences about what he has NOT done: no "I have not worked with X", no "I would be glad to learn X". He explicitly banned this. Simply leave the missing tools out and stress what he does have, plus his attitude (below). The gaps are reported to him in chat after the PDF, never in the letter.

## Level of detail (he asked for this explicitly)

It is a motivation letter, not a technical report. Describe WHAT he achieved and WHY it matters, in broad confident strokes, so the reader thinks "this person has done things"; the details come in the interview. Do not list product or tool names for integrations (no "Clientify, Aircall, Chatwoot..."): say "connected our sales, support, communication and storage tools into one platform". Do not give counts like "46 alert rules": say what it does ("centralised all the logs in one place and built automatic alerting, so something is always watching and we are notified of incidents, anomalies and new costs"). Keep named tools only for what the offer itself asks for (Terraform, Docker, CI/CD, Linux, Bash, Python, Azure services). Be confident, never invent facts.

## Who he is (put this across in every letter)

He is a motivated, responsible person who wants to work, learns fast, is eager to grow and is reliable and proactive. Show it with plain statements, for example: "I am a responsible and motivated person, I take ownership of my work, I learn quickly and I am always eager to work with new technologies." When the offer has a requirement he cannot meet (for example German), do not mention it; lean on this attitude instead.

Ask him (AskUserQuestion, short) only when it changes the letter: the offer needs a language he does not speak (German is the usual one, say it plainly and ask whether to apply anyway), the role is far from cloud/sysadmin, the location is outside Switzerland/Spain and relocation is unclear, or a number or fact he gave conflicts with the CV. Otherwise just write it.

After sending the PDF, always tell him: what gaps the offer exposes (German, regulated sector), and anything in the letter not backed by the CV.
