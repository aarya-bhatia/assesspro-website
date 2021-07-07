/**
 * This migration will create the assessments without the modules list
 */

const { processCSV, initColumns } = require(".");
const { connect, connection } = require("../config/db.config");

const FILE = "resources/csv/Assessments.csv";
const { Assessment } = require("../models");

const Columns = initColumns(
  Array.from([
    "srNo",
    "category_key",
    "category_name",
    "name",
    "key",
    "plot_type",
    "price",
    "description",
  ])
);

const processRow = async function (row) {
  const data = {
    category_key: row[Columns.category_key],
    category_name: row[Columns.category_name],
    name: row[Columns.name],
    key: row[Columns.key],
    plot_type: row[Columns.plot_type],
    price: row[Columns.price],
    description: row[Columns.description],
  };

  const doc = await Assessment.create(data);
  console.log("Created assessment: ", doc);
};

connect();

connection.once("open", async () => {
  try {
    await processCSV(FILE, processRow);
  } catch (err) {
    console.log("ERROR RUNNING MIGRATIONS...", err);
  }
});
