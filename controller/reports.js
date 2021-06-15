const db = require("./db.controller");
const plotter = require("./plotter");

function get_report_filepath(candidate_name, assessment_name) {}
async function generate_report(name, image_filepath, report_filepath) {}
async function send_email_report(name, email, report_filepath) {}
async function send_plots_to_client(image_filepath) {}

async function create_and_send_report(candidate_id, assessment_id) {
  const candidate = await db.fetch_candidate(candidate_id);
  const assessment = await db.fetch_assessment(assessment_id);

  const report_filepath = get_report_filepath(candidate.name, assessment.name);

  await plotter.create_plots(candidate, assessment);

  await generate_report(candidate.name, image_filepath, report_filepath);
  await send_email_report(candidate.name, candidate.email, report_filepath);
  await send_plots_to_client(image_filepath);
}
