
import React, {
  Component,
  // PureComponent,
} from 'react';
import './style.css';
const {
   XmlHttpRequest
} = require('./http-file-loader.js')
class AceEditor extends Component {
  constructor (properties) {
    const {
      mode,
      theme,
      name
    } = properties
    super(properties)

    if (name) {
      this.name = name
    }
    else {
      this.name = 'editor'
    }

    if (theme) {
      this.theme = theme
    }
    else {
      this.theme = 'monokai'
    }

    if (mode) {
      this.mode = mode
    }
    else {
      this.mode = 'javascript'
    }
    this.init()
  }
  init () {
    this.showEditorState = function () {
      var fileLoader = new XmlHttpRequest('localhost:8081', 'http')
      if(document.getElementById(this.name).querySelectorAll('.ace_error').length === 0) {
        if (this.editor.session.fileName) {
          fileLoader.save(
            this.editor.session.fileName,
            this.editor.getValue()
          ).then((result) => {
            console.log(result)
          },(rejection) => {
            console.log(rejection)
          })
        }
      }
      // console.log(document.getElementById(this.name).querySelectorAll('.ace_error'))
      // console.log(this.editor.session)
    }.bind(this);

    /**
     * event
     * @return {[type]} [description]
     */
    this.loadMardownFile = function () {
      var fileLoader = new XmlHttpRequest('localhost:8081', 'http')
      fileLoader.list().then((files) => {
        console.log(files)
      })
    }
  }
  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('getSnapshotBeforeUpdate',prevProps, prevState);
    return null;
  }

 initEditor () {
    // comes with raw ace build see `node druyce.js`
    var editor = window.ace.edit(this.name);
    editor.setTheme(`ace/theme/${this.theme}`);
    editor.session.setMode(`ace/mode/${this.mode}`);

    // add command to lazy-load keybinding_menu extension
    editor.commands.addCommand({
        name: "showKeyboardShortcuts",
        bindKey: {win: "Ctrl-Alt-h", mac: "Command-Alt-h"},
        exec: function(editor) {
            window.ace.config.loadModule("ace/ext/keybinding_menu", function(module) {
                module.init(editor);
                editor.showKeyboardShortcuts()
            })
        }
    })

    // add command to lazy-load files tree-view extension
    editor.commands.addCommand({
        name: "showAvailableFile",
        bindKey: {win: "Ctrl-Shift-f", mac: "Ctrl-Shift-f"},
        exec: function(editor) {
            window.ace.config.loadModule("ace/ext/files", function(module) {
                module.init(editor);
                editor.showAvailableFile()
            })
        }
    })
    editor.execCommand("showAvailableFile")

    return editor;
  }
  componentDidUpdate (prevProps, prevState, snapshot) {

  }


  componentDidMount () {
    this.editor = this.initEditor()
  }
  render () {
    const code = `# manifest

Ce cours manifest de test
`
    return (
      <section className="editor-frame">
        <div id="editor" className="react-display-linebreak full">{code}</div>
        <div id="tree-view" className="loading"></div>
        <footer className="action">
          <button onClick={this.showEditorState} type="button">save</button>
          <button onClick={this.loadMardownFile} type="button">getFiles</button>
        </footer>
      </section>
    )
  }
}

export {
  AceEditor
}
