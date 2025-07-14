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
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);

console.log(path.resolve(__dirname, "./test"));

function run() {
	console.log("RUN");
}

run();
```

```js
new URL("./test");
```
