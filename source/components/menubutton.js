import React from 'react'


class ButtonContainer extends React.Component {

  menuStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '45px',
    padding: '4px 0 2px 10px',
    backgroundColor: '#eeeeee',
    cursor: 'pointer',
    height: '39px'
  };

}


export class MenuButtonContainer extends ButtonContainer {

  render() {
    let barStyle = {
      width: '35px',
      height: '5px',
      backgroundColor: 'black',
      margin: '6px 0',
      borderRadius: '2px'
    }

    return <div style={this.menuStyle} onClick={this.props.onClick.bind(this)} title='Menu'>
      <div style={barStyle}></div>
      <div style={barStyle}></div>
      <div style={barStyle}></div>
    </div>
  }

}


export class CloseButtonContainer extends ButtonContainer {

  render() {

    let bar1Style = {
      width: '35px',
      height: '5px',
      backgroundColor: 'black',
      margin: '6px 0',
      borderRadius: '2px',
      transform: 'translate(0, 11px) rotate(45deg)',
    }

    let bar2Style = {
      width: '35px',
      height: '5px',
      backgroundColor: 'black',
      margin: '6px 0',
      borderRadius: '2px',
      transform: 'rotate(-45deg)'
    }

    return <div style={this.menuStyle} onClick={this.props.onClick.bind(this)} title='Close'>
      <div style={bar1Style}></div>
      <div style={bar2Style}></div>
    </div>
  }

}
