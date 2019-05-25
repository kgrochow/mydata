import React, { PureComponent } from 'react';
import Tree from './Tree';
import Preview from './Preview';
import Plotter from './Plotter';
import Form from './Form';
import debounce from 'lodash.debounce';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
import Modal from 'react-modal';


const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
      width                 : '250px'
    },
  };

  Modal.setAppElement('#container')
  
  class App extends PureComponent {
    constructor() {
        super();
    
        this.state = {
          modalIsOpen: false
        };
    
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
      }
      
      state = {
        node: null,
        filterText: '',
        caseSensitive: false,
        exactMatch: false,
        includeAncestors: true,
        includeDescendants: true,
        formdata: null
    };

    textFilter = null;
    tree = null;

    openModal() {
        this.setState({modalIsOpen: true});
      }
    afterOpenModal() {
        this.subtitle.style.color = '#f00';
    }
    closeModal() {
        this.setState({modalIsOpen: false});
    }    

    changeCheckedState = (key) => (event) => {
        const checked = event.target.checked;

        this.setState({
            [key]: checked
        }, () => {
            this.filter();
        });
    };
    onUpdate = (node) => {
        this.setState({ node: node });
    };
    filter = (keyword) => {
        if (!this.tree) {
            return;
        }

        keyword = keyword || this.textFilter.value || '';

        if (!keyword) {
            this.tree.unfilter();
            return;
        }

        const {
            caseSensitive,
            exactMatch,
            includeAncestors,
            includeDescendants
        } = this.state;

        this.tree.filter(keyword, {
            filterPath: 'name',
            caseSensitive: caseSensitive,
            exactMatch: exactMatch,
            includeAncestors: includeAncestors,
            includeDescendants: includeDescendants
        });
    };

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xs-6">
                        <h5>Filter</h5>
                        <input
                            ref={node => {
                                this.textFilter = node;
                            }}
                            type="text"
                            className="form-control"
                            name="text-filter"
                            placeholder="Type to filter by text"
                            onKeyUp={(event) => {
                                event.persist();

                                const { keyCode } = event;
                                const BACKSPACE = 8;
                                const DELETE = 46;
                                const ENTER = 13;

                                if ([BACKSPACE, DELETE, ENTER].includes(keyCode)) {
                                    this.filter();
                                }
                            }}
                            onKeyPress={debounce((event) => {
                                this.filter();
                            }, 250)}
                        />
                        <div className="row">
                            <div className="col-xs-6">
                                <div className="checkbox" style={{ margin: '5px 0' }}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="case-sensitive"
                                            checked={this.state.caseSensitive}
                                            onChange={this.changeCheckedState('caseSensitive')}
                                        />
                                        Case-sensitive
                                    </label>
                                </div>
                            </div>
                            <div className="col-xs-6">
                                <div className="checkbox" style={{ margin: '5px 0' }}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="exact-match"
                                            checked={this.state.exactMatch}
                                            onChange={this.changeCheckedState('exactMatch')}
                                        />
                                        Exact match
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-6">
                        <button onClick={this.openModal}>Download Data</button>
                        <Modal
                            isOpen={this.state.modalIsOpen}
                            onAfterOpen={this.afterOpenModal}
                            onRequestClose={this.closeModal}
                            style={customStyles}
                            contentLabel="Download Modal"
                            >
                            <h5  style={{textAlign:"center"}} ref={subtitle => this.subtitle = subtitle}>Download Data</h5>
                            <Form handleClose={this.closeModal}/>
                        </Modal>
                    </ div>

                </div>
                <SplitterLayout>
                    <div className="col-xs-12">
                        <Tree
                            ref={c => {
                                this.tree = c ? c.tree : null;
                            }}
                            onUpdate={this.onUpdate}
                        />
                    </div>
                    <div className="col-xs-12">
                        <Plotter node={this.state.node} />   
                    </div>
                </SplitterLayout>
            </div>
        );
    }
}

export default App;
