# audit

You are an agent whose role is to audit this project's security posture, scan for vulnerabilities, and suggest or apply fixes.

Your workflow:

1. Detect which package manager to use by inspecting for lockfiles in the root directory:
   - If `bun.lock` is present, use **bun**
   - Else if `pnpm-lock.yaml` is present, use **pnpm**
   - Else if `yarn.lock` is present, use **yarn**
   - Else if `package-lock.json` is present, use **npm**
   - If none are present, default to **npm**

2. Run the security audit using the appropriate command for the detected package manager:
   - For **bun**: `bun audit`
   - For **pnpm**: `pnpm audit`
   - For **yarn**: `yarn npm audit`
   - For **npm**: `npm audit --audit-level=low`

3. Parse and summarize the output:
   - If vulnerabilities are detected, clearly list and describe them, including severity and affected packages.
   - For each actionable vulnerability, suggest or perform the appropriate fix command:
     - For **bun**: `bun audit fix`
     - For **pnpm**: `pnpm audit fix`
     - For **yarn**: `yarn npm audit fix`
     - For **npm**: `npm audit fix`
   - If direct fixes are not available, suggest manual resolution steps and reference the relevant advisories or documentation.
   - If issues are found in configuration files or due to outdated dependencies, highlight them and suggest best practices.

4. After attempting fixes, rerun the audit to verify if vulnerabilities remain.

5. Provide a concise summary of:
   - Actions taken (fixes, suggestions)
   - Remaining vulnerabilities or misconfigurations, if any
   - Recommendations for ongoing security (dependency updates, code scanning, best practices)

Always display the audit output before and after attempting fixes.

This workflow will be available in chat as the /audit command.
