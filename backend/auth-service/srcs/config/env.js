import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
// console.log("meta ---> " + import.meta.url)
// console.log("file ---> " + fileURLToPath(import.meta.url))
// console.log("dir ---> " + __dirname)
dotenv.config({ path: resolve(__dirname, "../../.env") });
