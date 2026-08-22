---
name: spring-boot-migration
description: >
  Migrates Spring Boot 3.x projects to Spring Boot 4, covering the new modular
  starter/module structure, Jackson 3 upgrade, removed features, config
  property renames, and Java 25 baseline. Works for any dependency set — the
  agent inspects the project's actual dependencies rather than assuming a
  fixed list. Use when the user asks to upgrade or migrate to Spring Boot 4,
  or to check Spring Boot 4 compatibility.
---

# Spring Boot 3 → 4 Migration

Source of truth: [Official Spring Boot 4.0 Migration Guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Migration-Guide).
Full breaking-change catalog: [reference.md](reference.md).

## Quick start
1. Confirm the project is on the latest `3.5.x` first — migrate stepwise, not directly from an older 3.x
2. Read the build file (`pom.xml` or `build.gradle[.kts]`) and enumerate **every** current dependency — don't assume which starters are in use
3. For each dependency, check [reference.md](reference.md) for a Spring Boot 4 equivalent (module split, rename, or removal)
4. Bump baseline: Java 25, Spring Boot 4.x, Spring Framework 7.x
5. Build, fix, repeat (see Workflow)

## Workflow
Copy this checklist and track progress:
```
Migration Progress:
- [ ] Step 1: Verify on latest 3.5.x, review current deprecation warnings
- [ ] Step 2: Enumerate all dependencies in the build file
- [ ] Step 3: Bump Java baseline to 25, Boot/Framework to 4.x
- [ ] Step 4: Map each dependency to its Boot 4 starter/module (reference.md)
- [ ] Step 5: Add spring-boot-properties-migrator, run once, fix reported keys, then remove it
- [ ] Step 6: Fix removed/renamed APIs (Jackson 3, testing annotations, etc.)
- [ ] Step 7: Full build + test suite
- [ ] Step 8: Review startup logs for remaining warnings
```

**Step 1 — Baseline check.** Confirm `3.5.x` latest patch. Review any `@Deprecated` call sites now, since 3.x deprecations are removed in 4.x.

**Step 2 — Enumerate dependencies.** This is a general-purpose migration — don't hardcode an assumed dependency list. Read the actual build file and list every declared dependency, including transitive ones your project overrides.

**Step 3 — Baseline bump.**
- Java 25 (project target — Boot 4 itself only requires 17+, but this project standardizes on 25)
- `spring-boot-starter-parent` / BOM → 4.x
- Jakarta EE 11 / Servlet 6.1 baseline

**Step 4 — Map dependencies.** For *every* dependency found in Step 2, look it up in [reference.md](reference.md)'s starter/module tables. If a technology previously worked with no dedicated starter (e.g. Flyway, Liquibase), it now needs one. If unsure, use the **classic starter** (`spring-boot-starter-classic`) as a temporary bridge — see reference.md.

**Step 5 — Config properties.** Add `spring-boot-properties-migrator` (runtime scope) temporarily, run the app once, fix every flagged property key, then remove the migrator dependency.

**Step 6 — Code fixes.** See [reference.md](reference.md) for the full list: Jackson 3 (`com.fasterxml.jackson` → `tools.jackson`), removed `@MockBean`/`@SpyBean`, MockMvc/TestRestTemplate changes, package moves, etc.

**Step 7 — Build & test.** `mvn clean verify` (or `gradle build`). If it fails, return to Step 4 or 6 depending on the error type.

**Step 8 — Verify.** Check startup logs for remaining deprecation warnings.

## Old patterns
Spring Boot 3.x allowed monolithic starters with all auto-configuration bundled. Boot 4 splits these into per-technology modules — a dependency that "just worked" in 3.x may need an explicit starter now. See reference.md § Module Dependencies.