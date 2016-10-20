import assert from 'assert'
import AskBot from './bot.js'


let questions, bot, question


/*
test next question is not the previous one
test availableSets, default set, set empty sets
test progress
*/

questions = [
  ['q1', 'a1'],
  ['q2', 'a2'],
  ['q3', 'a3']
]


bot = new AskBot({questions})

assert(bot.getQuestion().q == 'q1')
assert(bot.getQuestion().q == 'q2')
let availableSets = bot.getAvailableSets()
assert(availableSets.length == 1)
assert(availableSets[0] == 'default')
assert(bot.setSets([]).length == 1)

assert(bot.getProgress() == 0)
question = bot.getQuestion()
bot.registerAnswer({qkey: question.qkey, answer: question.a})
assert(bot.getProgress() == 3.33)

/*
test pool size
*/


questions = [
  ['q1', 'a1'],
  ['q2', 'a2'],
  ['q3', 'a3'],
  ['q4', 'a4'],
  ['q5', 'a5'],
  ['q6', 'a6'],
  ['q7', 'a7'],
  ['q8', 'a8'],
  ['q9', 'a9'],
  ['q10', 'a10'],
  ['q11', 'a11'],
  ['q12', 'a12']
]

bot = new AskBot({questions})
assert(questions.length > bot.PROGRESS_POOL_SIZE)

for (let i=0; i<15; i++) {
  let question = bot.getQuestion()
  bot.registerAnswer({qkey: question.qkey, answer: ''})
}

assert(Object.keys(bot.pool).length == bot.PROGRESS_POOL_SIZE)

bot.reset()
for (let i=0; i<15; i++) {
  let question = bot.getQuestion()
  bot.registerAnswer({qkey: question.qkey, answer: question.a})
}

assert(Object.keys(bot.pool).length > bot.PROGRESS_POOL_SIZE)
