# Private tracking scraper. Reviewed source:
# https://github.com/plhery/universal-parcel-scraper/commit/80d71f91f705068b523759b0e8598b3dc5e13c9e
# Published npm package matching that line: universal-parcel-scraper@0.1025.0-main.5567
# (2026-11-08). GHCR has no tag for 0.1025.0. The newest stable image is
# ghcr.io/plhery/universal-parcel-scraper:0.637.1 (git v0.637.1 / 611c16879f47),
# which is older than the API this app calls. Do not float the version.
FROM node:26.12.1-trixie-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends chromium ca-certificates tini \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN npm install --ignore-scripts --omit=dev --no-fund --no-audit \
      universal-parcel-scraper@0.1025.0-main.5567 \
      playwright-core@1.63.0 \
      sharp@0.35.5 \
      onnxruntime-web@1.30.0 \
    && npm cache clean --force

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=8080 \
    TRACKING_CHROMIUM_PATH=/usr/bin/chromium \
    SCRAPER_PROVIDERS= \
    SCRAPER_DEMO_PAGE=false \
    SCRAPER_RATE_LIMIT=30 \
    SCRAPER_MAX_CONCURRENT=2 \
    SCRAPER_TRUSTED_PROXIES=0

USER node
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+process.env.PORT+'/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "node_modules/universal-parcel-scraper/dist/cli/index.js", "serve"]
