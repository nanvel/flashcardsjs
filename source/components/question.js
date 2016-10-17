import React from 'react'


export default class QuestionComponent extends React.Component {

  render() {
    let cardStyle = {
      position: 'absolute',
      top: '50%',
      width: '100%',
      textAlign: 'center',
      fontSize: '92px',
      lineHeight: '60px',
      marginTop: '-90px'
    }

    return <div style={ cardStyle }>{this.props.question.q}</div>
  }

}
