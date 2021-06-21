const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

module.exports.getQualificationKeysArr = () => {
  return qualificationKeys.reduce((acc, key) => {
    acc.push(key.subjectKey);
    acc.push(key.institutionKey);
    return acc;
  }, []);
};

module.exports.getFormMonths = () => {
  return months.map((month, index) => {
    return {
      value: index + 1,
      name: month,
    };
  });
};

module.exports.getFormDays = () => {
  return new Array(31).fill(0).map((e, i) => i + 1);
};

module.exports.getFormYears = () => {
  const arr = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= currentYear - 80; i--) {
    arr.push(i);
  }
  return arr;
};

module.exports.capitalize = (str) => {
  if (!str || typeof str !== "string") {
    return str;
  } else {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
};

module.exports.formatTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  return `${hours}:${minutes} ${ampm}`;
};

module.exports.formatTimeSpent = (milli) => {
  let sec = Math.round((milli / 1000) % 60);
  let min = Math.round(milli / 1000 / 60);
  if (sec < 10) {
    sec = `0${sec}`;
  }
  if (min < 10) {
    min = `0${min}`;
  }
  return `${min} min ${sec} sec`;
};

module.exports.getYearSuffix = (date) => {
  return date.getFullYear().toString().substring(2, 4);
};

module.exports.formatDateString = (date) => {
  const day = String(date.getDate());
  const month = months[parseInt(date.getMonth()) % 12];
  let str = "";

  if (day.endsWith(0)) {
    str = "th";
  } else if (day.endsWith(2)) {
    str = "nd";
  } else if (day.endsWith(3)) {
    str = "rd";
  } else {
    str = "st";
  }

  return day + str + " " + month;
};

function getLabels(moduleScores) {
  return moduleScores.map((moduleScore) => moduleScore.name);
}

function getValues(moduleScores) {
  return moduleScores.map((moduleScore) => moduleScore.score);
}

module.exports.getChartData = function (userScore) {
  const data = {
    labels: getLabels(userScore.module_scores),
    datasets: [
      {
        label: userScore.assessment_name,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgb(54, 162, 235)",
        borderWidth: 1,
        data: getValues(userScore.module_scores),
      },
    ],
  };
  return JSON.stringify(data);
};
