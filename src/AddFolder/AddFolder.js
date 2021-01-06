import React, {Component} from 'react';
import NotefulForm from '../NotefulForm/NotefulForm';
import ApiContext from '../ApiContext';
import ValidationError from '../ValidationError';
import PropTypes from 'prop-types';
import ErrorBoundary from '../ErrorBoundary';
import config from '../config';
import './AddFolder.css';

class AddFolder extends Component {
  state = {
    name: '',
    formValid: false,
    validationMessages: {
      name: ''
    }
  }

  static defaultProps = {
    history: {
      push: () => { }
    }
  }

  static contextType = ApiContext;

  updateName(name) {
    this.setState({ name }, () => {this.validateName(name)});
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const folder = {
      name: e.target['folder-name'].value
    }

    fetch(`${config.API_ENDPOINT}/folders`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(folder)
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(e => Promise.reject(e))
      }
      return res.json()
    })
    .then(folder => {
      this.context.addFolder(folder)
      this.props.history.push(`/folder/${folder.id}`)
    })
    .catch(error => {
      console.error({error})
    })
  }

  validateName(fieldValue) {
    const fieldErrors = {...this.state.validationMessages};
    let hasError = false;
    fieldValue = fieldValue.trim();

    if (fieldValue.length === 0) {
      fieldErrors.name = 'Must enter a folder name';
      hasError = true;
    } else if (fieldValue.length < 3) {
      fieldErrors.name = 'Folder name must be at least three characters long';
      hasError = true;
    } else {
      fieldErrors.name = '';
      hasError = false;
    }

    this.setState({
      validationMessages: fieldErrors,
      nameValid: !hasError
    }, () => {
      this.validateForm();
    })
  }

  validateForm = () => {
    this.setState({
      formValid: this.state.nameValid
    })
  }

  render() {
    return (
      <ErrorBoundary>
        <section className="AddFolder">
          <h2>Add a Folder</h2>
          <NotefulForm onSubmit={this.handleSubmit}>
          <div className="field">
            <label htmlFor="folder-name-input">
              Name
            </label>
            <input type="text" name="folder-name" id="folder-name-input" onChange={(event) => this.updateName(event.target.value)} />
          </div>
          <div className="buttons">
            <button disabled={!this.state.formValid} type='submit'>
              Add a folder
            </button>
          </div>
          </NotefulForm>
          <ValidationError hasError={!this.state.nameValid} message={this.state.validationMessages.name} />
        </section>
      </ErrorBoundary>
    )
  }
}

AddFolder.propTypes = {
  history: PropTypes.object,
  name: PropTypes.string
}

export default AddFolder;