const { UserScore } = require("../../models")
const router = require("express").Router();

const questions = [
  {
    id: 1,
    type: "text",
    content: [
      "Write the two missing numbers:",
      "8, 10, 14, 18, __, 34, 50, 66, __.",
      "Please enter a comma separated list of numbers without spaces, example: 2,3",
    ],
    answer: ["26,98"],
    points: 6,
  },
  {
    id: 2,
    type: "text",
    content: [
      "Write a 3-letter word that can be prefixed by each of the following letters:",
      "N, S, T, M, B, H, F",
    ],
    answer: ["AIL", "EAT"],
    points: 6,
  },
  {
    id: 3,
    type: "text",
    content: [
      "Write the 3 letter word that completes both the word starting with S and ending with K(clue: tie).",
      "S _ _ _ K",
    ],
    answer: ["TIC"],
    points: 6,
  },
  {
    id: 4,
    type: "text",
    content: ["Write the next letter in the series:", "E, H, L, O, S, _"],
    answer: ["V"],
    points: 6,
  },
  {
    id: 5,
    type: "choice",
    content: [
      "Write the word which goes with the three following words:",
      "BLOOD, GUARD, WORK?",
    ],
    options: ["LIFE", "OFFICE", "RED", "JAIL"],
    answer: ["LIFE"],
    points: 6,
  },
  {
    id: 6,
    type: "choice",
    content: ["Write which of these cities does not fit the rest?"],
    options: ["TOKYO", "LONDON", "NEW YORK", "NEW DELHI", "MOSCOW"],
    answer: ["NEW YORK"],
    points: 6,
  },
  {
    id: 7,
    type: "text",
    content: [
      "Write the four letter word missing from the brackets:",
      "WORKER, (ROAM), AMAZE",
      "TESTED, (_ _ _ _), OMEN",
    ],
    answer: ["SEEM"],
    points: 6,
  },
  {
    id: 8,
    type: "choice",
    content: [
      "Write which one of these has been famous but not as a politician?",
    ],
    options: ["NLNIE, TESNIIEN, HUNER, HERCHATT, UBHS"],
    answer: ["TESNIIEN", "EINSTEIN"],
    points: 6,
  },
  {
    id: 9,
    type: "text",
    content: [
      "Write the next two letters in the series:",
      "D, T, E, O, G, K, J, H, N, F, _, _.",
      "Please enter a comma separated list of letters without spaces, example: X,Y",
    ],
    answer: ["S,E"],
    points: 6,
  },
  {
    id: 10,
    type: "text",
    content: [
      "Write the last number in the following:",
      "2, 9, 3, 28, 4, 85, 5, _",
    ],
    answer: ["256"],
    points: 6,
  },
  {
    id: 11,
    type: "text",
    content: [
      "Four clues each are given. Your job is to choose the right word from the five given alternatives.",
      "CLUES: FOOT, HOES, KICK, PINCH",
    ],
    options: ["RIDER", "SHOE", "BALL", "SLIPPER", "CARRIAGE"],
    answer: ["SHOE"],
    points: 8,
  },
  {
    id: 12,
    type: "choice",
    content: [
      "Four clues each are given. Your job is to choose the right word from the five given alternatives.",
      "CLUES: PHRASE, POSITION, LINK, DESCENT",
    ],
    options: ["CHAIN", "LINE", "JOINT", "ROPE", "ANCESTOR"],
    answer: ["LINE"],
    points: 8,
  },
  {
    id: 13,
    type: "text",
    content: [
      "Four clues are given. You have to guess the word for which the given words are clues.",
      "CLUES: NEAR TABLE, LEADER, CARPENTER, SEE HAIR",
    ],
    answer: ["CHAIR"],
    points: 12,
  },
  {
    id: 14,
    type: "text",
    content: [
      "Four clues are given. You have to guess the word for which the given words are clues.",
      "CLUES: HERE, GIFT, INTRODUCE, EXHIBIT",
    ],
    answer: ["PRESENT"],
    points: 12,
  },
];

router.get("/", async (req, res) => {
  res.render("assessments/CCT.questions.ejs", {
    ...res.locals,
    user: req.user,
    questions,
  });
});

router.post("/submit", async (req, res) => {
  const user_id = req.user._id;
  const assessment_key = res.locals.user_assessment.assessment_key;

  let score = 0;

  for (const question of questions) {
    const value = req.body[question.id]
      ? req.body[question.id].trim().toUpperCase()
      : "";
    if (question.answer.find((answer) => answer === value)) {
      score+= question.points;
    }
  }

  const { assessment_id, assessment_name, assessment_plot_type } = res.locals.user_assessment;

  await UserScore.updateOne({user_id, assessment_key, assessment_id, assessment_name, plot_type: assessment_plot_type }, { score }, {upsert:true});

  res.json({ score });
});

router.post("/save", async (req, res) => {});
router.get("/report", async (req, res) => {});

module.exports = router;
