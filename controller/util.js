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
    return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
  }
};

module.exports.formatTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  console.log(hours, minutes);
  const ampm = hours >= 12 ? "PM" : "AM";

  let h = hours > 12 ? hours - 12 : hours;

  if (h < 10) {
    h = `0${h}`;
  }

  let m = minutes % 60;
  if (m < 10) {
    m = `0${m}`;
  }

  return `${h}:${m} ${ampm}`;
};

module.exports.formatTimeSpent = (milli) => {
  let sec = Math.round((milli / 1000) % 60);
  let min = Math.round(milli / 1000 / 60);
  if (min > 0) {
    return `${min}m ${sec}s`;
  } else {
    return sec + "s";
  }
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

module.exports.shuffleOrder = function () {
  return 0.5 - Math.random();
};

module.exports.getOrSetRedisCache = function (CLIENT, key, callback) {
  return new Promise(function (resolve, reject) {
    CLIENT.get(key, async function (error, data) {
      if (error) {
        return reject(error);
      }
      if (data) {
        return resolve(JSON.parse(data));
      } else {
        const newData = await callback();
        CLIENT.setex(
          key,
          process.env.DEFAULT_EXPIRATION,
          JSON.stringify(newData)
        );
        resolve(newData);
      }
    });
  });
};

module.exports.buildSignupErrorObject = function (err) {
  const error = {};

  if (err.name === "ValidationError") {
    const { errors } = err;
    if (errors.name) {
      error.name = errors.name.message;
    }
    if (errors.email) {
      error.email = errors.email.message;
    }
    if (errors.password) {
      error.password = errors.password.message;
    }
  }

  error.other = err.message;

  return error;
};
