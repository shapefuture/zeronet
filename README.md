PLAN.MD

<?xml version="1.0" encoding="UTF-8"?>
<UltimatePlan version="4.1" project="Award-Winning Ultra-Low-Latency Web Delivery (AI-Driven, Cost-Conscious)">

  <Goal>Iteratively build and optimize a web application for near-zero perceived latency using cutting-edge, AI-driven techniques, prioritizing feasibility, autonomy, and free/open-source/free-tier solutions.</Goal>

  <TargetImplementer type="Autonomous AI Development Agent" example="Cursor" humanReviewRequired="true"/>

  <Principles>
    <Principle name="Agent-Centric">Steps designed for AI execution (code generation, config changes, CLI commands).</Principle>
    <Principle name="Human Oversight">Critical decisions, complex infrastructure, and AI output require human review prompts.</Principle>
    <Principle name="Cost-Optimized">Maximize free tiers (Cloudflare, Vercel, Netlify, PlanetScale, Neon, Supabase, GitHub Actions) & OSS.</Principle>
    <Principle name="LLM Flexibility">Utilize local VLM (UI-TARS via vLLM) or fallback to free/low-cost APIs (OpenRouter).</Principle>
    <Principle name="Iterative & Foundational">Prioritize core phases; advanced AI features built incrementally.</Principle>
    <Principle name="Tool Integration">Leverage UI-TARS, Midscene.js, Sa2VA for enhanced testing, analysis, interaction.</Principle>
    <Principle name="InfrastructureAsCode">Manage infrastructure via version-controlled configuration (Terraform, Pulumi, YAML).</Principle>
    <Principle name="Idempotency">Design agent actions to be runnable multiple times without adverse effects where feasible.</Principle>
    <Principle name="Security">Handle secrets securely (e.g., GitHub Secrets); perform dependency vulnerability checks.</Principle>
  </Principles>

  <!-- Phase 0: Strategic Architecture & Environment Setup -->
  <Phase id="0" name="Strategic Architecture & Environment Setup (Free Tier & OSS Focus)">
    <Goal>Establish foundational stack, select cost-effective platforms, set up dev environment, prepare local AI infrastructure.</Goal>

    <Task id="0.1" name="Select & Scaffold Core Stack" status="pending" ossFocus="true">
      <Detail>Components: Next.js (latest stable), FastAPI (Rust/Steel SDK), Tailwind CSS, Shadcn UI, Langchain.js, Vercel AI SDK.</Detail>
      <Action type="agentCommand">agent: scaffold_project --name web-app --template nextjs_tailwind_shadcn_langchain --init_git</Action>
      <Action type="agentCommand">agent: scaffold_project --name render-api --template fastapi_rust_steel --init_git</Action>
      <Action type="agentCommand">agent: setup_monorepo --structure <e.g.,_Turborepo_or_Nx> --projects web-app,render-api</Action> <!-- Added Monorepo Setup -->
    </Task>

    <Task id="0.2" name="Benchmark & Select Edge Compute Platform" status="pending" humanReview="true" ossFocus="true">
      <Detail>Evaluate: Cloudflare Workers (Priority), Vercel Edge, Netlify Edge, Deno Deploy.</Detail>
      <Action type="agentCommand">agent: benchmark_edge_platforms --targets cloudflare,vercel,netlify,deno --focus_metric free_tier_limits,p99_latency,cold_start,wasm_support --output reports/0.2_edge_platform_report.md</Action>
      <Action type="agentCommand">agent: prompt_human_review --decision "Select primary Edge Platform based on report: reports/0.2_edge_platform_report.md" --default "Cloudflare Workers" --output_variable selected_platform</Action>
    </Task>

    <Task id="0.3" name="Configure Network Protocols" status="pending">
      <Action type="agentCommand">agent: configure_cdn --provider {selected_platform} --enable_http3</Action>
      <Action type="agentCommand">agent: configure_tls --server {selected_platform} --tls_version 1.3</Action>
      <Note flag="warning">[!] 0-RTT has risks; enable only if essential and risks mitigated: `agent: configure_tls --server {selected_platform} --enable_zero_rtt`</Note>
    </Task>

    <Task id="0.4" name="Select Database Strategy" status="pending" humanReview="true" ossFocus="true">
      <Detail>Evaluate: PlanetScale, Neon, Supabase (Postgres), Cloudflare D1, Turso (SQLite Edge), self-hosted Redis/KeyDB/LiteFS.</Detail>
      <Action type="agentCommand">agent: research_databases --latency_goal "<20ms" --options planetscale_free,neon_free,supabase_free,cloudflare_d1,turso_free --criteria free_tier_limits,latency,region_availability,backup_policy --output reports/0.4_db_recommendation.md</Action>
      <Action type="agentCommand">agent: prompt_human_review --decision "Select Database/Caching solution based on report: reports/0.4_db_recommendation.md" --default "Cloudflare D1/Turso if edge-local needed, else Neon/PlanetScale" --output_variable selected_database</Action>
      <Action type="agentCommand">agent: provision_database --provider {selected_database} --config infra/db_config.tf --output_credentials db_credentials.json</Action> <!-- Added IaC step -->
      <Action type="agentCommand">agent: store_secret --name DATABASE_URL --value_from_file db_credentials.json</Action> <!-- Added Secrets step -->
    </Task>

    <Task id="0.5" name="Setup Development Environment & Automation" status="pending">
      <Action type="agentCommand">agent: create_file --path .env.local.template --content "<standard_dev_vars>"</Action>
      <Action type="agentCommand">agent: create_file --path .env.agent.template --content "VLM_PROVIDER=local_vllm\nVLM_ENDPOINT=http://127.0.0.1:8000/v1\nVLM_MODEL_NAME=ui-tars\nVLM_FALLBACK_PROVIDER=openrouter\nVLM_FALLBACK_MODEL=<openrouter_free_model_id>\nOPENROUTER_API_KEY=\n# Add other agent-specific vars"</Action>
      <Action type="agentCommand">agent: setup_dev_environment --use_template .env.local.template --populate_from_secrets</Action>
      <Action type="agentCommand">agent: create_script --name dev:agent --path scripts/agent_orchestrator.sh --purpose "Orchestrate build, test, snapshot generation, deploy" --language bash</Action>
      <Action type="agentCommand">agent: add_script_to_package_json --name agent:run --command "bash scripts/agent_orchestrator.sh"</Action>
    </Task>

    <Task id="0.6" name="Setup Local VLM Infrastructure (UI-TARS)" status="pending" ossFocus="true">
      <Note>Requires suitable local GPU or CI runner GPU. Fallback to OpenRouter defined in .env.agent.template.</Note>
      <Action type="agentCommand">agent: check_gpu_availability --required_vram 8GB</Action> <!-- Added Check -->
      <Action type="agentCommand">agent: install_package vllm --version ">=0.6.1"</Action>
      <Action type="agentCommand">agent: download_hf_model --model_id ByteDance/UI-TARS-7B-DPO --save_path ./models/ui-tars-7b --check_integrity</Action>
      <Action type="agentCommand">agent: configure_vllm_server --model ui-tars --model_path ./models/ui-tars-7b --served_model_name ui-tars --port 8000 --tp 1 --limit_mm_per_prompt image=5 --enable_openai_api --output_log vllm_server.log --run_detached</Action>
      <Action type="agentCommand">agent: verify_service_endpoint --url http://127.0.0.1:8000/v1/models --expected_response "ui-tars"</Action>
      <Action type="agentCommand">agent: update_readme --section "Local AI Setup" --content "Instructions for setting up vLLM with UI-TARS model."</Action> <!-- Added Docs -->
    </Task>

    <Task id="0.7" name="Initial Dependency Audit" status="pending" ossFocus="true">
        <Action type="agentCommand">agent: run_dependency_audit --project web-app --tool npm_audit</Action>
        <Action type="agentCommand">agent: run_dependency_audit --project render-api --tool cargo_audit</Action>
        <Action type="agentCommand">agent: report_vulnerabilities --threshold high --output reports/0.7_initial_audit.md</Action>
    </Task>

  </Phase>

  <!-- Phase 1: Foundational Build & Rendering Pipeline -->
  <Phase id="1" name="Foundational Build & Rendering Pipeline (OSS Tools)">
    <Goal>Establish core build, rendering, and caching using OSS tools.</Goal>

    <Task id="1.1" name="Optimize Build Tooling" status="pending" ossFocus="true">
      <Action type="agentCommand">agent: integrate_build_tool --tool esbuild --project web-app --config build_config.js --optimize_speed --minimize_output</Action>
      <Action type="agentCommand">agent: configure_bundler --tool esbuild --project web-app --enable_tree_shaking=aggressive --code_splitting=route_based --config build_config.js</Action>
      <Action type="agentCommand">agent: add_build_script_to_package_json --project web-app --name build:fast --command "node build_config.js"</Action>
    </Task>

    <Task id="1.2" name="Implement Dual Rendering Pipeline" status="pending">
      <Action type="agentCommand">agent: configure_nextjs_rendering --project web-app --mode streaming_ssr --fallback csr</Action>
      <Action type="agentCommand">agent: setup_fastapi_endpoint --project render-api --path /render_snapshot --method POST --request_model models/snapshot_request.py --response_model models/snapshot_response.py</Action>
      <Action type="agentCommand">agent: add_unit_test --project render-api --target /render_snapshot --framework pytest</Action> <!-- Added Test -->
    </Task>

    <Task id="1.3" name="Implement Atomic Critical CSS Inlining" status="pending" ossFocus="true">
      <Action type="agentCommand">agent: install_dev_dependency critical --project web-app</Action>
      <Action type="agentCommand">agent: create_build_script --project web-app --name generate_critical_css.js --language node --purpose "Extract critical CSS using 'critical' lib"</Action>
      <Action type="agentCommand">agent: configure_build_step --project web-app --script "node scripts/generate_critical_css.js" --trigger post_build --target_html "<output_dir>/**/*.html"</Action>
      <Action type="agentCommand">agent: verify_output --file "<output_dir>/index.html" --contains "<style id='critical-css'>"</Action> <!-- Added Verify -->
    </Task>

    <Task id="1.4" name="Implement Aggressive Service Worker Caching" status="pending" ossFocus="true">
      <Action type="agentCommand">agent: install_dependency @ducanh2912/next-pwa --project web-app</Action>
      <Action type="agentCommand">agent: configure_next_pwa --project web-app --config next.config.js --enable_sw --dest public</Action>
      <Action type="agentCommand">agent: configure_workbox --project web-app --config next.config.js --strategy cache_first_shell --precache_assets "<core_js,core_css,fonts>"</Action>
      <Action type="agentCommand">agent: configure_workbox_runtime_caching --project web-app --config next.config.js --route_pattern "/api/.*" --strategy StaleWhileRevalidate</Action>
      <Action type="agentCommand">agent: verify_workbox_config --project web-app --config next.config.js --check cache_invalidation_on_build</Action>
    </Task>
  </Phase>

  <!-- Phase 2: Hyper-Optimized Frontend Delivery -->
  <Phase id="2" name="Hyper-Optimized Frontend Delivery">
     <Goal>Achieve instantaneous perceived rendering and interaction using Binary DOM, Islands, Workers, and predictive loading.</Goal>

     <Task id="2.1" name="Adopt Binary DOM & Morph Engine" status="pending" ossFocus="true">
       <Action type="agentCommand">agent: research_binary_formats --options flatbuffers,protobuf,custom --criteria size,parse_speed,js_lib_support --output reports/2.1_format_recommendation.md</Action>
       <Action type="agentCommand">agent: select_binary_format --recommendation reports/2.1_format_recommendation.md --default flatbuffers --output_variable selected_format</Action>
       <Action type="agentCommand">agent: define_schema --format {selected_format} --name ui_snapshot_schema --output schemas/ui_snapshot.{fbs|proto|...}</Action>
       <Action type="agentCommand">agent: implement_serializer --project render-api --format {selected_format} --schema schemas/ui_snapshot.{fbs|proto|...} --input dom_tree --output binary_snapshot --add_tests</Action>
       <Action type="agentCommand">agent: implement_runtime_loader --project web-app --format {selected_format} --schema schemas/ui_snapshot.{fbs|proto|...} --input binary_snapshot|delta_patch --library nanomorph|custom --output dom_fragment|morphed_dom --add_tests</Action>
     </Task>

     <Task id="2.2" name="Implement Morphing & Skeleton Engine" status="pending">
       <Action type="agentCommand">agent: create_skeleton_loader --project web-app --source snapshot_metadata|initial_snapshot --show_animation</Action>
       <Action type="agentCommand">agent: integrate_morph_engine --project web-app --runtime_loader_module <loader_module_path> --trigger data_update|navigation</Action>
       <Action type="agentCommand">agent: add_e2e_test --project web-app --scenario "Verify UI morphs correctly on data update" --tool playwright</Action> <!-- Added Test -->
     </Task>

     <Task id="2.3" name="Integrate Islands Architecture" status="pending">
       <Action type="agentCommand">agent: establish_convention --type interactive_components --method filename --pattern "*.island.tsx"</Action>
       <Action type="agentCommand">agent: refactor_components_to_islands --project web-app --pattern "*.island.tsx" --move_interactive_logic</Action>
       <Action type="agentCommand">agent: configure_build_hydration --project web-app --mode islands --zero_js_static</Action>
       <Action type="agentCommand">agent: verify_bundle_analysis --project web-app --check "Static components have minimal/no JS"</Action> <!-- Added Verify -->
     </Task>

     <Task id="2.4" name="Implement Shallow Hydration" status="pending">
       <Action type="agentCommand">agent: verify_hydration_logic --project web-app --target interactive_islands_only --method code_analysis|runtime_check</Action>
     </Task>

     <Task id="2.5" name="Offload Logic to Web Workers" status="pending" ossFocus="true">
       <Action type="agentCommand">agent: identify_offload_candidates --project web-app --criteria "long_running_cpu_task,non_dom_blocking" --output reports/2.5_worker_candidates.md</Action>
       <Action type="agentCommand">agent: create_web_worker --project web-app --name data_processor_worker --use_comlink</Action>
       <Action type="agentCommand">agent: refactor_logic_to_worker --project web-app --module <candidate_module_path> --target_function <candidate_function_name> --worker data_processor_worker --use_comlink</Action>
       <Action type="agentCommand">agent: add_performance_test --project web-app --scenario "Compare main thread blocking before/after worker refactor"</Action> <!-- Added Test -->
     </Task>

     <Task id="2.6" name="Implement Lazy & Predictive Loading" status="pending">
       <Action type="agentCommand">agent: implement_lazy_loading --project web-app --target "img:not([data-priority]),iframe,div[data-lazy-component]" --method intersection_observer</Action>
       <Action type="agentCommand">agent: implement_prefetch_predictor --project web-app --initial_method "simple_route_analysis" --enhancement_llm <local_vlm|openrouter> --llm_provider $VLM_PROVIDER --llm_model $VLM_MODEL_NAME --fallback_provider $VLM_FALLBACK_PROVIDER --fallback_model $VLM_FALLBACK_MODEL --output predictor_module.ts</Action>
       <Action type="agentCommand">agent: implement_resource_prefetcher --project web-app --trigger predictor_module.predict() --resources js,data,snapshot</Action>
       <Action type="agentCommand">agent: add_analytics_event --project web-app --event prefetch_triggered --data "{predicted_resource, confidence}"</Action> <!-- Added Analytics -->
     </Task>

     <Task id="2.7" name="Leverage Speculative Prerendering API" status="pending">
       <Note>Browser support is limited; implement with graceful degradation.</Note>
       <Action type="agentCommand">agent: implement_speculative_prerendering --project web-app --trigger "predictor_module.predict()" --confidence_threshold 0.8 --check_browser_support</Action>
     </Task>

     <Task id="2.8" name="Optimize Font Loading" status="pending">
       <Action type="agentCommand">agent: install_dev_dependency fontmin|glyphhanger --project web-app</Action>
       <Action type="agentCommand">agent: subset_fonts --tool fontmin|glyphhanger --formats woff2 --unicode_range <auto_detect|critical_ranges> --input ./fonts_src --output ./public/fonts</Action>
       <Action type="agentCommand">agent: implement_foft_pattern --project web-app --css_file <global_css></Action>
       <Action type="agentCommand">agent: configure_css --project web-app --property font-display --value optional --selector "body"</Action>
       <Action type="agentCommand">agent: add_preload_link --project web-app --type font --href /fonts/<critical_font.woff2> --rel preload --as font --crossorigin</Action>
       <Action type="agentCommand">agent: verify_font_loading_strategy --tool webpagetest|lighthouse --check "FOIT avoided, LCP font loaded quickly"</Action> <!-- Added Verify -->
     </Task>
  </Phase>

  <!-- Phase 3: Intelligent Rendering & Edge Optimization (with Testing) -->
  <Phase id="3" name="Intelligent Rendering & Edge Optimization (with Testing)">
    <Goal>Enhance rendering with AI, leverage edge compute, establish robust automated testing.</Goal>

    <Task id="3.1" name="Implement AI-Guided DOM Optimization" status="pending">
      <Action type="agentCommand">agent: implement_dom_pruning --project render-api --method heuristic --target "[hidden], script[type='application/ld+json'], [data-test-id]"</Action>
      <Task id="3.1.1" name="Optional: LLM Layout Hints" status="experimental" ossFocus="true">
        <Action type="agentCommand">agent: enhance_snapshot_service --project render-api --feature compute_layout_hints --llm_provider $VLM_PROVIDER --llm_model $VLM_MODEL_NAME --fallback_provider $VLM_FALLBACK_PROVIDER --fallback_model $VLM_FALLBACK_MODEL --prompt "Analyze DOM, predict dimensions for elements matching selector '.async-content', output CSS hints."</Action>
        <Note>Requires careful prompt engineering and validation.</Note>
      </Task>
    </Task>

    <Task id="3.2" name="Ensure Deterministic Rendering & Delta Updates" status="pending">
      <Action type="agentCommand">agent: implement_deterministic_render --project render-api --seed_source build_id,content_hash --hash_algo sha256</Action>
      <Action type="agentCommand">agent: implement_snapshot_diffing --project render-api --algo binary_diff|structural_diff --input snapshot_v1,snapshot_v2 --output delta.patch --add_tests</Action>
    </Task>

    <Task id="3.3" name="Implement Edge-Side Data Aggregation/Filtering" status="pending">
      <Action type="agentCommand">agent: create_edge_function --provider {selected_platform} --name aggregateUserData --input_apis "/api/users/:id", "/api/users/:id/preferences" --output models/user_view_data.ts --language typescript --template edge_function_template.ts</Action>
      <Action type="agentCommand">agent: deploy_edge_function --provider {selected_platform} --name aggregateUserData --config infra/edge_functions.tf</Action> <!-- Added IaC -->
      <Action type="agentCommand">agent: update_frontend_fetch --project web-app --target /edge/aggregateUserData --old_targets /api/users/:id,...</Action>
    </Task>

    <Task id="3.4" name="Setup Visual Diff Regression Testing (CI)" status="pending" ossFocus="true">
      <Action type="agentCommand">agent: install_dev_dependency playwright pixelmatch --project web-app</Action>
      <Action type="agentCommand">agent: setup_ci_job --name visual_testing --config .github/workflows/ci.yaml --tool playwright --trigger pull_request</Action>
      <Action type="agentCommand">agent: add_ci_step --job visual_testing --name "Capture Screenshots" --command "npx playwright test --grep @visual" --output_artifact ./screenshots/pr</Action>
      <Action type="agentCommand">agent: add_ci_step --job visual_testing --name "Download Baseline" --command "gh artifact download -n screenshots-main -p ./screenshots/main || echo 'Baseline not found'"</Action> <!-- Added Baseline Handling -->
      <Action type="agentCommand">agent: add_ci_step --job visual_testing --name "Visual Diff" --tool pixelmatch --baseline ./screenshots/main --current ./screenshots/pr --output reports/visual_diff.json --threshold 0.05 --fail_on_diff</Action>
      <Action type="agentCommand">agent: add_ci_step --job visual_testing --name "Upload PR Screenshots" --command "gh artifact upload ./screenshots/pr -n screenshots-pr" --run_always</Action>
      <Action type="agentCommand">agent: add_ci_step --job visual_testing --name "Upload Baseline (on main)" --if_branch main --command "gh artifact upload ./screenshots/pr -n screenshots-main" --run_always</Action> <!-- Added Baseline Update -->
    </Task>

    <Task id="3.5" name="Add LLM Summary of Visual Diffs (CI)" status="pending">
      <Action type="agentCommand">agent: add_ci_step --job visual_testing --name "Summarize Visual Diff" --if_failure --llm_provider $VLM_PROVIDER --llm_model $VLM_MODEL_NAME --fallback_provider $VLM_FALLBACK_PROVIDER --fallback_model <free_summarization_model_id> --input reports/visual_diff.json[,diff_images_artifact] --prompt "Summarize visual changes based on diff report." --output_pr_comment</Action>
    </Task>

    <Task id="3.6" name="Optional R&D: Enhance Visual Diff with Semantic Analysis" status="experimental" ossFocus="true">
      <Note>Requires local Sa2VA setup or API access.</Note>
      <Action type="agentCommand">agent: setup_local_service --name sa2va --model_id ByteDance/Sa2VA-4B --port 8001</Action> <!-- Placeholder -->
      <Action type="agentCommand">agent: add_ci_step --job visual_testing --name "Semantic Visual Analysis" --if_failure --tool sa2va_client --endpoint http://localhost:8001 --input_artifact screenshots-baseline,screenshots-pr --output reports/semantic_diff.json</Action>
      <Action type="agentCommand">agent: modify_ci_step --step "Summarize Visual Diff" --input reports/visual_diff.json,reports/semantic_diff.json --prompt "Summarize visual and semantic changes based on reports."</Action>
    </Task>

    <Task id="3.7" name="Implement Automated Performance Regression Testing (CI)" status="pending" ossFocus="true">
       <Action type="agentCommand">agent: install_dev_dependency @lhci/cli --project web-app</Action>
       <Action type="agentCommand">agent: create_config_file --project web-app --name lighthouserc.json --content "<lhci_config_with_budgets>"</Action>
       <Action type="agentCommand">agent: setup_ci_job --name performance_testing --config .github/workflows/ci.yaml --tool lighthouse_ci --trigger pull_request</Action>
       <Action type="agentCommand">agent: add_ci_step --job performance_testing --name "Run Lighthouse CI" --command "lhci autorun --config=./web-app/lighthouserc.json --collect.url=$PREVIEW_URL" --fail_on_regression</Action>
       <Action type="agentCommand">agent: add_ci_step --job performance_testing --name "Upload Lighthouse Report" --command "lhci upload --target=temporary-public-storage || echo 'Upload failed'" --output_pr_comment</Action>
    </Task>
  </Phase>

  <!-- Phase 4: Advanced CDN, Caching & Network Optimization -->
  <Phase id="4" name="Advanced CDN, Caching & Network Optimization (Free Tier CDN)">
     <Goal>Minimize network latency, maximize cache hits using CDN, headers, edge prefetching.</Goal>

     <Task id="4.1" name="Configure Tiered Edge Caching" status="pending">
        <Action type="agentCommand">agent: configure_cdn_caching --provider {selected_platform} --config infra/cdn_config.tf --asset_types static,snapshot,api --ttl_strategy "short_edge_long_swr" --cache_rules "<rules>" --enable_tiered_cache</Action> <!-- Added IaC -->
        <Action type="agentCommand">agent: verify_sw_cache_policy --project web-app --align_with cdn_config infra/cdn_config.tf</Action>
     </Task>

     <Task id="4.2" name="Utilize Micro Cache Headers & Content Fingerprinting" status="pending">
        <Action type="agentCommand">agent: configure_server_headers --project render-api --path "/*" --headers "Cache-Control: public, s-maxage=1, stale-while-revalidate=86400"</Action>
        <Action type="agentCommand">agent: implement_etag_generation --project render-api --method content_hash --library hashlib|blake3</Action>
        <Action type="agentCommand">agent: verify_headers --url <deployed_render_api_url> --check_headers "Cache-Control, ETag"</Action> <!-- Added Verify -->
     </Task>

     <Task id="4.3" name="Enable Early Hints (103 Status Code)" status="pending">
        <Action type="agentCommand">agent: check_feature_support --provider {selected_platform} --feature early_hints</Action>
        <Action type="agentCommand">agent: configure_edge_server --provider {selected_platform} --config infra/edge_config.tf --enable_early_hints --critical_resources "</css/critical.css>; rel=preload; as=style", "</fonts/critical.woff2>; rel=preload; as=font; crossorigin"</Action>
     </Task>

     <Task id="4.4" name="Implement Basic Predictive Prefetching @ Edge" status="pending">
        <Action type="agentCommand">agent: implement_edge_prefetch_function --provider {selected_platform} --name predictivePrefetch --trigger analytics_event|client_signal --predictor <heuristic|api_call_to_predictor_module> --language typescript</Action>
        <Action type="agentCommand">agent: add_cdn_prefetch_logic --function predictivePrefetch --target edge_cache --method "fetch(url, { cf: { cacheTtl: 3600 } })" </Action> <!-- Example Cloudflare -->
        <Action type="agentCommand">agent: deploy_edge_function --provider {selected_platform} --name predictivePrefetch --config infra/edge_functions.tf</Action>
     </Task>

     <Task id="4.5" name="Implement Advanced Image/Media Optimization" status="pending" ossFocus="true">
        <Action type="agentCommand">agent: install_dev_dependency sharp --project web-app</Action>
        <Action type="agentCommand">agent: setup_image_optimization_build_step --project web-app --tool sharp --formats avif,webp --quality 75 --input_dir ./public/images_src --output_dir ./public/images</Action>
        <Action type="agentCommand">agent: update_image_references --project web-app --use_picture_element --formats avif,webp,original</Action> <!-- Added Best Practice -->
        <Alternative id="4.5.alt" name="Free Tier Image Service">
           <Action type="agentCommand">agent: research_image_service_free_tier --options cloudinary,imgix --limits request_count,bandwidth --output reports/4.5_image_service.md</Action>
           <Action type="agentCommand">agent: integrate_image_service_sdk --provider <chosen_service> --project web-app --api_key $IMAGE_SERVICE_KEY</Action>
        </Alternative>
     </Task>

     <Task id="4.6" name="Experimental: Basic Speculative Snapshot Compilation" status="experimental" ossFocus="true">
       <Action type="agentCommand">agent: identify_critical_flows --analytics_source <rum_data|google_analytics> --top_n 2 --output reports/4.6_critical_flows.json</Action>
       <Action type="agentCommand">agent: create_build_script --project web-app --name precompile_snapshots.sh --command "node scripts/snapshotctl_wrapper.js generate --flow {flow_id} --output_kv {flow_id}" --iterate_flows reports/4.6_critical_flows.json</Action>
       <Action type="agentCommand">agent: setup_kv_store --provider {selected_platform} --name speculative_snapshots --config infra/kv_store.tf</Action> <!-- Added IaC -->
       <Action type="agentCommand">agent: implement_kv_store_upload --script scripts/precompile_snapshots.sh --provider {selected_platform} --store speculative_snapshots --key "{flow_id}" --value_from_command</Action>
       <Action type="agentCommand">agent: implement_speculative_snapshot_retrieval --project web-app --trigger navigation --flows_from reports/4.6_critical_flows.json --source edge_kv --kv_store speculative_snapshots --fallback /render_snapshot --add_feature_flag speculative_snapshots_enabled</Action> <!-- Added Feature Flag -->
     </Task>
  </Phase>

  <!-- Phase 5: Developer Experience (DX) & Enhanced Agent Automation -->
  <Phase id="5" name="Developer Experience (DX) & Enhanced Agent Automation (with Self-Healing & Synthesis)">
     <Goal>Streamline dev, empower agent testing (UI-TARS/Midscene), implement self-healing.</Goal>

     <Task id="5.1" name="Develop Low/No Code UI Schema System" status="pending">
       <Action type="agentCommand">agent: define_ui_schema --format json --validator jsonschema --output schemas/ui_schema.json</Action>
       <Action type="agentCommand">agent: create_llm_prompt --name "NL_to_UI_Schema" --purpose "Convert natural language description to UI Schema JSON adhering to schemas/ui_schema.json" --llm_provider $VLM_PROVIDER --model <free_codegen_model_id> --output prompts/nl_to_ui_schema.txt</Action>
       <Action type="agentCommand">agent: implement_schema_renderer --project web-app --schema schemas/ui_schema.json --input_json <ui_data.json> --output_component <RenderedSchemaComponent></Action>
     </Task>

     <Task id="5.2" name="Build CLI & Build Bots" status="pending">
       <Action type="agentCommand">agent: create_cli_tool --name snapshotctl --path tools/snapshotctl --commands generate,diff,deploy_delta --language typescript --framework oclif</Action>
       <Action type="agentCommand">agent: verify_ci_job_outputs --jobs performance_testing,visual_testing --check pr_comment_posting_successful</Action>
     </Task>

     <Task id="5.3" name="Implement Auto-Patch Deploys (Delta Focused)" status="pending">
       <Action type="agentCommand">agent: modify_deploy_script --script scripts/deploy.sh --use_snapshot_delta --cli_command "node tools/snapshotctl/bin/run deploy_delta" --target {selected_platform}</Action>
       <Action type="agentCommand">agent: add_deployment_strategy --strategy "delta_first_then_full_on_failure"</Action> <!-- Added Strategy -->
     </Task>

     <Task id="5.4" name="Integrate Real-time Performance Feedback in IDE" status="pending">
       <Action type="agentCommand">agent: recommend_ide_extension --ide vscode --extensions "dbaeumer.vscode-eslint", "wix.vscode-import-cost"</Action>
       <Action type="agentCommand">agent: configure_linter --project web-app --config .eslintrc.js --add_ruleset "plugin:perf-standard/recommended"</Action>
     </Task>

     <Task id="5.5" name="Implement Self-Healing Stage 1: Automated Rollback (CI)" status="pending">
       <Action type="agentCommand">agent: define_rollback_thresholds --config .github/workflows/ci.yaml --visual_diff_severity high --perf_regression_metric lcp --perf_threshold 15% --error_rate_increase 5%</Action> <!-- Added Error Rate -->
       <Action type="agentCommand">agent: create_rollback_script --target {selected_platform} --method api_call|cli_command --get_previous_deployment_id</Action>
       <Action type="agentCommand">agent: configure_ci_pipeline --job deploy_main --on_failure trigger_rollback_script --condition "(visual_fail || perf_fail || error_rate_spike)" --config .github/workflows/ci.yaml</Action>
       <Action type="agentCommand">agent: add_notification --target slack|teams --event rollback_triggered --message "Automatic rollback initiated for deployment {deployment_id} due to regression."</Action> <!-- Added Notification -->
     </Task>

     <Task id="5.6" name="Implement Self-Healing Stage 2: LLM Regression Analysis (CI)" status="pending">
       <Action type="agentCommand">agent: add_ci_step --job analyze_failure --name "Analyze Regression" --trigger workflow_run(conclusion=failure) --llm_provider $VLM_PROVIDER --model $VLM_MODEL_NAME --fallback_provider $VLM_FALLBACK_PROVIDER --fallback_model <free_analysis_model_id> --input_artifacts "visual_diff_report,semantic_diff_report,perf_report" --prompt prompts/analyze_regression.txt</Action>
       <Action type="agentCommand">agent: create_llm_prompt --name "Analyze_Regression" --purpose "Analyze CI failure reports (visual, semantic, perf) to identify root cause and suggest fix area/component." --output prompts/analyze_regression.txt</Action>
       <Action type="agentCommand">agent: configure_ci_step_output --step "Analyze Regression" --output github_issue --title "Regression Detected: Build {build_num}" --labels "bug,regression,needs-review"</Action>
     </Task>

     <Task id="5.7" name="Implement Synthetic User Replay Stage 1 via Midscene.js (CI)" status="pending" ossFocus="true">
        <Action type="agentCommand">agent: install_npm_package @midscene/core @midscene/playwright @midscene/ui-tars-model-provider --project web-app</Action>
        <Action type="agentCommand">agent: create_config_file --project web-app --name midscene.config.js --content "module.exports = { modelProvider: '$VLM_PROVIDER', modelEndpoint: '$VLM_ENDPOINT', modelName: '$VLM_MODEL_NAME', fallbackProvider: '$VLM_FALLBACK_PROVIDER', fallbackModel: '$VLM_FALLBACK_MODEL' };"</Action>
        <Action type="agentCommand">agent: identify_critical_flows --analytics_source rum_data --top_n 5 --output reports/5.7_synthetic_flows.json</Action>
        <Action type="agentCommand">agent: generate_midscene_scenarios --flows_from reports/5.7_synthetic_flows.json --llm_provider openrouter --model <free_creative_model_id> --output tests/e2e/midscene_scenarios.yaml</Action>
        <Action type="agentCommand">agent: implement_midscene_runner --project web-app --path tests/e2e/run_midscene.ts --scenarios tests/e2e/midscene_scenarios.yaml --browser chromium --config midscene.config.js</Action>
        <Action type="agentCommand">agent: setup_ci_job --name synthetic_user_testing --config .github/workflows/ci.yaml --tool midscene --command "npm run test:midscene" --trigger pull_request|schedule</Action>
        <Action type="agentCommand">agent: enhance_midscene_runner --path tests/e2e/run_midscene.ts --enable_cwv_measurement --metrics LCP,CLS,INP --enable_tracing --output_report midscene_report.html</Action>
        <Action type="agentCommand">agent: configure_ci_job_reporting --job synthetic_user_testing --upload_artifact midscene_report.html --post_summary</Action>
     </Task>
  </Phase>

  <!-- Phase 6: Continuous Monitoring, Feedback & Optimization Loop -->
  <Phase id="6" name="Continuous Monitoring, Feedback & Optimization Loop (OSS/Free Tier Focus)">
     <Goal>Establish monitoring, feed AI loop for optimization, validate automated actions.</Goal>

     <Task id="6.1" name="Implement Comprehensive RUM" status="pending" ossFocus="true">
       <Action type="agentCommand">agent: choose_rum_solution --options "openobserve_cloud_free,signoz_oss,highlight_io_oss,posthog_oss" --criteria "free_tier_limits,self_host_option,tracing_integration" --output_variable chosen_rum_solution</Action>
       <Action type="agentCommand">agent: integrate_rum_sdk --project web-app --solution {chosen_rum_solution} --metrics lcp,cls,inp,ttfb,navigation,resource,error --config rum_config.js</Action>
       <Action type="agentCommand">agent: configure_rum_segmentation --config rum_config.js --dimensions device,geo,connection,version,user_id,ab_variant</Action>
       <Action type="agentCommand">agent: setup_rum_backend --solution {chosen_rum_solution} --config infra/rum_backend.tf</Action> <!-- Added IaC -->
     </Task>

     <Task id="6.2" name="Setup End-to-End Distributed Tracing (OSS)" status="pending" ossFocus="true">
       <Action type="agentCommand">agent: setup_opentelemetry_frontend --project web-app --sdk @opentelemetry/sdk-trace-web --propagator W3CTraceContextPropagator --exporter <chosen_rum_solution_collector_url|otel_collector_url></Action>
       <Action type="agentCommand">agent: setup_opentelemetry_backend --project render-api --sdk opentelemetry-python|rust --exporter <chosen_rum_solution_collector_url|otel_collector_url></Action>
       <Action type="agentCommand">agent: verify_trace_propagation --scenario "Full user request from frontend through render-api to DB" --check "Single trace ID links all spans"</Action> <!-- Added Verify -->
     </Task>

     <Task id="6.3" name="Build AI-Powered Optimization Suggestion Engine (Basic)" status="pending">
        <Action type="agentCommand">agent: setup_scheduled_job --name analyze_perf_data --frequency weekly --runner github_actions --config .github/workflows/scheduler.yaml</Action>
        <Action type="agentCommand">agent: implement_data_query_script --path scripts/analyze_perf.py --language python --source rum_api,ci_reports --metrics slowest_routes_p95,high_inp_pages,recent_perf_regressions</Action>
        <Action type="agentCommand">agent: implement_llm_analysis --script scripts/analyze_perf.py --llm_provider $VLM_PROVIDER --model <free_analysis_model_id> --fallback_provider $VLM_FALLBACK_PROVIDER --prompt prompts/suggest_optimizations.txt</Action>
        <Action type="agentCommand">agent: create_llm_prompt --name "Suggest_Optimizations" --purpose "Analyze weekly RUM/CI data summaries. Identify top 3 performance bottlenecks or regressions. Suggest specific components/routes/APIs to investigate." --output prompts/suggest_optimizations.txt</Action>
        <Action type="agentCommand">agent: implement_issue_creation --script scripts/analyze_perf.py --tool github_api --output github_issue --labels "performance,ai-suggestion,needs-triage"</Action>
     </Task>

     <Task id="6.4" name="Implement Basic Performance A/B Testing Framework" status="pending">
        <Action type="agentCommand">agent: setup_ab_testing_routing --method edge_function --provider {selected_platform} --config infra/ab_test_router.ts --granularity user_percentage --cookie_name ab_variant</Action>
        <Action type="agentCommand">agent: modify_rum_instrumentation --config rum_config.js --add_dimension ab_test_variant --read_from_cookie ab_variant</Action>
        <Action type="agentCommand">agent: create_ab_test_analysis_dashboard --tool <rum_provider_dashboard|grafana> --source rum_data --group_by ab_test_variant --metrics LCP,INP,CLS,ConversionRate</Action> <!-- Added Conversion -->
     </Task>

     <Task id="6.5" name="Validate Self-Healing & Synthetic Test Effectiveness" status="pending">
        <Action type="agentCommand">agent: create_monitoring_dashboard --tool <rum_provider_dashboard|grafana> --name Post_Rollback_Validation --filter "event.type=deployment event.status=rollback" --metrics LCP,INP,ErrorRate --timeframe "past 6 hours" --alert_condition "p95(LCP) > previous_day_p95"</Action>
        <Action type="agentCommand">agent: implement_correlation_analysis --script scripts/analyze_test_coverage.py --language python --source midscene_report.html,rum_errors --match_criteria "url,error_message" --output reports/6.5_test_coverage_report.md</Action>
        <Action type="agentCommand">agent: schedule_job --name update_test_coverage_report --frequency daily --command "python scripts/analyze_test_coverage.py"</Action>
     </Task>
  </Phase>

  <!-- Phase 7: Advanced Experimental & Future Research -->
  <Phase id="7" name="Advanced Experimental & Future Research (Long Term)">
     <Goal>Explore bleeding-edge concepts via agent-assisted research.</Goal>

     <Task id="7.1" name="Research: Shared Memory DOM Teleportation" status="experimental">
        <Action type="research">agent: research_shared_worker_dom --keywords "SharedWorker state management", "SharedArrayBuffer DOM", "cross-navigation performance" --output reports/7.1_feasibility_report_dom_teleport.md</Action>
     </Task>
     <Task id="7.2" name="Research: WASM Microservices @ Edge" status="experimental">
        <Action type="research">agent: research_wasm_edge_deployment --provider {selected_platform} --keywords "WebAssembly Cloudflare Workers performance", "Rust WASM edge compute" --output reports/7.2_wasm_edge_feasibility.md</Action>
     </Task>
     <Task id="7.3" name="Research: Off-Main-Thread Painting Simulation" status="experimental">
        <Action type="research">agent: research_wasm_rendering --library canvaskit,skia_wasm,webgpu_compute --keywords "OffscreenCanvas WASM render", "WebGPU UI rendering worker" --output reports/7.3_omt_paint_research.md</Action>
     </Task>
     <Task id="7.4" name="Research: Profile-Guided Optimization (PGO) for JS/WASM" status="experimental">
        <Action type="research">agent: research_pgo_toolchains --target v8,wasm --keywords "V8 PGO", "WebAssembly PGO", "profile guided optimization javascript" --output reports/7.4_pgo_feasibility.md</Action>
     </Task>
     <Task id="7.5" name="Research: WebGPU for General Purpose Compute (GPGPU)" status="experimental">
        <Action type="research">agent: research_webgpu_gpgpu --keywords "WebGPU compute shaders examples", "GPGPU browser performance" --identify_potential_tasks_in_project --output reports/7.5_webgpu_compute_potential.md</Action>
     </Task>
     <Task id="7.6" name="Research: Compute Pressure API Adaptation" status="experimental">
        <Action type="research">agent: research_compute_pressure_api --keywords "Compute Pressure API MDN", "browser support compute pressure", "adaptive web performance" --output reports/7.6_compute_pressure_strategy.md</Action>
     </Task>
     <Task id="7.7" name="Research: Self-Healing Stage 3: LLM Suggested Patches" status="experimental">
        <Action type="research">agent: research_llm_code_patching --input "diff_reports,semantic_diff,perf_regression" --keywords "LLM automated code repair", "VLM visual regression fix", "AI code patching safety" --output reports/7.7_llm_patching_feasibility.md</Action>
     </Task>
     <Task id="7.8" name="Research: Speculative AI Compiler Stage 2: Multi-Step Prediction" status="experimental">
        <Action type="research">agent: research_multi_step_ui_prediction --data_source analytics,rum --keywords "user flow prediction model", "Markov chain web navigation", "speculative execution web UI" --output reports/7.8_speculative_compiler_v2_research.md</Action>
     </Task>
     <Task id="7.9" name="Research: Synthetic User Replay Stage 2: Agent-Based Exploration" status="experimental">
        <Action type="research">agent: research_ai_agent_testing --models ui-tars --framework midscene.js --keywords "goal-oriented UI agent", "reinforcement learning web testing", "autonomous web agent exploration" --output reports/7.9_synthetic_agent_v2_research.md</Action>
     </Task>
  </Phase>

  <ExecutionNotes>
    <Note level="info">Agent should parse this XML plan and execute tasks sequentially within phases, respecting dependencies.</Note>
    <Note level="info">Use task status attributes (`pending`, `completed`, `experimental`) to track progress.</Note>
    <Note level="critical">Prompt human review explicitly using `agent: prompt_human_review` for tasks marked `humanReview="true"` or when encountering ambiguity or significant infrastructure/cost implications.</Note>
    <Note level="warning">Monitor free tier resource limits (compute, storage, invocations, DB rows). Implement fallbacks (e.g., OpenRouter for LLM) or notify human if limits risk being exceeded.</Note>
    <Note level="info">Default to configured local VLM (UI-TARS via vLLM). Use configured fallback (OpenRouter) for non-visual tasks or if local VLM is unavailable.</Note>
    <Note level="info">Prefer OSS libraries/tools where functionality meets requirements (`ossFocus="true"` tasks).</Note>
    <Note level="best_practice">Manage infrastructure changes via IaC files (e.g., Terraform in `./infra/`). Agent should generate/modify these files.</Note>
    <Note level="best_practice">Implement significant new features (especially experimental `[!]` tasks) behind feature flags.</Note>
    <Note level="critical">Implement robust error handling for agent actions. Attempt reasonable retries (e.g., network requests) and report persistent failures clearly for human intervention, logging actions and outcomes.</Note>
    <Note level="best_practice">Ensure generated code includes comments, follows project style guides, and includes appropriate unit/integration tests.</Note>
    <Note level="best_practice">Update project README and relevant documentation as new features/tools are integrated.</Note>
  </ExecutionNotes>

</UltimatePlan>




<p align="center">
  <img alt="Midscene.js"  width="260" src="https://github.com/user-attachments/assets/f60de3c1-dd6f-4213-97a1-85bf7c6e79e4">
</p>

<h1 align="center">Midscene.js</h1>
<div align="center">

English | [简体中文](./README.zh.md)

</div>

<p align="center">
  Let AI be your browser operator.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@midscene/web"><img src="https://img.shields.io/npm/v/@midscene/web?style=flat-square&color=00a8f0" alt="npm version" /></a>
  <a href="https://huggingface.co/bytedance-research/UI-TARS-7B-SFT"><img src="https://img.shields.io/badge/%F0%9F%A4%97-UI%20TARS%20Models-yellow" alt="huagging face model" /></a>
  <a href="https://npm-compare.com/@midscene/web/#timeRange=THREE_YEARS"><img src="https://img.shields.io/npm/dm/@midscene/web.svg?style=flat-square&color=00a8f0" alt="downloads" /></a>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square&color=00a8f0" alt="License" />
  <a href="https://discord.gg/2JyBHxszE4"><img src="https://img.shields.io/discord/1328277792730779648?style=flat-square&color=7289DA&label=Discord&logo=discord&logoColor=white" alt="discord" /></a>
  <a href="https://x.com/midscene_ai"><img src="https://img.shields.io/twitter/follow/midscene_ai?style=flat-square" alt="twitter" /></a>
</p>

FORK OF MIDSCENE ={

Midscene.js lets AI be your browser operator 🤖.Just describe what you want to do in natural language, and it will help you operate web pages, validate content, and extract data. Whether you want a quick experience or deep development, you can get started easily.


## Showcases

The following recorded example video is based on the [UI-TARS 7B SFT](https://huggingface.co/bytedance-research/UI-TARS-7B-SFT) model, and the video has not been sped up at all~

| Instruction  | Video |
| :---:  | :---: |
| Post a Tweet      |    <video src="https://github.com/user-attachments/assets/bb3d695a-fbff-4af1-b6cc-5e967c07ccee" height="300" />    |
| Use JS code to drive task orchestration, collect information about Jay Chou's concert, and write it into Google Docs   | <video src="https://github.com/user-attachments/assets/75474138-f51f-4c54-b3cf-46d61d059999" height="300" />        |


## 📢 New open-source model choice - UI-TARS and Qwen2.5-VL

Besides the default model *GPT-4o*, we have added two new recommended open-source models to Midscene.js: *UI-TARS* and *Qwen2.5-VL*. (Yes, Open Source !) They are dedicated models for image recognition and UI automation, which are known for performing well in UI automation scenarios. Read more about it in [Choose a model](https://midscenejs.com/choose-a-model).

## 💡 Features
- **Natural Language Interaction 👆**: Just describe your goals and steps, and Midscene will plan and operate the user interface for you.
- **Chrome Extension Experience 🖥️**: Start experiencing immediately through the Chrome extension, no coding required.
- **Puppeteer/Playwright Integration 🔧**: Supports Puppeteer and Playwright integration, allowing you to combine AI capabilities with these powerful automation tools for easy automation.
- **Support Open-Source Models 🤖**: Supports private deployment of [`UI-TARS`](https://github.com/bytedance/ui-tars) and [`Qwen2.5-VL`](https://github.com/QwenLM/Qwen2.5-VL), which outperforms closed-source models like GPT-4o and Claude in UI automation scenarios while better protecting data security.
- **Support General Models 🌟**: Supports general large models like GPT-4o and Claude, adapting to various scenario needs.
- **Visual Reports for Debugging 🎞️**: Through our test reports and Playground, you can easily understand, replay and debug the entire process.
- **Support Caching 🔄**: The first time you execute a task through AI, it will be cached, and subsequent executions of the same task will significantly improve execution efficiency.
- **Completely Open Source 🔥**: Experience a whole new automation development experience, enjoy!
- **Understand UI, JSON Format Responses 🔍**: You can specify data format requirements and receive responses in JSON format.
- **Intuitive Assertions 🤔**: Express your assertions in natural language, and AI will understand and process them.

## ✨ Model Choices

- You can use general-purpose LLMs like `gpt-4o`, it works well for most cases. And also, `gemini-1.5-pro`, `qwen-vl-max-latest` are supported.
- You can also use [`UI-TARS`](https://github.com/bytedance/ui-tars) model, which is an **open-source model** dedicated for UI automation. You can deploy it on your own server, and it will dramatically improve the performance and data privacy. 
- Read more about [Choose a model](https://midscenejs.com/choose-a-model)

## 👀 Comparing to ...

There are so many UI automation tools out there, and each one seems to be all-powerful. What's special about Midscene.js?

* Debugging Experience: You will soon find that debugging and maintaining automation scripts is the real challenge point. No matter how magic the demo is, you still need to debug the process to make it stable over time. Midscene.js offers a visualized report file, a built-in playground, and a Chrome Extension to debug the entire process. This is what most developers really need. And we're continuing to work on improving the debugging experience.

* Open Source, Free, Deploy as you want: Midscene.js is an open-source project. It's decoupled from any cloud service and model provider, you can choose either public or private deployment. There is always a suitable plan for your business.

* Integrate with Javascript: You can always bet on Javascript 😎

## 📄 Resources 

* [Home Page: https://midscenejs.com](https://midscenejs.com/)
* [Quick Experience By Chrome Extension](https://midscenejs.com/quick-experience.html), this is where you should get started 
* Integration
  * [Automate with Scripts in YAML](https://midscenejs.com/automate-with-scripts-in-yaml.html), use this if you prefer to write YAML file instead of code
  * [Bridge Mode by Chrome Extension](https://midscenejs.com/bridge-mode-by-chrome-extension.html), use this to control the desktop Chrome by scripts
  * [Integrate with Puppeteer](https://midscenejs.com/integrate-with-puppeteer.html)
  * [Integrate with Playwright](https://midscenejs.com/integrate-with-playwright.html)
* [API Reference](https://midscenejs.com/api.html)
* [Choose a model](https://midscenejs.com/choose-a-model.html)
* [Config Model and Provider](https://midscenejs.com/model-provider.html)

## 🤝 Community

* [Discord](https://discord.gg/2JyBHxszE4)
* [Follow us on X](https://x.com/midscene_ai)
* [Lark Group](https://applink.larkoffice.com/client/chat/chatter/add_by_link?link_token=291q2b25-e913-411a-8c51-191e59aab14d)


## Citation

If you use Midscene.js in your research or project, please cite:

```bibtex
@software{Midscene.js,
  author = {Zhou, Xiao and Yu, Tao},
  title = {Midscene.js: Let AI be your browser operator.},
  year = {2025},
  publisher = {GitHub},
  url = {https://github.com/web-infra-dev/midscene}
}
```


}