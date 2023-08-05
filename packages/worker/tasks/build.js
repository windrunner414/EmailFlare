import fs from "fs/promises";
import esbuild from "esbuild";
import { getStaticAssets } from "./assets.js";

const ASSETS = await getStaticAssets("../app/dist");

await fs.writeFile("./dist/index.ts", `
import app from "../app";
export const ASSETS = ${JSON.stringify(ASSETS)};

export default app(ASSETS);
`, "utf8");

// build API
await esbuild.build({
    bundle: true,
    minify: true,
    entryPoints: ["./dist/index.ts"],
    outfile: "./dist/index.bundle.js",
    format: "esm",
    target: "esnext",
    conditions: ["workerd"],
    external: ["node:*"],
    define: {
        "process.env.NODE_ENV": "\"production\""
    }
});

await fs.unlink("./dist/index.ts");
