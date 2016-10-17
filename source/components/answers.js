import React from 'react'


export default class AnswersComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      answered: undefined
    }
  }

  processAnswer(a) {
    if (this.state.answered == undefined) {
      this.props.registerAnswer({qkey: this.props.question.qkey, answer: a})
    }
    if (this.props.question.a == a) {
      this.setState({
        answered: undefined
      })
      this.props.nextQuestion()
    } else {
      this.setState({
        answered: a
      })
    }
  }

  render() {
    let rowStyle = {
      height: '60px'
    }

    let colStyle = {
      display: 'inline-block',
      width: '50%',
      lineHeight: '60px',
      textAlign: 'center',
      borderTop: '1px solid #eee',
      cursor: 'pointer',
      fontSize: '24px'
    }

    let col1Style = Object.assign({}, colStyle)
    col1Style['borderRight'] = '1px solid #eee'
    col1Style['marginLeft'] = '-1px'
    col1Style['color'] = '#ff0000'

    let rows = []
    let columns = []
    rows.push(
      <div style={rowStyle} key={'rowidk'}>
        <div style={col1Style} key={'idk'} onClick={this.processAnswer.bind(this, '')}>X</div>
      </div>
    )

    for (const i in this.props.question.options) {

      let option = this.props.question.options[i]

      let style = Object.assign({}, colStyle)
      if (i % 2 == 0) {
        style['borderRight'] = '1px solid #eee'
        style['marginLeft'] = '-1px'
      }
      if (this.state.answered != undefined) {
        if (this.state.answered == option.a) {
          style['backgroundColor'] = '#ffb9aa'
        }
        if (this.props.question.a == option.a) {
          style['backgroundColor'] = '#D4ee9f'
        }
      }

      columns.push(
        <div style={ style } key={option.qkey} onClick={this.processAnswer.bind(this, option.a)}>
          { option.a }
        </div>
      )

      if (columns.length >= 2) {
        rows.push(<div style={rowStyle} key={`row${i}`}>{columns}</div>)
        columns = []
      }
    }

    return <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0
    }}>
      { rows }
    </div>
  }

}
