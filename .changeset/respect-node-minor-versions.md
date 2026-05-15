---
"eslint-config-webpack": patch
---

Respect minor `engines.node` versions when picking the ES feature set. The node-to-ES mapping now lives in `configs/utils/get-es-version-from-node.js` and uses `semver` ranges, so `>=7.6` lands on ES2017 (async/await) instead of ES2016, and `>=16.11` lands on ES2022 (`Object.hasOwn`) instead of older 16.x ranges that lack it.
