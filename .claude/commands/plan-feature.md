---
description: Create detailed implementation plan for a feature
---

You are planning a new feature. Follow this process exactly:

## 1. Explore the Codebase
* List relevant directories to show project structure
* Review AGENTS.md, CLAUDE.md, and files under docs/
* Check existing code for similar implementations
* Read related test files

## 2. Ask Clarifying Questions
If anything is ambiguous, ask before finalizing the plan:
* Which module should this live in?
* What's the expected data format?
* How should errors be handled?
* Any performance constraints?

## 3. File Tree of Changes
Show a tree diagram with markers:
* UPDATE = update existing
* NEW = new file
* DELETE = remove file

## 4. File-by-File Change Plan
For each file:
* Full path + action (update/new/delete)
* Exact changes in plain language
* Code snippet showing main update
* Any breaking changes or migrations needed

## 5. Context & Rationale
* Why each change is needed
* Dependencies or side effects
* Potential risks or concerns
* Performance implications

## 6. Security Checklist
* Authentication/authorization requirements
* Input validation needed
* Data exposure risks
* Security implications of changes

## 7. Testing Strategy
* Unit tests to write
* Integration tests needed
* Edge cases to cover
* Manual testing steps

Feature to plan: $ARGUMENTS
