# Ultra-Low-Latency Web Delivery Platform (Monorepo)

...

## 🧑‍💻 Zero Local Install – Everything Runs on Server/CI

**You never need to install anything locally!**

- **Codespaces or any devcontainer-supporting IDE:** Just open this repo; everything is built and runs in the cloud automatically.
- **CI/CD:** All install, build, test, deploy, LLM/Playwright/Storybook/CLI steps run from the cloud or via GitHub Actions.
- **Makefile commands:** All major operations are available as Make targets for easy scripting in any server environment.

### One-step cloud setup:

1. **Open in Codespaces or Dev Container**
2. **Run any target:**
   ```bash
   make web-app         # Start Next.js app on port 3000
   make render-api      # Start FastAPI backend on port 8000
   make storybook       # Launch storybook on port 6006
   make e2e             # End-to-end tests
   make llm-download    # Download the UI-TARS model artifact
   make llm-server      # Start local vLLM server for LLM-powered features
   ```

All installs, builds, and tests run in CI/CD and server environments by default.
...
