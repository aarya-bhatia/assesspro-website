require('../config/db.config').connect()

const mongoose = require('mongoose')

const NEST_DESCRIPTION = `
The National Employability Skills Test (N.E.S.T.™) contains 92 questions divided into the following two sections:
SECTION 1 contains 40 questions and seeks to assess aspects of your personality which are relevant to the workplace and would help build a successful career.
SECTION 2 contains 52 questions designed to assess your aptitude and skills related to language and the industry:
•	Accuracy in English
•	English Comprehension
•	Verbal Reasoning
•	Abstract Reasoning
•	Logical Reasoning
•	Numerical Reasoning
All questions carry equal marks. 
There is no negative marking. 
Duration of the test is for 60 minutes.
`

mongoose.connection.once('open', async () => {

})