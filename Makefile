# zeronet: Server/CI-Only Makefile (maximum verbosity for debugging)

install:
	pnpm install --no-frozen-lockfile --reporter=ndjson --loglevel=verbose

build:
	pnpm build --loglevel=debug

test:
	pnpm test -- --verbose

lint:
	pnpm lint -- --max-warnings=0 --format=stylish

lint:py:
	flake8 apps/render-api

e2e:
	pnpm --filter web-app test:e2e -- --verbose

render-api:
	cd apps/render-api && uvicorn main:app --reload --host 0.0.0.0 --port 8000 --log-level debug

web-app:
	pnpm --filter web-app dev -- --port 3000

llm-download:
	mkdir -p models/ui-tars-7b && \
	curl -L -o models/ui-tars-7b/pytorch_model.bin "https://huggingface.co/ByteDance/UI-TARS-7B-DPO/resolve/main/pytorch_model.bin"

llm-server:
	pip install vllm==0.6.1
	python3 -m vllm.entrypoints.openai.api_server \
		--model ./models/ui-tars-7b \
		--served-model-name ui-tars \
		--port 9000 \
		--enable-openai-api

storybook:
	pnpm --filter web-app storybook

ci:
	make install
	make lint
	make lint:py
	make build
	make test
	make e2e
