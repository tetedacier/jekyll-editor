import React, { Component } from 'react';
import './App.css';
import {AceEditor} from './AceEditor';

class App extends Component {
  // constructor(properties){
  //   super()
  // }
  render() {
    return (
      // <section>test</section>
      <AceEditor {...this.props} />
    );
  }
}

export default App;
