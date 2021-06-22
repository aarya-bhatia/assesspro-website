require("../config/db.config").connect();

const { Module } = require("../models");

require("mongoose").connection.once("open", async () => {
  const doc = await Module.updateOne(
    { name: "English Comprehension" },
    {
      description: `How long do short-term memories last? They disappear very rapidly. However, you can prolong a memory by silently repeating it, a process called maintenance rehearsal. You have probably briefly remembered an address or telephone number this way. The more times a short-term memory is rehearsed, the greater its chances of being stored in LTM. In a sense, rehearsing information allows you to "see" it many times, not just once. 

What if rehearsal is prevented, so a memory can't be recycled? Without maintenance rehearsal, STM is incredibly short. In one experiment, people heard meaningless syllables like XAR followed by a number like 67. After they heard the number, subjects began counting backward by threes (so they couldn't repeat the syllable).After only 18 seconds of delay, their memory scores fell to zero.

        After 18 seconds without rehearsal, the short - term memories were gone forever! Keep this in mind when you get only one chance to hear important information.For example, if you are introduced to someone and the name slips out of STM, it's gone forever. Of course, you could try saying something like, "I'm curious, how do you spell your name ? " Unfortunately, the response is often an icy reply like, "B - O - B S - M - I - T - H, it's really not too difficult." To avoid embarrassment, pay careful attention to the name, repeat it to yourself several times, and try to use it in the next sentence or two-before you lose it. 
    Elaborative rehearsal, which makes information more meaningful, is a far better way to form lasting memories.Elaborative rehearsal links new information to memories that are already in LTM.When you are studying, you will remember more if you elaborate, extend, and think about information.As you read, try to frequently ask yourself "why" questions, such as, "Why would that be true?" Also, try to relate new ideas to your own experiences and knowledge.`,
    }
  );
  console.log(doc);
});
