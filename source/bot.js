export default class AskBot {

  PROGRESS_POOL_SIZE = 10;
  OPTIONS_NUMBER = 4;
  PROGRESSION = [10, 15, 25, 50];
  CHOICE_RANDOMLY_EACH_N_TIME = 4;

  constructor({questions, sets}) {
    /*
    questions format: [[question, answer[ ,set=default]],...]
    */
    this.questions = []
    for (const i in questions) {
      let q = questions[i]
      if (q.length >= 2) {
        let question = {
          'q': q[0],
          'a': q[1]
        }
        if (q.length > 2) {
          question.s = q[2]
        } else {
          question.s = 'default'
        }
        question.qkey = question.s + ':' + question.q
        question.position = parseInt(i)
        this.questions.push(question)
      }
    }

    this.sets = sets || this.getAvailableSets()
    this.reset()
  }

  reset() {
    this.mood = 50
    this.pool = {}
    this.rightCount = 0
    this.wrongCount = 0
    this.previousQkey = ''
    this.questionCounter = 0
  }

  randomChoose(choices) {
    let index = Math.floor(Math.random() * choices.length)
    return choices[index]
  }

  randomInt(a, b) {
    return Math.floor(Math.random() * (b - a)) + a
  }

  randomShuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1
      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }
  }

  range100(value) {
    if (value < 0) {
      return 0
    } else if (value > 100) {
      return 100
    }
    return value
  }

  getAvailableSets() {
    let result = new Set()
    for (const i in this.questions) {
      let v = this.questions[i]
      result.add(v.s)
    }
    return Array.from(result)
  }

  getSets() {
    return this.sets
  }

  setSets(sets) {
    let availableSets = this.getAvailableSets()
    this.sets = sets.filter(i => availableSets.indexOf(i) != -1)
    if (!this.sets.length) {
      this.sets = this.getAvailableSets()
    }
    return this.sets
  }

  getSession() {
    let pool = {}
    for (const i in this.pool) {
      let v = this.pool[i]
      pool[i] = {
        qkey: v.qkey,
        rc: v.rightCount,
        wc: v.wrongCount,
        p: v.progress
      }
    }
    return {
      pool: pool
    }
  }

  setSession(session) {
    this.pool = {}
    if (session) {
      let pool = session.pool || {}
      for (const i in this.questions) {
        let v = this.questions[i]
        if (v.qkey in pool) {
          let q = Object.assign({}, v)
          q.rightCount = pool[q.qkey].rc
          q.wrongCount = pool[q.qkey].wc
          q.progress = pool[q.qkey].p
          this.pool[q.qkey] = q
        }
      }
    }
  }

  registerAnswer({qkey, answer}) {

    let isRight = (this.pool[qkey].a == answer)

    if (isRight) {
      this.rightCount += 1
      this.wrongCount = 0
      if (this.rightCount > this.PROGRESSION.length) {
        this.mood = 100
      } else {
        this.mood = this.range100(this.mood + this.PROGRESSION[this.rightCount - 1])
      }
    } else {
      this.wrongCount += 1
      this.rightCount = 0
      if (this.wrongCount > this.PROGRESSION.length) {
        this.mood = 0
      } else {
        this.mood = this.range100(this.mood - this.PROGRESSION[this.wrongCount - 1])
      }
    }

    if (qkey in this.pool) {
      let sq = this.pool[qkey]
      if (isRight) {
        sq.rightCount += 1
        sq.wrongCount = 0
        if (sq.rightCount > this.PROGRESSION.length) {
          sq.progress = 100
        } else {
          sq.progress = this.range100(sq.progress + this.PROGRESSION[sq.rightCount - 1])
        }
      } else {
        sq.wrongCount += 1
        sq.rightCount = 0
        if (sq.progress == 100) {
          sq.progress = 50
        }
        if (sq.wrongCount > this.PROGRESSION.length) {
          sq.progress = 0
        } else {
          sq.progress = this.range100(sq.progress - this.PROGRESSION[sq.wrongCount - 1])
        }

        // try to find the answer in pool
        for (const i in this.pool) {
          let v = this.pool[i]
          if (v.a == answer) {
            v.wrongCount += 1
            v.rightCount = 0

            if (v.progress == 100) {
              v.progress = 50
            }
            if (v.wrongCount > this.PROGRESSION.length) {
              v.progress = 0
            } else {
              v.progress = this.range100(v.progress - this.PROGRESSION[v.wrongCount - 1])
            }
          }
        }
      }

      this.previousQkey = qkey
    }

    return isRight
  }

  getProgress() {

    let questionsCount = 0
    for (const i in this.questions) {
      if (this.sets.indexOf(this.questions[i].s) != -1) {
        questionsCount += 1
      }
    }

    let learned = 0
    for (const i in this.pool) {
      let q = this.pool[i]
      if (this.sets.indexOf(q.s) != -1) {
        learned += q.progress
      }
    }

    if (questionsCount == 0) {
      return 0
    }

    return Math.round(learned / questionsCount * 100) / 100
  }

  getQuestion() {
    this.questionCounter += 1

    let less100 = 0

    for (const k in this.pool) {
      let v = this.pool[k]
      if (this.sets.indexOf(v.s) != -1 && v.progress < 100) {
        less100 += 1
      }
    }

    if (less100 < this.PROGRESS_POOL_SIZE) {
      let availableQuestions = this.questions.filter(q => (this.sets.indexOf(q.s) != -1) && !(q.qkey in this.pool))
      if (availableQuestions.length) {
        availableQuestions.sort((a, b) => (a.position - b.position))
        let newQuestion = Object.assign({}, availableQuestions[0])
        newQuestion.progress = 0
        newQuestion.wrongCount = 0
        newQuestion.rightCount = 0
        this.pool[newQuestion.qkey] = newQuestion
      }
    }

    let question = undefined

    if (this.questionsCount % this.CHOICE_RANDOMLY_EACH_N_TIME == 0) {
      /* just choice randomly */

      let poolQuestions = []
      for (const k in this.pool) {
        let v = this.pool[k]
        if (this.sets.indexOf(v.s) != -1 && v.qkey != this.previousQkey) {
          poolQuestions.push(v)
        }
      }

      question = this.randomChoose(poolQuestions)

    } else {

      let questionsEq100 = []
      let questionsLt100 = []

      for (const k in this.pool) {
        let v = this.pool[k]
        if (this.sets.indexOf(v.s) != -1 && v.qkey != this.previousQkey) {
          if (v.progress < 100) {
            questionsLt100.push(v)
          } else {
            questionsEq100.push(v)
          }
        }
      }

      questionsLt100.sort((a, b) => (a.progress - b.progress))

      if (this.mood > 50) {
        if (questionsLt100.length) {
          question = this.randomChoose(questionsLt100)
        } else {
          question = this.randomChoose(questionsEq100)
        }
      } else {
        if (questionsEq100.length) {
          question = this.randomChoose(questionsEq100)
        } else {
          question = questionsLt100[questionsLt100.length - 1]
        }
      }
    }

    let availableOptions = []
    for (const i in this.questions) {
      let q = this.questions[i]
      if (q.s == question.s && q.q != question.q) {
        availableOptions.push(q)
      }
    }

    let options = [question]

    for (let n=0; n < this.OPTIONS_NUMBER - 1; n++) {
      if (availableOptions.length) {
        let pos = this.randomInt(0, availableOptions.length - 1)
        let newOption = availableOptions.splice(pos, 1)[0]
        options.push(newOption)
      }
    }

    while (options.length < 4) {
      options.push({q: '-', a: '-', s: options[0].s})
    }

    this.randomShuffle(options)

    let result = Object.assign({}, question)
    result['options'] = options

    return result
  }

}
