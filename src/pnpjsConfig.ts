import { WebPartContext } from "@microsoft/sp-webpart-base";
import { spfi, SPFI, SPFx } from "@pnp/sp";
import { LogLevel, PnPLogging } from "@pnp/logging";

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/batching";

let _sp: SPFI | undefined; // Allow undefined as the initial value

export const getSP = (context?: WebPartContext): SPFI => {
  if (!_sp && context) {
    // Initialize the SPFI instance
    _sp = spfi().using(SPFx(context)).using(PnPLogging(LogLevel.Warning));
  }
  if (!_sp) {
    throw new Error("SPFI is not initialized. Ensure context is provided.");
  }
  return _sp;
};
