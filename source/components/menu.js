import React from 'react'


export default class MenuComponent extends React.Component {

  enableSet(set) {
    let newSets = this.props.availableSets.filter(i => (this.props.sets.indexOf(i) != -1) || i == set)
    this.props.setSets(newSets)
  }

  disableSet(set) {
    let newSets = this.props.sets.filter(i => i != set)
    this.props.setSets(newSets)
  }

  render() {
    let menuStyle = {
      marginTop: '50px',
      padding: '10px',
      fontSize: '16px',
      lineHeight: '24px'
    }

    let blockStyle = {
      border: '1px solid #eee',
      margin: '10px 0',
      padding: '10px'
    }

    let radioStyle = {
      marginTop: '10px'
    }

    let radios = []

    for (const i in this.props.availableSets) {
      let v = this.props.availableSets[i]
      if (this.props.sets.indexOf(v) != -1) {
        radios.push(<div key={i}>
          <input
            style={radioStyle}
            id={`set${i}`}
            type="checkbox"
            name="sets"
            value={v}
            defaultChecked={true}
            onClick={this.disableSet.bind(this, v)}
          />
        <label for={`set${i}`}> { v }</label>
        </div>)
      } else {
        radios.push(<div key={i}>
          <input
            style={radioStyle}
            id={`set${i}`}
            type="checkbox"
            name="sets"
            value={v}
            onClick={this.enableSet.bind(this, v)}
          />
        <label for={`set${i}`}> { v }</label>
        </div>)
      }
    }

    return <div style={menuStyle}>
      <div key='sets' style={blockStyle}>
        { radios }
      </div>
      <div key='reset' style={blockStyle}>
        <button onClick={this.props.reset.bind(this)}>Reset session</button>
      </div>
    </div>
  }

}
