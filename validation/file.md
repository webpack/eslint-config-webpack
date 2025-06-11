# Test

```js
const path = require("node:path");

console.log(path.resolve(__dirname, "./test"));

function run() {
	console.log("RUN");
}

run();
```

```js
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);

console.log(path.resolve(__dirname, "./test"));

function run() {
	console.log("RUN");
}

run();
```
