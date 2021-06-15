exports.create_plots = async function (candidate, assessment) {
  const image_filepath = get_image_filepath(candidate.name, assessment.name);
  const modules = await db.fetch_modules(assessment._id);
  const data = await get_plotter_data(candidate._id, modules);

  let averages = null;
  if (assessment.show_averages) {
    averages = await get_averages(assessment_id);
  }

  await run_plotter(
    candidate.name,
    data,
    image_filepath,
    assessment.plot_type,
    averages
  );
};

const get_image_filepath = function (candidate_name, assessment_name) {
  return `../resources/images/charts/${assessment_name}/${candidate_name}_${get_timestamp()}.png`;
};

const get_plotter_data = async function (candidate_id, modules) {
  let data = {};
  modules.map((module) => {
    const score = await fetch_module_score(candidate_id, module._id);
    data[module.name] = score;
  });
  return data;
};

const run_plotter = async function () {};
