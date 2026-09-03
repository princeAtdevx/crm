# Graph Report - orra  (2026-09-02)

## Corpus Check
- Corpus is ~46,587 words - fits in a single context window. You may not need a graph.

## Summary
- 772 nodes · 971 edges · 54 communities (43 shown, 11 thin omitted)
- Extraction: 92% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 72 edges (avg confidence: 0.87)
- Token cost: 470,729 input · 0 output

## Community Hubs (Navigation)
- NestJS App Controller
- http App package.json Deps
- UI Package Class Utils
- Drizzle DB Package Deps
- Biome Config
- Web App Entry Point
- React App Shell + Badge
- http App Dev Deps
- Codebase Design Skill
- Lefthook + Turbo Deps
- Web App Dev Deps
- http tsconfig
- react-app.json tsconfig Preset
- web app.json Deps
- Writing Skills Family
- Domain Modeling + Grilling Skills
- ts-config base tsconfig
- base.json tsconfig Preset
- Wizard Template Script
- nest.json tsconfig Preset
- ts-config package.json
- Ask Matt Skill
- Spec/Ticket/Triage Pipeline Skills
- nextjs.json tsconfig Preset
- tsconfig.node.json
- Prototype + Handoff Skills
- Setup Matt Pocock Skills Templates
- Setup Pre-commit + Deep Modules Skills
- tsconfig.app.json
- Code Review Skill
- Migrate to Shoehorn + TDD Skills
- web tsconfig
- Repo Agent-Skills Config (CLAUDE.md + docs/agents)
- Teach Skill Formats
- react-library.json tsconfig Preset
- nest-cli.json
- HITL Loop Template Script
- db tsconfig files/references
- Git Guardrails Skill
- Retro Skill
- Block Dangerous Git Script
- Handoff Skill
- Scaffold Exercises Skill
- Grill Me Agent Config
- Setup TS Deep Modules Agent Config
- TDD Agent Config
- Teach Agent Config
- To Questionnaire Agent Config
- To Spec Agent Config
- To Tickets Agent Config

## God Nodes (most connected - your core abstractions)
1. `Ask Matt Skill` - 27 edges
2. `cn()` - 19 edges
3. `compilerOptions` - 16 edges
4. `scripts` - 15 edges
5. `scripts` - 15 edges
6. `compilerOptions` - 15 edges
7. `Codebase Design` - 15 edges
8. `DrizzleDb` - 14 edges
9. `compilerOptions` - 14 edges
10. `CRM Monorepo` - 13 edges

## Surprising Connections (you probably didn't know these)
- `Wait What` --conceptually_related_to--> `Domain Docs (docs/agents/domain.md)`  [AMBIGUOUS]
  .claude/skills/ask-matt/SKILL.md → docs/agents/domain.md
- `biome-ci job (pre-push)` --conceptually_related_to--> `Biome (lint/format/import-sort)`  [INFERRED]
  lefthook.yml → README.md
- `biome job (pre-commit)` --conceptually_related_to--> `Biome (lint/format/import-sort)`  [INFERRED]
  lefthook.yml → README.md
- `@biomejs/biome catalog entry (2.5.11, exact)` --conceptually_related_to--> `Biome (lint/format/import-sort)`  [INFERRED]
  pnpm-workspace.yaml → README.md
- `NestJS TypeScript starter (apps/http)` --conceptually_related_to--> `apps/http workspace (NestJS 12 API)`  [INFERRED]
  apps/http/README.md → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Monorepo tooling stack (pnpm, Bun, Biome, lefthook, TypeScript)** — readme_pnpm, readme_bun, readme_biome, readme_lefthook, readme_typescript [EXTRACTED 0.90]
- **CRM monorepo workspaces (apps + packages)** — readme_apps_http_workspace, readme_apps_web_workspace, readme_packages_db_workspace, readme_packages_ui_workspace, readme_packages_ts_config_workspace [EXTRACTED 0.90]
- **pnpm catalog shared/pinned dependency versions** — pnpm_workspace_catalog, pnpm_workspace_biome, pnpm_workspace_tailwindcss, pnpm_workspace_react, pnpm_workspace_typescript, pnpm_workspace_vitest [EXTRACTED 0.90]
- **Idea-to-Ship Main Flow** — claude_skills_grill_with_docs_skill, claude_skills_to_spec_skill, claude_skills_to_tickets_skill, claude_skills_implement_skill [EXTRACTED 1.00]
- **Deep Module Vocabulary System** — claude_skills_codebase_design_skill_module, claude_skills_codebase_design_skill_interface, claude_skills_codebase_design_skill_seam, claude_skills_codebase_design_skill_adapter, claude_skills_codebase_design_skill_depth [EXTRACTED 1.00]
- **Six-Phase Bug Diagnosis Loop** — claude_skills_diagnosing_bugs_skill_phase1_feedback_loop, claude_skills_diagnosing_bugs_skill_phase2_reproduce_minimise, claude_skills_diagnosing_bugs_skill_phase3_hypothesise, claude_skills_diagnosing_bugs_skill_phase4_instrument, claude_skills_diagnosing_bugs_skill_phase5_fix_regression_test, claude_skills_diagnosing_bugs_skill_phase6_cleanup [EXTRACTED 1.00]
- **grill-with-docs composes grilling and domain-modeling into a documented interview** — claude_skills_grill_with_docs_skill, claude_skills_grilling_skill, claude_skills_domain_modeling_skill [INFERRED 0.85]
- **improve-codebase-architecture drives its process using codebase-design vocabulary and the grilling loop** — claude_skills_improve_codebase_architecture_skill, claude_skills_codebase_design_skill, claude_skills_grilling_skill [INFERRED 0.85]
- **prototype skill dispatches to LOGIC.md or UI.md branches based on the question type** — claude_skills_prototype_skill, claude_skills_prototype_logic, claude_skills_prototype_ui [INFERRED 0.90]
- **SKILL.md scaffolds the per-repo config templates (issue trackers, triage labels, domain docs)** — claude_skills_setup_matt_pocock_skills_skill, claude_skills_setup_matt_pocock_skills_issue_tracker_github, claude_skills_setup_matt_pocock_skills_issue_tracker_gitlab, claude_skills_setup_matt_pocock_skills_issue_tracker_local, claude_skills_setup_matt_pocock_skills_triage_labels, claude_skills_setup_matt_pocock_skills_domain [INFERRED 0.85]
- **Issue tracker templates each implement the wayfinder map/child/blocking pattern for their tracker** — claude_skills_setup_matt_pocock_skills_issue_tracker_github, claude_skills_setup_matt_pocock_skills_issue_tracker_gitlab, claude_skills_setup_matt_pocock_skills_issue_tracker_local [INFERRED 0.80]
- **Shared agents/openai.yaml interface-config pattern across skills** — prototype_agents_openai, research_agents_openai, resolving_merge_conflicts_agents_openai, retro_agents_openai, scaffold_exercises_agents_openai, setup_matt_pocock_skills_agents_openai, setup_pre_commit_agents_openai [INFERRED 0.70]
- **Teach skill's structured workspace file formats** — claude_skills_teach_skill, claude_skills_teach_mission_format, claude_skills_teach_glossary_format, claude_skills_teach_resources_format, claude_skills_teach_learning_record_format [EXTRACTED 0.90]
- **Conversation-to-spec-to-tickets synthesis pipeline gated on issue tracker setup** — claude_skills_to_spec_skill, claude_skills_to_tickets_skill, setup_matt_pocock_skills_concept [EXTRACTED 0.85]
- **Triage state machine using agent briefs and out-of-scope knowledge base** — triage_skill, claude_skills_triage_agent_brief, claude_skills_triage_out_of_scope [EXTRACTED 0.90]
- **Agent-skills tracker configuration bundle referenced from CLAUDE.md** — claude_md, docs_agents_issue_tracker_doc, docs_agents_triage_labels_doc, docs_agents_domain_doc [EXTRACTED 1.00]
- **Writing explore (fragments) feeding exploit (beats/shape) skill pipeline** — claude_skills_writing_fragments_skill, claude_skills_writing_beats_skill, claude_skills_writing_shape_skill [INFERRED 0.85]
- **Wayfinder ticket resolution lifecycle: map, tickets, frontier, fog of war** — claude_skills_wayfinder_skill, wayfinder_ticket_concept, wayfinder_frontier_concept, wayfinder_fog_of_war_concept [INFERRED 0.80]

## Communities (54 total, 11 thin omitted)

### Community 0 - "NestJS App Controller"
Cohesion: 0.07
Nodes (27): AppController, AppModule, { ObserveModule, ObserveInstrument }, Module, AppService, Injectable, Env, envSchema (+19 more)

### Community 1 - "http App package.json Deps"
Cohesion: 0.05
Nodes (41): author, dependencies, @crm/db, @nestjs/common, @nestjs/config, @nestjs/core, @nestjs/observe, @nestjs/platform-express (+33 more)

### Community 2 - "UI Package Class Utils"
Cohesion: 0.05
Nodes (41): class-variance-authority, clsx, dependencies, class-variance-authority, clsx, tailwind-merge, tailwindcss, devDependencies (+33 more)

### Community 3 - "Drizzle DB Package Deps"
Cohesion: 0.05
Nodes (38): dotenv, drizzle-kit, drizzle-orm, dependencies, drizzle-orm, pg, devDependencies, @biomejs/biome (+30 more)

### Community 4 - "Biome Config"
Cohesion: 0.06
Nodes (38): biome.jsonc, ^build, check-types, .editorconfig, !.env*, ^lint, !**/*.md, !**/*.sql (+30 more)

### Community 5 - "Web App Entry Point"
Cohesion: 0.08
Nodes (38): NestJS TypeScript starter (apps/http), src/main.tsx entry script, #root mount div, CRM logo favicon (purple gradient blob mark), @crm/web front end, React 19, @crm/ts-config/react-app.json preset, Vite (+30 more)

### Community 6 - "React App Shell + Badge"
Cohesion: 0.17
Nodes (22): App(), rootElement, Badge(), BadgeProps, badgeVariants, Button(), ButtonProps, buttonVariants (+14 more)

### Community 7 - "http App Dev Deps"
Cohesion: 0.06
Nodes (31): devDependencies, @biomejs/biome, @crm/ts-config, @nestjs/cli, @nestjs/mau, @nestjs/schematics, @nestjs/testing, source-map-support (+23 more)

### Community 8 - "Codebase Design Skill"
Cohesion: 0.10
Nodes (31): Codebase Design Agent Config, Deepening, Dependency Categories, Seam Discipline, Replace-Don't-Layer Testing, Design It Twice, Design It Twice (Ousterhout), Parallel Sub-agent Design Process (+23 more)

### Community 9 - "Lefthook + Turbo Deps"
Cohesion: 0.07
Nodes (29): lefthook, devDependencies, @biomejs/biome, lefthook, turbo, typescript, engines, node (+21 more)

### Community 10 - "Web App Dev Deps"
Cohesion: 0.07
Nodes (29): devDependencies, @babel/core, babel-plugin-react-compiler, @biomejs/biome, @crm/ts-config, @rolldown/plugin-babel, tailwindcss, @tailwindcss/vite (+21 more)

### Community 11 - "http tsconfig"
Cohesion: 0.09
Nodes (22): compilerOptions, emitDecoratorMetadata, experimentalDecorators, module, moduleResolution, noEmit, noFallthroughCasesInSwitch, noImplicitAny (+14 more)

### Community 12 - "react-app.json tsconfig Preset"
Cohesion: 0.09
Nodes (22): compilerOptions, allowImportingTsExtensions, declaration, declarationMap, erasableSyntaxOnly, jsx, lib, module (+14 more)

### Community 13 - "web app.json Deps"
Cohesion: 0.09
Nodes (21): dependencies, @crm/ui, react, react-dom, react, react-dom, name, private (+13 more)

### Community 14 - "Writing Skills Family"
Cohesion: 0.11
Nodes (21): Writing Beats agent interface config, Writing Beats skill, Writing for Agents agent interface config, Writing For Agents, Skill Mechanics reference (writing-for-agents), Writing Fragments agent interface config, Writing Fragments skill, Writing Shape agent interface config (+13 more)

### Community 15 - "Domain Modeling + Grilling Skills"
Cohesion: 0.12
Nodes (20): Domain Modeling Agent Config, Domain Modeling, Domain Model (active discipline), Grill with Docs agent config, Grill With Docs, Grilling agent config, Grilling (interview primitive), Improve Codebase Architecture agent config (+12 more)

### Community 16 - "ts-config base tsconfig"
Cohesion: 0.10
Nodes (19): compilerOptions, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch, noImplicitOverride, types (+11 more)

### Community 17 - "base.json tsconfig Preset"
Cohesion: 0.10
Nodes (19): compilerOptions, declaration, declarationMap, esModuleInterop, incremental, isolatedModules, lib, module (+11 more)

### Community 18 - "Wizard Template Script"
Cohesion: 0.23
Nodes (17): ask(), ask_secret(), banner(), _clear(), _existing(), finish(), note(), open_url() (+9 more)

### Community 19 - "nest.json tsconfig Preset"
Cohesion: 0.11
Nodes (17): compilerOptions, allowSyntheticDefaultImports, emitDecoratorMetadata, experimentalDecorators, forceConsistentCasingInFileNames, incremental, noFallthroughCasesInSwitch, noImplicitAny (+9 more)

### Community 20 - "ts-config package.json"
Cohesion: 0.12
Nodes (15): devDependencies, @biomejs/biome, @biomejs/biome, license, name, private, publishConfig, access (+7 more)

### Community 21 - "Ask Matt Skill"
Cohesion: 0.16
Nodes (14): Ask Matt Agent Config, Phase Boundaries Doc, Phase Boundary Decision Tree, Primary vs Secondary Source, Smart Zone, Ask Matt Skill, Implement agent config, Implement (+6 more)

### Community 22 - "Spec/Ticket/Triage Pipeline Skills"
Cohesion: 0.22
Nodes (11): Grill Me, To Questionnaire SKILL.md, To Spec SKILL.md, To Tickets SKILL.md, Writing Agent Briefs (AGENT-BRIEF.md), Out-of-Scope Knowledge Base (OUT-OF-SCOPE.md), domain-modeling skill (external reference), grilling skill (external reference) (+3 more)

### Community 23 - "nextjs.json tsconfig Preset"
Cohesion: 0.18
Nodes (10): compilerOptions, allowJs, jsx, module, moduleResolution, noEmit, plugins, extends (+2 more)

### Community 24 - "tsconfig.node.json"
Cohesion: 0.20
Nodes (9): compilerOptions, lib, types, extends, include, @crm/ts-config/react-app.json, ES2023, node (+1 more)

### Community 25 - "Prototype + Handoff Skills"
Cohesion: 0.25
Nodes (9): Claude Handoff Agent Config, Claude Handoff, improve-codebase-architecture HTML report format, Logic Prototype guide, Prototype, UI Prototype (skill sub-doc), PrototypeSwitcher component, Prototype agent interface config (+1 more)

### Community 26 - "Setup Matt Pocock Skills Templates"
Cohesion: 0.33
Nodes (9): Domain Docs consumer rules (domain.md), domain-modeling skill (external ref), Issue tracker: GitHub template, Issue tracker: GitLab template, Issue tracker: Local Markdown template, setup-matt-pocock-skills SKILL.md, Triage Labels mapping template, Setup Matt Pocock Skills agent interface config (+1 more)

### Community 27 - "Setup Pre-commit + Deep Modules Skills"
Cohesion: 0.22
Nodes (7): setup-pre-commit SKILL.md, setup-ts-deep-modules SKILL.md, codebase-design skill (external ref), Husky (git hooks tool), lint-staged tool, Prettier (formatter), Setup Pre-Commit agent interface config

### Community 28 - "tsconfig.app.json"
Cohesion: 0.25
Nodes (7): compilerOptions, types, extends, include, @crm/ts-config/react-app.json, src, vite/client

### Community 29 - "Code Review Skill"
Cohesion: 0.25
Nodes (8): Code Review Agent Config, Refactoring (Fowler, ch.3), Code Review, Fowler Smell Baseline, Spec Axis, Standards Axis, Implement Spec agent config, implement-spec skill

### Community 30 - "Migrate to Shoehorn + TDD Skills"
Cohesion: 0.38
Nodes (7): Migrate to Shoehorn agent config, migrate-to-shoehorn skill, When to Mock (mocking.md), TDD SKILL.md, Good and Bad Tests (tests.md), code-review skill (external reference), Seam (test boundary concept)

### Community 31 - "web tsconfig"
Cohesion: 0.29
Nodes (6): compilerOptions, types, extends, include, @crm/ts-config/react-app.json, src

### Community 32 - "Repo Agent-Skills Config (CLAUDE.md + docs/agents)"
Cohesion: 0.40
Nodes (6): orra repo CLAUDE.md, Triage agent interface config, Domain Docs (docs/agents/domain.md), Issue tracker: Local Markdown (docs/agents/issue-tracker.md), Triage Labels (docs/agents/triage-labels.md), The Map (wayfinder)

### Community 33 - "Teach Skill Formats"
Cohesion: 0.47
Nodes (6): GLOSSARY.md Format, Learning Record Format, MISSION.md Format, RESOURCES.md Format, Teach SKILL.md, Zone of Proximal Development

### Community 34 - "react-library.json tsconfig Preset"
Cohesion: 0.33
Nodes (5): compilerOptions, jsx, extends, ./base.json, $schema

### Community 35 - "nest-cli.json"
Cohesion: 0.50
Nodes (3): collection, $schema, sourceRoot

### Community 36 - "HITL Loop Template Script"
Cohesion: 0.83
Nodes (3): capture(), hitl-loop.template.sh script, step()

### Community 38 - "Git Guardrails Skill"
Cohesion: 0.67
Nodes (3): Git Guardrails Agent Config, Git Guardrails for Claude Code, PreToolUse Hook

### Community 39 - "Retro Skill"
Cohesion: 0.67
Nodes (3): retro SKILL.md, Retro agent interface config, writing-for-agents skill (external ref)

## Ambiguous Edges - Review These
- `Wait What` → `Domain Docs (docs/agents/domain.md)`  [AMBIGUOUS]
  .claude/skills/wait-what/SKILL.md · relation: conceptually_related_to
- `Seam (test boundary concept)` → `Wide refactor / expand-contract pattern`  [AMBIGUOUS]
  .claude/skills/to-tickets/SKILL.md · relation: conceptually_related_to

## Knowledge Gaps
- **372 isolated node(s):** `block-dangerous-git.sh script`, `$schema`, `collection`, `sourceRoot`, `name` (+367 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Wait What` and `Domain Docs (docs/agents/domain.md)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Seam (test boundary concept)` and `Wide refactor / expand-contract pattern`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `Ask Matt Skill` connect `Ask Matt Skill` to `Teach Skill Formats`, `Codebase Design Skill`, `Writing Skills Family`, `Domain Modeling + Grilling Skills`, `Spec/Ticket/Triage Pipeline Skills`, `Prototype + Handoff Skills`, `Setup Matt Pocock Skills Templates`, `Code Review Skill`, `Migrate to Shoehorn + TDD Skills`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `Codebase Design` connect `Codebase Design Skill` to `Prototype + Handoff Skills`, `Ask Matt Skill`, `Migrate to Shoehorn + TDD Skills`, `Domain Modeling + Grilling Skills`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Why does `TDD SKILL.md` connect `Migrate to Shoehorn + TDD Skills` to `Codebase Design Skill`, `Teach Skill Formats`, `Setup Pre-commit + Deep Modules Skills`, `Ask Matt Skill`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **What connects `block-dangerous-git.sh script`, `$schema`, `collection` to the rest of the system?**
  _372 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `NestJS App Controller` be split into smaller, more focused modules?**
  _Cohesion score 0.0671602326811211 - nodes in this community are weakly interconnected._