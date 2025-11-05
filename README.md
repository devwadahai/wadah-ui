# demo-bot-2

A Wadah agent (security: **minimal**).

## Quick Start

```bash
# Set your API key
export OPENAI_API_KEY="your-key-here"

# Run the agent
wadah run wadah.yaml --prompt "Hello!"

# Interactive mode
wadah run wadah.yaml --interactive
```

## Package & Distribute

```bash
# Build package
wadah pack -m wadah.yaml -o build/demo-bot-2.wpkg

# Run packaged agent
wadah run build/demo-bot-2.wpkg

# Push to registry
wadah push ghcr.io/username/demo-bot-2:0.1.0
```

## Security Level: minimal

⚠️  **No security restrictions** - Great for development!

- No budget limits
- No policy enforcement
- No tracing

**Warning**: Not recommended for production use.

## Documentation

- [Wadah Docs](https://wadah.ai/docs)
- [Security Plugins](https://wadah.ai/docs/plugins)
- [Examples](https://github.com/zenri/wadah/tree/main/templates)

## License

Apache 2.0
