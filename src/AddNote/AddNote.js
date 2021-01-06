import React, { Component } from 'react';
import NotefulForm from '../NotefulForm/NotefulForm';
import ApiContext from '../ApiContext';
import PropTypes from 'prop-types';
import ErrorBoundary from '../ErrorBoundary';
import config from '../config';
import './AddNote.css';

class AddNote extends Component {
  state = {
    'note-name': '',
    'note-folder-id': '',
    'note-content': '',
    error: null
  }

  static defaultProps = {
    history: {
      push: () => { }
    }
  }

  static contextType = ApiContext;

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();

    if (!this.state['note-name']) {
      this.setState({
        error: 'Note name is required'
      })
    } else if (!this.state['note-folder-id']) {
      this.setState({
        error: 'Please choose a folder'
      })
    } else if (!this.state['note-content']) {
      this.setState({
        error: 'Note cannot be empty'
      })
    } else {
      const newNote = {
        name: e.target['note-name'].value,
        content: e.target['note-content'].value,
        folderId: e.target['note-folder-id'].value,
        modified: new Date()
      }

      fetch(`${config.API_ENDPOINT}/notes`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(newNote)
      })
        .then(res => {
          if (!res.ok) {
            return res.json().then(e => Promise.reject(e))
          }
          return res.json()
        })
        .then(note => {
          this.context.addNote(note)
          this.props.history.push(`/folder/${note.folderId}`)
        })
        .catch(error => {
          console.error({error})
        })
    }
  }

  render() {
    const {folders = []} = this.context;
    return (
      <ErrorBoundary>
        <section className="AddNote">
          <h2>Add a Note</h2>
          <NotefulForm onSubmit={this.handleSubmit}>
            <div className="field">
              <label htmlFor="note-name-input">
                Name
              </label>
              <input type="text" name="note-name" id="note-name-input" onChange={this.onChange}/>
            </div>
            <div className="field">
              <label htmlFor="note-folder-select">
                Folder
              </label>
              <select name="note-folder-id" id="note-folder-select" onChange={this.onChange}>
                <option value={null}>...</option>
                {folders.map(folder => 
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                )}
              </select>
            </div>
            <div className="field">
              <label htmlFor="note-content-input">
                Content
              </label>
              <textarea name="note-content" id="note-content-input" onChange={this.onChange} />
            </div>
            {this.state.error && (
              <p>{this.state.error}</p>
            )}
            <div className="buttons">
              <button type="submit">
                Add Note
              </button>
            </div>
          </NotefulForm>
        </section>
      </ErrorBoundary>
    )
  }

}

AddNote.propTypes = {
  history: PropTypes.object
}

export default AddNote;