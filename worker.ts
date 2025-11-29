import { createEventHandler } from "@remix-run/cloudflare-workers";

import * as build from "./build/server/index.js";

addEventListener("fetch", createEventHandler({ build }))