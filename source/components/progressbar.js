import React from 'react'


export default class ProgressBarComponent extends React.Component {

  render() {

    let barStyle = {
      backgroundColor: '#eeeeee',
      height: '45px',
      position: 'absolute',
      top: 0,
      right: 0,
      left: '55px'
    }

    let progressStyle = {
      backgroundColor: '#ddffdd',
      fontSize: '16px',
      width: `${Math.round(this.props.progress)}%`,
      height: '100%',
      display: 'block',
      position: 'relative',
      overflow: 'visible',
      textAlign: 'center',
      lineHeight: '45px'
    }

    return <div style={ barStyle }><span style={ progressStyle }> {this.props.progress}%</span></div>
  }

}
