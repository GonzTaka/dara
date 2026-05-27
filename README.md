# DARA: Distributed AI Research Assistant

A team-first knowledge platform that lets you query your own documents with an AI that cites its sources, flags uncertainty, and remembers what your team has already asked.

Built by [GonzTaka](https://github.com/GonzTaka) · Python + React + Kubernetes

---

## The Problem

Every knowledge worker has documents they've already paid for papers, contracts, RFCs, runbooks. The information exists. Finding it, connecting it, and trusting it is the problem.

Google searches the internet. Nothing searches *your stuff* intelligently.

---

## What Makes DARA Different

| Feature | Perplexity | NotebookLM | DARA |
|---|---|---|---|
| Team workspaces | ✗ | ✗ | ✓ |
| Persistent memory | ✗ | ✗ | ✓ |
| Confidence scoring | ✗ | ✗ | ✓ |
| Document relationships | ✗ | ✗ | ✓ |
| Citation grounding | Partial | Partial | ✓ |
| Self-hostable | ✗ | ✗ | ✓ |

---

## Who Is It For?

**Grad students** — upload 200 papers, ask what different authors say about a topic, get cited synthesis instead of ctrl+F.

**Law firms** — shared case file workspace. Every attorney searches the same docs. The critic agent flags uncertain answers.

**Engineering teams** — new engineer asks why an architectural decision was made and gets the original RFC cited back to them.

**Research labs** — shared workspace surfaces prior team Q&A before anyone duplicates a search.

---

## Architecture

DARA is a microservices system, each concern is its own independently deployable service. No service shares a database with another.

### The 7 Services

| Service | Stack | Responsibility |
|---|---|---|
| `auth-service` | FastAPI + PostgreSQL | JWT auth, users, teams, workspaces |
| `ingestion-service` | FastAPI + Celery + MinIO | File uploads, raw storage, job queue |
| `embedding-service` | Celery + OpenAI Embeddings | Chunking, vectorizing, writing to Qdrant |
| `retrieval-service` | FastAPI + Qdrant | Hybrid vector + keyword search |
| `orchestration-service` | FastAPI + LangGraph | Multi-agent AI pipeline |
| `notification-service` | FastAPI + WebSockets | Real-time push via Redis Pub/Sub |
| `api-gateway` | Nginx | Single entry point, rate limiting, routing |

### Data Layer

| Store | Used by | Why |
|---|---|---|
| PostgreSQL | auth-service | Users, workspaces — relational |
| Qdrant | embedding + retrieval | Vector index |
| Redis | ingestion, notification | Job queue + pub/sub |
| MinIO | ingestion-service | Raw file blob storage |

### Infrastructure

- **Local dev:** Docker Compose — `docker compose up` starts everything
- **Production:** Kubernetes + Helm on DigitalOcean (DOKS)
- **CI/CD:** GitHub Actions — builds and deploys only the changed service
- **Observability:** Prometheus + Grafana + Sentry

---

## The AI Pipeline

When a user asks a question, the `orchestration-service` runs this pipeline:

```
User Question
     ↓
Query Rewriter      → rewrites ambiguous questions for better search
     ↓
Retriever Agent     → calls retrieval-service, gets top-k chunks from Qdrant
     ↓
Context Ranker      → cross-encoder re-ranks top-20 results for precision
     ↓
Synthesizer Agent   → builds a grounded answer with inline citations
     ↓
Critic Agent        → verifies every claim is supported, flags conflicts
     ↓
Streamed Response   → sent to client via SSE (Server-Sent Events)
```

Built with **LangGraph** — models the pipeline as an explicit state graph, which means we can draw it on a whiteboard and explain it precisely in any interview or demo.

---

## Full Tech Stack

### Frontend
- React + Vite + TypeScript
- TailwindCSS + shadcn/ui
- TanStack Query (server state)
- Zustand (client state)
- SSE (streaming) + Socket.io (real-time notifications)

### Services
- FastAPI across all services
- Pydantic v2 for request/response validation
- LangGraph for multi-agent orchestration
- Celery + Celery Beat for async job queues
- sentence-transformers for cross-encoder re-ranking
- spaCy for document pre-processing

### AI / ML
- OpenAI GPT-4o (synthesis, critic, query rewriting)
- OpenAI text-embedding-3-small (vector embeddings)
- Qdrant (vector database with hybrid search)

### Infra
- Docker + Docker Compose (local)
- Kubernetes + Helm (production)
- GitHub Actions CI/CD
- DigitalOcean DOKS (~$50–80/month for a small cluster)

---

## How We Work

We follow an Agile project management framework **SCRUM** in which we plan sprints, set priorities, share issues and share reponsabilities in a given timeframe.

### GitHub Setup
- **Org:** GonzTaka
- **Repo:** `github.com/GonzTaka/dara`
- **Board:** GitHub Projects (Backlog → In Progress → In Review → Done)
- **Sprints:** GitHub Milestones (`Sprint 1 — Foundation`, `Sprint 2 — Intelligence`, etc.)
- **Issues:** One issue per feature, labeled and assigned

### Branch Strategy
```
main        → always deployable, protected (requires PR + 1 approval)
dev         → integration branch
feature/DARA-N-short-description  → one branch per issue
```

### Commit Convention
Every commit is tagged to its issue number:
```
[DARA-1] Add monorepo root README
[DARA-7] Add file upload endpoint to ingestion-service
[DARA-16] Add root docker-compose.yml with all services
```

### Rules
- **One file per commit maximum** —> keeps history clean and reviewable
- **Commits must be independently testable** —> never commit broken state
- **SRP everywhere** —> styles in separate files, business logic out of route handlers
- **No secrets committed** —> `.env` is gitignored, use `.env.example` for templates
- **PR required to merge to main** —> the other person reviews before it lands

### Labels
| Label | Meaning |
|---|---|
| `feature` | New user-facing functionality |
| `service` | Backend microservice work |
| `frontend` | React client and UI work |
| `infra` | Docker, Kubernetes, CI/CD, cloud config |
| `ai` | Agents, embeddings, vector search, LLM integration |
| `test` | Unit tests, integration tests, test utilities |
| `refactor` | Code restructuring with no behavior change |
| `docs` | README, comments, architecture documentation |
| `bug` | Something is broken and needs fixing |

---

## Sprint Plan

| Sprint | Focus | Timeline |
|---|---|---|
| Sprint 1 — Foundation | Auth, ingestion, Docker Compose | Months 1–2 |
| Sprint 2 — Intelligence | Retrieval, basic RAG, SSE streaming | Month 3 |
| Sprint 3 — Multi-Agent | Full agent pipeline, WebSockets, workspaces | Month 4 |
| Sprint 4 — Production | Kubernetes, HPA, CI/CD | Month 5 |
| Sprint 5 — Polish | Onboarding UI, demo dataset, load testing | Month 6 |

### Sprint 1 — Your Issues (Rodrigo)

| Issue | Title |
|---|---|
| DARA-9 | Scaffold React + Vite + TypeScript frontend |
| DARA-10 | Add TailwindCSS + shadcn/ui setup |
| DARA-11 | Build login and register pages |
| DARA-12 | Wire auth context and token storage with Zustand |
| DARA-13 | Add ingestion-service FastAPI skeleton |
| DARA-14 | Add file upload endpoint to ingestion-service |
| DARA-15 | Add ingestion-service Dockerfile |
| DARA-16 | Add root docker-compose.yml with all services |

Full issue descriptions are in GitHub Issues — each one has a task checklist and acceptance criteria.

---

## The AI Assistant — Claude

We're using **Claude** (by Anthropic) as our AI pair programmer throughout this project. Here's what that means in practice.

### What We Use It For

- **Architecture decisions** — we designed the entire microservices structure, agent pipeline, and data layer in conversation with Claude before writing a line of code
- **Issue planning** —> Claude helped scope and write all 16 Sprint 1 GitHub issues with task checklists and acceptance criteria
- **Commit-by-commit development** — when implementing features, Claude writes one file at a time following our conventions (SRP, functional style, one file per commit)
- **Code review** — Claude reviews diffs and flags violations of our conventions before we push
- **Debugging** — when something breaks, Claude helps diagnose from error output

### How to Use It Effectively

**Be specific about the file.** Instead of "help me with auth", say "help me write `services/auth_service.py` — the `register_user()` function that takes email and password, hashes the password with bcrypt, inserts into PostgreSQL, and returns a JWT."

**Reference our conventions.** Claude knows our rules — tell it "one file per commit, SRP, functional style in the backend" and it'll follow them.

**Ask for the commit message too.** Claude will give you the `[DARA-N]` formatted message and a GitKraken description explaining the *why*.

**Use it for the smallest increment.** Don't ask for an entire service at once. Ask for one function, one endpoint, one component. Then commit it. Then ask for the next one.

### What It Won't Do For You

Claude won't replace understanding the code. Every line that goes into `dara` you should be able to explain — what it does, why it's structured that way, and what would break if you changed it. That's what makes this a portfolio project, not a vibe-coded repo.

---

*Built by GonzTaka — Samuel Gonzalez Pineda & Rodrigo Takano*
