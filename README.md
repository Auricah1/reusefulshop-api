# reusefulshop — second-hand price API for humans and AI agents

**What is a used item worth?** This repo documents and demonstrates the reusefulshop price API: live second-hand price intelligence, free for people and pay-per-call for AI agents via **x402** (USDC on Base, no signup, no API keys).

- Website: https://reusefulshop.com
- Docs: https://reusefulshop.com/docs
- Methodology: https://reusefulshop.com/methodology
- OpenAPI: https://reusefulshop.com/openapi.json
- Free sample dataset (100 items): https://reusefulshop.com/data/sample.json
- Seller calculator (free, for humans): https://reusefulshop.com/tools/seller
- Run by the team behind the [ReusefulShop eBay shop](https://www.ebay.co.uk/str/reusefulshop) (100% positive feedback, 5,000+ items sold).
- Listed in the official MCP registry (`io.github.Auricah1/reusefulshop`), on [Smithery](https://smithery.ai/server/auricah1/reusefulshop) and as a [Glama connector](https://glama.ai/mcp/connectors/io.github.Auricah1/reusefulshop). Payments settle through Coinbase's x402 facilitator.

## Endpoints

| Endpoint | Returns | Price |
|---|---|---|
| `GET /api/worth?q=<item>` | low / typical / high, sample size, confidence, source | $0.01 |
| `GET /api/deal?q=<item>&price=<asking>` | verdict: great deal / good deal / fair price / above average / overpriced | $0.01 |
| `GET /api/history?q=<item>` | daily price snapshots | $0.02 |
| `GET /api/sold?q=<item>` | real sold prices from the operator's eBay shop | $0.01 |
| `POST /api/batch` | up to 10 items per call — JSON body `{"items": ["..."]}`, one result or error per item | $0.05 |
| `GET /health` | status and integrations | free |

Base URL: `https://reusefulshop.com`

## Quickstart (curl)

```bash
# Step 1: ask — no payment yet
curl -i "https://reusefulshop.com/api/worth?q=used+playstation+5+console"
# → HTTP 402 with a PAYMENT-REQUIRED header describing the exact price (USDC on Base)

# Step 2: pay with any x402 client and retry with the payment header
# → HTTP 200 with JSON
```

## Quickstart (TypeScript buyer)

See [`examples/buyer.ts`](examples/buyer.ts).

```bash
npm install @x402/fetch @x402/evm viem
PRIVATE_KEY=0x... npx tsx examples/buyer.ts "used playstation 5 console"
```

## MCP server (Claude, Cursor, any MCP client)

Endpoint: `https://reusefulshop.com/mcp` (Streamable HTTP). Tools: `get_worth`, `check_deal`, `get_history`, `get_sold` (real sold prices from the operator's own eBay shop). Cached lookups are free via MCP. Batch pricing (`POST /api/batch`) is HTTP-API only — MCP exposes the single-item tools.

```json
{
  "mcpServers": {
    "reusefulshop": { "url": "https://reusefulshop.com/mcp" }
  }
}
```

## How it works

1. A collector fetches live public listings (Discogs marketplace lows for music; eBay UK asking prices for everything else) and records them.
2. Every item gets a daily price snapshot, so history builds over time.
3. The website serves the data free to people; the API serves it to agents for a micropayment per call.
4. Fresh answers are cached for 24h; first-time items are fetched on demand.

**Honest limits:** eBay figures are asking-price percentiles (25th/median/75th), not sold prices. Discogs figures are marketplace lowest prices. At least 3 usable prices are required before an estimate is returned. Estimates are guidance only.

## License

MIT for the contents of this repository. The hosted API and website remain proprietary.
