// aggregator.js
import { fetchDeviceBatch } from "./api.js";
import { sleep } from "./utils.js";

export async function aggregateDeviceData(serialNumbers) {
  const results = [];
  const BATCH_SIZE = 10;

  for (let i = 0; i < serialNumbers.length; i += BATCH_SIZE) {
    const batch = serialNumbers.slice(i, i + BATCH_SIZE);

    console.log(`Fetching batch ${i / BATCH_SIZE + 1}`);
    const data = await fetchDeviceBatch(batch);
    results.push(...data);

    // STRICT rate limit: 1 request per second
    await sleep(1000);
  }

  return results;
}
