# q
A minimal CLI AI assistant. Ask anything, get an answer, stay in the terminal.

```bash
q "how do I recursively find files modified in the last 24 hours?"
```

Powered by Groq's `llama-3.1-8b-instant` — streams responses in real time.

---

## Install

```bash
bun install
```

Set your API key:

```bash
export GROQ_API_KEY=your_key_here
```

Get a free key at [console.groq.com](https://console.groq.com).

---

## Usage

```bash
bun run index.ts "<your question>"
```

Or alias it for daily use:

```bash
alias q="bun run /path/to/index.ts"
```

Then just:

```bash
q "what does SIGTERM do?"
q "write a one-liner to count lines in all .ts files"
q "explain defer in Go"
```

Responses stream chunk-by-chunk. No waiting for the full output to generate.

---

## How it works

`index.ts` reads your query from `argv`, fires a request to the Groq API, and manually parses the SSE stream — printing each text delta as it arrives. Output is styled with `chalk`: model metadata is dimmed, the response is clean.

The system prompt is tuned for brevity: short, direct answers. No preamble.

---

## Roadmap

- [ ] Persistent conversation history across sessions (`history/` directory)
- [ ] `--model` flag to switch models
- [ ] Piped input support (`cat error.log | q "what's wrong here?"`)
- [ ] Config file for default system prompt

---

## Requirements

- [Bun](https://bun.sh) v1.3.11+
- A [Groq API key](https://console.groq.com) (free tier available)

---

MIT