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