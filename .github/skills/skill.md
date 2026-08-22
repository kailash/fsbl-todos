---
name: trivy-static-scan
description: >
  Run a Trivy static (filesystem) vulnerability scan on Java (Maven/Gradle)
  and React/Node (npm/yarn/pnpm) codebases, triage the findings, and fix them
  by upgrading vulnerable dependencies. Use this skill whenever the user
  mentions Trivy, vulnerability scanning, CVEs, dependency vulnerabilities,
  security scan, SCA, "check for vulnerable packages", or asks to fix security
  findings in pom.xml, build.gradle, package.json, or lockfiles — even if they
  don't name Trivy explicitly. Scope is STATIC ANALYSIS ONLY (trivy fs, vuln
  scanner) on Java and JavaScript/React ecosystems: do NOT use this skill for
  container image scans, IaC/config scans, secret scans, or other language
  ecosystems; those are out of scope.
---

# Trivy Static Scan & Fix (Java + React)

Scan the repository's Java (Maven/Gradle) and React/Node (npm/yarn/pnpm)
dependency manifests and lockfiles for known vulnerabilities (CVEs) using
Trivy's filesystem mode, then remediate them by upgrading to fixed versions —
with human approval before any change.

**Scope guard:** this skill covers `trivy fs --scanners vuln` on Java and
JavaScript/React targets only. If the user asks for image scanning
(`trivy image`), misconfiguration/IaC scanning (`--scanners misconfig`),
secret scanning (`--scanners secret`), or other language ecosystems (Python,
Go, Rust, PHP, Ruby, .NET), tell them it's out of scope for this skill and
stop. If Trivy reports findings in files outside these two ecosystems, list
them for awareness but do not attempt to fix them.

## Non-negotiable rules

1. **Never modify code or dependency files without explicit user approval.**
   Scan → report → propose fixes → wait for approval → apply → verify.
2. **Never suppress a finding to make the scan pass.** Additions to
   `.trivyignore` require the user's explicit sign-off and a written
   justification comment.
3. **Never downgrade a dependency or pin to a vulnerable version.**
4. **Always re-scan after fixing** and run the project's test suite to prove
   nothing broke.

## Workflow

### Phase 1 — Preflight

1. Check Trivy is installed: `trivy --version`. If missing, show the user the
   install command for their OS (see `references/install.md`) and stop until
   it's available. Do not attempt workarounds.
2. Identify the targets present:
    - **React/Node:** `package.json` plus a lockfile — `package-lock.json`,
      `yarn.lock`, or `pnpm-lock.yaml`. Trivy reads the **lockfile**, not
      package.json alone — if no lockfile exists, warn the user that results
      will be incomplete and offer to generate one
      (`npm install --package-lock-only`, `yarn install`, or `pnpm install
     --lockfile-only`). In monorepos, note each workspace's lockfile.
    - **Java:** `pom.xml` (Maven) or `build.gradle`/`build.gradle.kts`
      (Gradle). For Gradle, Trivy reads `gradle.lockfile` — if dependency
      locking isn't enabled, offer to generate lockfiles
      (`./gradlew dependencies --write-locks`) for accurate results.
      Tell the user exactly which files will be scanned. If neither ecosystem is
      found, stop and say the repo doesn't match this skill's scope.
3. Confirm the working tree is clean (`git status --porcelain`). If not, ask
   the user before proceeding so fixes land in a clean, reviewable diff.

### Phase 2 — Scan

Run two outputs from one scan intent — JSON for machine triage, table for the
user:

```bash
trivy fs --scanners vuln --format json --output trivy-report.json .
trivy fs --scanners vuln --severity CRITICAL,HIGH,MEDIUM,LOW .
```

Notes:
- First run downloads the vulnerability DB; needs network access.
- Add `--skip-dirs node_modules,vendor,.git` if the repo vendors dependencies
  and the user only wants first-party manifests scanned (ask first).
- Do not use `--ignore-unfixed` in the scan; unfixed vulns must still appear
  in the report (they're triaged differently, not hidden).

### Phase 3 — Triage

Run the bundled parser to turn the JSON into an actionable summary:

```bash
python scripts/parse_report.py trivy-report.json
```

It produces, grouped by target file then by package:
severity counts, CVE IDs, installed version, fixed version, and whether the
package is likely a **direct** or **transitive** dependency.

Present the user a triage summary in this exact structure:

```
# Trivy Static Scan Summary
## Totals: X CRITICAL / X HIGH / X MEDIUM / X LOW  (X fixable, X no fix available)
## Fix plan (proposed, awaiting approval)
| Package | Installed | Fix version | Severity (worst) | CVEs | Direct/Transitive | Proposed action |
## Findings with no available fix
## Anything I recommend ignoring (with justification) — requires your sign-off
```

Ordering: CRITICAL first, then HIGH, then the rest. Then **stop and wait for
approval** of the fix plan (the user may approve all, a subset, or none).

### Phase 4 — Fix (only after approval)

Fix one package (or one target file) at a time, committing separately if the
user wants reviewable history. The general rule: upgrade to the **minimum
version ≥ FixedVersion** that satisfies the project's constraints, preferring
the smallest jump (patch > minor > major) to reduce breakage risk.

How to apply the upgrade differs by ecosystem and by direct vs transitive
dependency — read `references/fixing.md` for the exact commands per ecosystem
before touching any file. Key principles:

- **Direct dependency:** bump it in the manifest, regenerate the lockfile with
  the ecosystem's own tool. Never hand-edit lockfiles.
- **Transitive dependency:** prefer updating the direct parent; if that's not
  possible, use the ecosystem's override mechanism (npm `overrides`, yarn
  `resolutions`, pnpm `overrides`, Maven `<dependencyManagement>`, Gradle
  dependency constraints) and record why the override exists and which CVE it
  addresses (XML/Gradle comments inline; for package.json, in the commit/PR
  message since JSON has no comments), so it can be removed later.
- **Major version jumps:** flag them to the user before applying — call out
  known breaking changes if the changelog is accessible.

### Phase 5 — Verify

1. Re-run the scan:
   ```bash
   trivy fs --scanners vuln --exit-code 1 --severity CRITICAL,HIGH .
   ```
   Exit code 0 on CRITICAL/HIGH is the gate. Show remaining MEDIUM/LOW too.
2. Run the project's build and tests to prove nothing broke:
    - Java: `mvn -q verify` or `./gradlew build`
    - React: `npm ci && npm run build && npm test` (or the yarn/pnpm
      equivalents; use whatever scripts package.json defines)
      If tests fail, report which
      upgrade caused it and propose alternatives (smaller bump, parent upgrade,
      or documented ignore) — never silently revert or force-push through.
3. Report a before/after table: severity counts pre-fix vs post-fix, list of
   changed files, and any findings deliberately left open with reasons.

### Handling unfixable findings

For vulns with no `FixedVersion`: report them, check if the vulnerable code
path is even reachable, and offer the user three options — (a) leave open and
tracked, (b) replace the dependency, (c) add to `.trivyignore` with an expiry
and justification comment. Never pick (c) unilaterally.

`.trivyignore` entry format:

```
# CVE-2024-XXXXX — <package>: not exploitable because <reason>.
# Approved by <user>, review by <date>.
CVE-2024-XXXXX
```

## Bundled resources

- `scripts/parse_report.py` — summarizes trivy JSON into the fix-plan table.
  Run it; don't reimplement it inline.
- `references/install.md` — Trivy install commands per OS. Read only if
  Trivy is missing.
- `references/fixing.md` — upgrade commands for the two supported ecosystems
  (Maven, Gradle, npm, yarn, pnpm). Read the section for the ecosystem you're
  fixing before applying changes.

## Future scope (not this skill)

Image scanning (`trivy image`), config/IaC scanning (`--scanners misconfig`),
and additional language ecosystems are planned as separate skills. If asked,
note they're coming and keep this run limited to static filesystem
vulnerability analysis of Java and React targets.