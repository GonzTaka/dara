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

## Architecture

DARA is a microservices system, each concern is its own independently deployable service. No service shares a database with another.