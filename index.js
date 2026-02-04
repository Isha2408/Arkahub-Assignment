// index.js
console.log('Program started');
import { generateSerialNumbers } from "./utils.js";
import { aggregateDeviceData } from "./aggregator.js";

async function main() {
  try {
    const serialNumbers = generateSerialNumbers(500);
    console.log("Starting data aggregation...");

    const aggregatedData = await aggregateDeviceData(serialNumbers);

    console.log("Aggregation complete!");
    console.log("Total devices fetched:", aggregatedData.length);

    // Final aggregated report
    const report = {
      timestamp: new Date().toISOString(),
      totalDevices: aggregatedData.length,
      data: aggregatedData
    };

    console.log(JSON.stringify(report, null, 2));
  } catch (err) {
    console.error("Fatal error:", err.message);
  }
}

main();
