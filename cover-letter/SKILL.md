---
name: cover-letter
description: Write Federico's cover letter PDF for a job offer in his own plain, direct style. Use when he pastes a job offer (LinkedIn text or URL) and asks for a cover letter, "carta", or a PDF to apply.
---

# Cover letter for Federico

Input: a pasted job offer (often a LinkedIn page dump, sometimes with the company URL). Output: `cover-letters/letters/<Company>.txt` and a one-page PDF at `cover-letters/out/<Company>.pdf`, sent to him with SendUserFile.

## Steps

1. Read the offer. Note role, city, remote/hybrid, required languages, must-have and nice-to-have tech, regulated sector, and whether the offer says a cover letter is optional.
2. Read current facts from `cv-src/data.mjs` (English block). Never invent facts. Reference style: `cover-letters/letters/PSI.txt`; reference result: `example-aity.txt` in this skill folder.
3. Write `cover-letters/letters/<Company>.txt` (use `<Company>-<City>` if the company already has a letter).
4. Build: `node cover-letters/build.mjs cover-letters/letters/<Company>.txt` (needs Google Chrome). Check `pdfinfo` says 1 page.
5. Send the PDF with SendUserFile (display: render), then report briefly in Spanish (he writes to me in Spanish, the letter is in English unless the offer demands another language).
6. Do not commit unless he asks. Letters and `out/` are untracked on purpose.

## His writing style (this is the most important part)

He writes plain, direct, CV-structured letters, not conversational ones. Past attempts that failed with him: "I read your posting twice", "What attracts me most is the chance to...", "it taught me that good governance pays for itself", any storytelling or cleverness. He said those read as AI.

Structure, 5 paragraphs, no bullets:
1. "I am writing to apply for the <role> position in <city>. I currently work as a Cloud Operations & AI Engineer at Hirint.io, where my role is strongly focused on <the offer's own themes>." Then years of experience (more than five years in IT) and certifications: AZ-104, AZ-900, AWS Solutions Architect Associate, Advanced Program in Cloud Architectures at UNIR (April 2026).
2. What he does day to day at Hirint matched to the offer (around 320 Azure resources, networking, private endpoints, Front Door WAF, Key Vault, OIDC, Azure Monitor, Log Analytics, Defender) plus FinOps result.
3. Automation / IaC / development: CI/CD with Azure DevOps and GitHub Actions, Terraform in personal projects (StockCloud, cloud resume site), the 12 internal apps, Sales Studio. He likes developing and polishing tools.
4. Security / identity / working style: Cadarso (Entra ID, Conditional Access, MFA, Intune, 1Password rollout), strong problem solver, believes in thorough documentation.
5. Where he lives and relocation, languages, and a closing line about contributing to that company's specific thing. Then "Kind regards," + "Federico Oliver Mencuccini".

Rules: first person, plain sentences, patterns he uses ("I have strong experience in...", "I am a strong problem solver", "I strongly believe in thorough documentation", "I would be excited to contribute my ... to <Company>'s ..."). Match the offer's keywords. No em dashes, no emojis, no buzzword stacking, no rhetorical flourishes. One A4 page. Greeting is "Dear Hiring Team at <Company>,".

## Facts he has stated in chat (use unless he says otherwise)

- Lives in Barcelona, is moving to Switzerland, can move without any problem. For Swiss offers say this in the last paragraph. For offers elsewhere adapt or ask.
- FinOps: saved 1,800 euros in Azure costs (cost reporting, budgets, anomaly alerts). Note: `cv-src/data.mjs` still says "€1,000+"; flag the mismatch to him if it is still there.
- Built 12 internal apps (FinOps, monitoring, compliance, security) and Sales Studio (calls, emails, meetings, proposals in one place, with KPIs).
- Languages: English and Italian native, Spanish and Catalan fluent. Write the level the same way as the existing letters.
- Mencuccini Studio exists as a side business; only mention it if the offer is consulting or client-facing.

## Honesty and when to ask

State gaps honestly in one short sentence instead of hiding them (example: "I have not worked in a FINMA-regulated environment yet, but I automate ISO 27001 compliance checks"). Never claim German, Terragrunt, Kubernetes, or any tool/sector that is not in `cv-src/data.mjs`.

Ask him (AskUserQuestion, short) only when it changes the letter: the offer needs a language he does not speak (German is the usual one, say it plainly and ask whether to apply anyway), the role is far from cloud/sysadmin, the location is outside Switzerland/Spain and relocation is unclear, or a number or fact he gave conflicts with the CV. Otherwise just write it.

After sending the PDF, always tell him: what gaps the offer exposes (German, regulated sector), and anything in the letter not backed by the CV.
