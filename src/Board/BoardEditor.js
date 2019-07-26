import React from 'react';
import axios from 'axios';
import { Button, Modal, Form, FormControl, FormGroup, Col } from 'react-bootstrap';
import Config from '../config.js';
import '../Button.css';

class BoardEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            name: ''
        }
        this.nameOnChange = this.nameOnChange.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    nameOnChange(e) {
        this.setState({
            name: e.target.value
        });
    }

    handleShow(){
        this.setState({
            show: true,
            name: this.props.board.name
        });
    }

    handleClose(){
        this.setState({
            show: false,
            name: ''
        });  
    }

    handleSubmit() {
        if (this.state.name === '') {
            return;
        }
        let self = this;
        let name = this.state.name;
        axios.post(Config.host + Config.kanban_api + '/board/editBoard',{
            boardId : self.props.board.boardId,
            name : name
        }).then(function (response) {
            self.props.changeBoardName(name);
            self.handleClose();
        }).catch(function (error){
            console.log(error);
        });
    }

    handleKeyPress(e){
        if (e.key === 'Enter') {
            e.preventDefault();
            this.handleSubmit();
        }
    }

    render() {
        return (
            <div>
                <div style={{display : 'flex'}}>
                    <button type="button" class="btn btn-outline-secondary" onClick={this.handleShow}>Edit Board</button>
                    <Modal show={this.state.show} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Board</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form horizontal>
                                <FormGroup>
                                    <Col componentClass={Form.Label} sm={3}>
                                        *Name:
                                    </Col>
                                    <Col sm={9}>
                                    <FormControl componentClass="input" bsSize="small" placeholder="input the name of the board..." onInput={this.nameOnChange} onKeyPress={this.handleKeyPress} defaultValue={this.state.name}/>
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                </FormGroup>
                                <Col componentClass={Form.Label}>
                                    (Note: * denotes a required field)
                                </Col>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.handleSubmit}>Submit</Button>
                            <Button onClick={this.handleClose}>Cancel</Button>
                        </Modal.Footer>
                    </Modal>
                </div> 
            </div>
        );
    }
}

export default BoardEditor;
