import React, {Component} from 'react';

import Checkbox from './Checkbox';

const items = [
  'FOV and Nuclei',
  'MIPs',
  'Raw MIPs',
  '3D Images'
];

class Form extends Component {

    componentWillMount = () => {
        this.selectedCheckboxes = new Set();
      }
    
    toggleCheckbox = label => {
        label = label.split(' ')[0]
        if (this.selectedCheckboxes.has(label)) {
            this.selectedCheckboxes.delete(label);
        } else {
            this.selectedCheckboxes.add(label);
        }
    }

    handleFormSubmit = formSubmitEvent => {
        formSubmitEvent.preventDefault();

        console.log(Array.from(this.selectedCheckboxes))
        this.props.handleClose()

        // fetch('http://localhost:5000/api/zip_data?id=262' {
        //     method: 'GET'
        // }).then(function(response) {
        //     if (response.status >= 400) {
        //         throw new Error("Bad response from server");
        //     }
        //     return response.json();
        // }).then(function(table) {
        //     done(null, table);
        //  }).catch(err => {
        //     console.log('Data Error:',err);
        // }) 
    }

    createCheckbox = label => (
        <Checkbox
            label={label}
            handleCheckboxChange={this.toggleCheckbox}
            key={label}
        />
    )

    createCheckboxes = () => (
        items.map(this.createCheckbox)
    )

    // TODO - radio buttons - https://react.tips/radio-buttons-in-reactjs/

    render() {
        return (
            <form onSubmit={this.handleFormSubmit}>
                <h5>Data Types</h5>
                {this.createCheckboxes(items)}
                <h5>Data Target</h5>
                <div className="radio">
                    <label>
                        <input type="radio" value="option1" checked={true} /> pyGoFISH
                    </label>
                </div>
                <div className="radio">
                    <label>
                        <input type="radio" value="option2" disabled={true}/> SIGNET
                    </label>
                </div>
                <div className="radio">
                    <label>
                        <input type="radio" value="option3" disabled={true}/> ViroView
                    </label>
                </div>
                <span style={{float:'right'}}>
                    <button type="submit">Submit</button>
                    <button type="button" onClick={this.props.handleClose}>Cancel</button>
                </span>
            </form>
        );
    }
}

export default Form;
