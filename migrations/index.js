const fs = require("fs");
const csvReader = require("csv-reader");

const options = {
  parseNumbers: true,
  trim: true,
  skipHeader: false,
  skipEmptyLines: true,
};

function onStart() {
  console.log("STARTING MIGRATIONS");
  console.log("============================================");
}

function onEnd() {
  console.log("FINISHED MIGRATIONS");
  console.log("============================================");
}

function onError() {
  console.log("Error Processing Row: ", err);
}

module.exports.initColumns = (names) => {
  const cols = {};
  names.map((name, index) => {
    cols[name] = index;
  });
  return cols;
};

module.exports.processCSV = (FILE, processRow, _options = options) => {
  const parser = new csvReader();
  const stream = fs.createReadStream(FILE, "utf8");

  onStart();

  let c = 0;

  stream
    .pipe(parser)
    .on("data", async (row) => {
      if (c > 0) {
        parser.pause();
        await processRow(row);
        parser.resume();
      }
      c++;
      console.log("Rows processed: ", c);
    })
    .on("end", () => {
      console.log("Rows processed: ", c);
      onEnd();
    })
    .on("error", (err) => {
      console.log("Rows processed: ", c);
      onError();
    });
};
