const ConvergentScore = require("../../models/convergent.score")
const KeyValueResponse = require("../../models/key.value.response")
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
    scale: 6,
  },
  {
    id: 2,
    type: "text",
    content: [
      "Write a 3-letter word that can be prefixed by each of the following letters:",
      "N, S, T, M, B, H, F",
    ],
    answer: ["AIL", "EAT"],
    scale: 6,
  },
  {
    id: 3,
    type: "text",
    content: [
      "Write the 3 letter word that completes both the word starting with S and ending with K(clue: tie).",
      "S _ _ _ K",
    ],
    answer: ["TIC"],
    scale: 6,
  },
  {
    id: 4,
    type: "text",
    content: ["Write the next letter in the series:", "E, H, L, O, S, _"],
    answer: ["V"],
    scale: 6,
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
    scale: 6,
  },
  {
    id: 6,
    type: "choice",
    content: ["Write which of these cities does not fit the rest?"],
    options: ["TOKYO", "LONDON", "NEW YORK", "NEW DELHI", "MOSCOW"],
    answer: ["NEW YORK"],
    scale: 6,
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
    scale: 6,
  },
  {
    id: 8,
    type: "choice",
    content: [
      "Write which one of these has been famous but not as a politician?",
    ],
    options: ["NLNIE, TESNIIEN, HUNER, HERCHATT, UBHS"],
    answer: ["TESNIIEN", "EINSTEIN"],
    scale: 6,
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
    scale: 6,
  },
  {
    id: 10,
    type: "text",
    content: [
      "Write the last number in the following:",
      "2, 9, 3, 28, 4, 85, 5, _",
    ],
    answer: ["256"],
    scale: 6,
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
    scale: 8,
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
    scale: 8,
  },
  {
    id: 13,
    type: "text",
    content: [
      "Four clues are given. You have to guess the word for which the given words are clues.",
      "CLUES: NEAR TABLE, LEADER, CARPENTER, SEE HAIR",
    ],
    answer: ["CHAIR"],
    scale: 12,
  },
  {
    id: 14,
    type: "text",
    content: [
      "Four clues are given. You have to guess the word for which the given words are clues.",
      "CLUES: HERE, GIFT, INTRODUCE, EXHIBIT",
    ],
    answer: ["PRESENT"],
    scale: 12,
  },
];

router.get("/", async (req, res) => {
  const user_assessment = res.locals.user_assessment;
  const { assessment_key } = user_assessment;
  const user_id = req.user._id;

  // await KeyValueResponse.deleteMany({ user_id, assessment_key })

  let responses = await KeyValueResponse.find({ user_id, assessment_key })

  responses = responses.map(response=>{
    return {
      key: response.key,
      value: response.value
    }
  })

  res.render("assessments/CCT.questions.ejs", {
    ...res.locals,
    user: req.user,
    questions,
    responses: JSON.stringify(responses)
  });
});

async function saveResponses(req, res, next)
{
  const user_assessment = res.locals.user_assessment;
  const { assessment_key } = user_assessment;
  const user_id = req.user._id;

  for(const question of questions)
  {
    if(req.body[question.id])
    {
      const key = question.id
      const value = req.body[question.id] 

      const prevResponse = await KeyValueResponse.findOne({ user_id, assessment_key, key, value })

      if(prevResponse)
      {
        await KeyValueResponse.updateOne({ user_id, assessment_key, key, value })
      }
      else
      {
        await KeyValueResponse.create({
          user_id,
          assessment_key,
          key,
          value
        });
      }
    }
  }

  next();
}

router.post("/submit", saveResponses, async (req, res) => {
  let score = 0;

  for (const question of questions) {
    const value = req.body[question.id]
      ? req.body[question.id].trim().toUpperCase()
      : "";

    if (question.answer.find((answer) => answer === value)) {
      score += question.scale;
    }
  }

  const scoreObject = await ConvergentScore.create({
    user_id: req.user._id,
    score
  }) 

  res.json(scoreObject);
});

router.post("/save", saveResponses,async (req, res) => {
  res.redirect("/");
});

router.get("/report", async (req, res) => {});

module.exports = router;
