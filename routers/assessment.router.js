const fs = require("fs");
const path = require("path");
const { Assessment } = require("../models");
const { isAuth } = require("../controller/auth");
const { isEnrolled } = require("../controller/user.enroll");
const router = require("express").Router();

const assessments = ["CCT", "CDT", "CE", "CM", "CP", "CT", "NEST", "CPT", "SL"];

// module.exports = function () {
//   return new Promise(function (resolve, reject) {
//     Assessment.find({})
//       .then((assessments) => {
//         assessments.forEach((assessment) => {
//           const key = assessment.key;

//           console.log(key);

//           let file = `./assessments/${key}.router.js`;

//           if (key == "NEST" || key == "CPT") {
//             file = "./assessments/psychometric.router.js";
//           }

//           if (fs.existsSync(path.join(__dirname, file))) {
//             router.use("/" + key, [isAuth, isEnrolled(key)], require(file));

//             console.log(key, " router is initialised");
//           } else {
//             console.log(key, " could not be initialised");
//           }
//         });

//         resolve(router);
//       })
//       .catch((err) => {
//         reject(err);
//       });
//   });
// };

assessments.forEach((key) => {
  let file = `./assessments/${key.toLowerCase()}.router.js`;

  if (key == "NEST" || key == "CPT") {
    file = "./assessments/psychometric.router.js";
  }

  console.log(file);

  if (fs.existsSync(path.join(__dirname, file))) {
    router.use("/" + key, [isAuth, isEnrolled(key)], require(file));

    console.log(key, " router is initialised");
  } else {
    console.log(key, " could not be initialised");
  }
});

module.exports = router;
