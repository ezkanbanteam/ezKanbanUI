import React from 'react';
import axios from 'axios';
import { Button, Modal, Form, FormControl, FormGroup, Col} from 'react-bootstrap';
import Config from '../config.js';

class MiniStageEditor extends React.Component {
    constructor(props){
        super(props);
        this.state={
            show: false,
            title: ''
        }
        this.titleOnChange = this.titleOnChange.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    titleOnChange(e) {
        this.setState({
            title: e.target.value
        });
    }

    handleShow(){
        this.setState({
            show: true,
            title: this.props.miniStage.title
        });
    }

    handleClose(){
        this.setState({
            show: false,
            title: ''
        });  
    }

    handleSubmit() {
        if (this.state.title === '') {
            return;
        }
        let self = this;
        let title = this.state.title;
        let stageId = this.props.miniStage.stageId;
        axios.post(Config.host + Config.kanban_api + '/miniStage/editMiniStage',{
            stageId : self.props.stageId,
            miniStageId : self.props.miniStage.miniStageId,
            title : title
        }).then(function (response) {
            self.props.getMiniStagesOfStage(stageId);
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

    render(){
        
        return(
            <div>
                <div>
                    <a onClick={this.handleShow}>Edit Mini Stage</a>
                    <Modal show={this.state.show} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Mini Stage</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form horizontal>
                                <FormGroup>
                                    <Col componentClass={Form.Label} sm={3}>
                                        *Title:
                                    </Col>
                                    <Col sm={9}>
                                    <FormControl componentClass="input" placeholder="input the title of the miniStage..." onInput={this.titleOnChange} onKeyPress={this.handleKeyPress} defaultValue={this.state.title}/>
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

export default  MiniStageEditor;
