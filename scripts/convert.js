const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

function slugify(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

const filesToConvert = [
  { csv: "CPU_UserBenchmarks.csv", json: "cpus.json" },
  { csv: "GPU_UserBenchmarks.csv", json: "gpus.json" },
  { csv: "RAM_UserBenchmarks.csv", json: "ram.json" },
  { csv: "SSD_UserBenchmarks.csv", json: "storage.json" }, // Assuming SSD as primary storage here for calculators
  { csv: "HDD_UserBenchmarks.csv", json: "hdd.json" },
  { csv: "USB_UserBenchmarks.csv", json: "usb.json" }
];

async function convertAll() {
  for (const file of filesToConvert) {
    const results = [];
    const csvPath = path.join(__dirname, "..", file.csv);
    const jsonPath = path.join(__dirname, "..", "data", file.json);
    
    if (!fs.existsSync(csvPath)) {
        console.log(`Skipping ${file.csv} - Not found`);
        continue;
    }

    await new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on("data", (data) => {
            // "Type","Part Number","Brand","Model","Rank","Benchmark","Samples","URL"
            const brand = (data.Brand || '').trim();
            const model = (data.Model || '').trim();
            const name = brand && model && !model.toLowerCase().startsWith(brand.toLowerCase()) 
                ? `${brand} ${model}` 
                : model;

            results.push({
                id: slugify(name),
                type: data.Type,
                partNumber: data["Part Number"],
                brand: brand,
                name: name,
                model: model,
                rank: parseInt(data.Rank) || 0,
                score: parseFloat(data.Benchmark) || 0,
                gamingScore: parseFloat(data.Benchmark) || 0, // Using Benchmark as gamingScore
                samples: parseInt(data.Samples) || 0,
                url: data.URL
            });
        })
        .on("end", () => {
          // Sort by score descending (or rank ascending)
          results.sort((a, b) => b.score - a.score);
          fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
          console.log(`Converted ${file.csv} -> ${file.json} (${results.length} records)`);
          resolve();
        })
        .on("error", reject);
    });
  }
}

convertAll().catch(console.error);
