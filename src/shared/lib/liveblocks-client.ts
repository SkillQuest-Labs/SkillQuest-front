import { createClient } from "@liveblocks/client";
import { liveblocksConfig } from "../config/liveblocks-config";

export const liveblocksClient = createClient({
  publicApiKey: liveblocksConfig.publicApiKey,
});
