import React from 'react'

import AskBot from '../bot.js'

import AnswersComponent from './answers.js'
import {MenuButtonContainer, CloseButtonContainer} from './menubutton.js'
import MenuComponent from './menu.js'
import ProgressBarComponent from './progressbar.js'
import QuestionComponent from './question.js'


export default class ContainerComponent extends React.Component {

  PAGE_QUESTION = 'question'
  PAGE_MENU = 'menu'
  LOCAL_STORAGE_KEY_PREFIX = 'session'

  constructor(props) {
    super(props)
    let questions = this.loadCSVData({containerID: 'questions'})
    let {session, sets} = this.loadSession()
    this.bot = new AskBot({questions, sets})
    this.bot.setSession(session)
    this.sets = this.bot.getSets()
    this.availableSets = this.bot.getAvailableSets()
    this.state = {
      page: this.PAGE_QUESTION,
      progress: this.bot.getProgress(),
      question: this.bot.getQuestion()
    }
  }

  getLocalStorageKey() {
    let key = window.location.pathname.replace(/\//g, '') || 'index'
    return `${this.LOCAL_STORAGE_KEY_PREFIX}-${key}`
  }

  parseCSV({csv, delimiter=','}){
    let pattern = new RegExp(
      (
        "(\\" + delimiter + "|\\r?\\n|\\r|^)" +
        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
        "([^\"\\" + delimiter + "\\r\\n]*))"
      ),
      "gi"
    )
    let lines = [[]]
    let matches = null
    while (matches = pattern.exec(csv)) {
      let matchedDelimiter = matches[1]
      if (matchedDelimiter.length && matchedDelimiter !== delimiter) {
        lines.push([])
      }
      let matchedValue
      if (matches[2]) {
        matchedValue = matches[2].replace(
          new RegExp("\"\"", "g"),
          "\""
        )
      } else {
        matchedValue = matches[3]
      }
      lines[lines.length - 1].push(matchedValue)
    }
    return lines
  }

  loadCSVData({containerID}) {
    let questionsDiv = document.getElementById(containerID)
    let dataURL = questionsDiv.getAttribute('data-url')
    if (dataURL) {
      let xmlhttp = new XMLHttpRequest()
      xmlhttp.overrideMimeType('text/csv')
      xmlhttp.open('GET', dataURL, false)
      xmlhttp.send()
      if (xmlhttp.status == '200') {
        return this.parseCSV({csv: xmlhttp.responseText})
      } else {
        console.log('Failed to open CSV file.')
      }
    }
    return this.parseCSV({csv: questionsDiv.innerHTML.trim()})
  }

  reset() {
    this.bot.reset({})
    this.bot.setSets(this.availableSets)
    this.saveSession()
    this.setState({
      progress: this.bot.getProgress()
    })
  }

  setSets(sets) {
    this.sets = this.bot.setSets(sets)
    this.setState({
      progress: this.bot.getProgress()
    })
    this.saveSession()
  }

  loadSession() {
    let rawData = localStorage.getItem(this.getLocalStorageKey())
    if (rawData != undefined) {
      return JSON.parse(rawData)
    }
    return {}
  }

  saveSession() {
    localStorage.setItem(this.getLocalStorageKey(), JSON.stringify({
      session: this.bot.getSession(),
      sets: this.sets
    }))
  }

  registerAnswer({qkey, answer}) {
    this.bot.registerAnswer({qkey, answer})
    this.saveSession()
  }

  nextQuestion() {
    this.setState({
      page: this.PAGE_QUESTION,
      progress: this.bot.getProgress(),
      question: this.bot.getQuestion()
    })
  }

  menuShow() {
    this.setState({
      page: this.PAGE_MENU
    })
  }

  menuHide() {
    this.nextQuestion()
  }

  render() {
    if (this.state.page == this.PAGE_QUESTION) {
      return <div style={{overflow: 'hidden'}}>
        <MenuButtonContainer onClick={this.menuShow.bind(this)} />
        <ProgressBarComponent progress={this.state.progress} />
        <QuestionComponent question={this.state.question} />
        <AnswersComponent
          question={this.state.question}
          registerAnswer={this.registerAnswer.bind(this)}
          nextQuestion={this.nextQuestion.bind(this)}
        />
      </div>
    } else {
      return <div>
        <CloseButtonContainer onClick={this.menuHide.bind(this)} />
        <ProgressBarComponent progress={this.state.progress} />
        <MenuComponent
          setSets={this.setSets.bind(this)}
          reset={this.reset.bind(this)}
          availableSets={this.availableSets}
          sets={this.sets}
        />
      </div>
    }
  }

}
