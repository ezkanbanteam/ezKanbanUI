import React from 'react';
import axios from 'axios';
import { Button, Modal, Form, FormControl, FormGroup, Col} from 'react-bootstrap';
import Config from '../config.js';
import eventProxy from '../eventProxy.js';

class SwimLaneAdder extends React.Component {
    constructor(props){
        super(props);
        this.state={
            show: false,
            title: '',
            wipLimit: ''
        }
        this.titleOnChange = this.titleOnChange.bind(this);
        this.wipLimitOnChange = this.wipLimitOnChange.bind(this);
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

    wipLimitOnChange(e) {
        const wipLimit = (e.target.validity.valid) ? e.target.value : this.state.wipLimit;

        this.setState({wipLimit});
    }

    handleShow(){
        this.setState({
            show: true
        });
    }

    handleClose(){
        this.setState({
            show: false,
            title: '',
            wipLimit: ''
        });  
    }

    handleSubmit() {
        if (this.state.title === '') {
            return;
        }
        let self = this;
        let title = this.state.title;
        let miniStageId = this.props.miniStageId;
        let wipLimit = this.state.wipLimit;
        axios.post(Config.host + Config.kanban_api + '/swimLane/addSwimLane',{
            title : title,
            stageId : self.props.stageId,
            miniStageId : miniStageId,
            wipLimit : this.state.wipLimit === '' ? -1 : wipLimit
        }).then(function (response) {
            eventProxy.trigger(self.props.stageId,'test');
            eventProxy.trigger(miniStageId, 'test');
            eventProxy.off(self.props.stageId);
            eventProxy.off(miniStageId);
            self.props.getSwimLanesOfMiniStage(miniStageId);
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
                    <a onClick={this.handleShow}>Add Swim Lane</a>
                    <Modal show={this.state.show} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add New SwimLane</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form horizontal>
                                <FormGroup>
                                    <Col componentClass={Form.Label} sm={3}>
                                        *Title:
                                    </Col>
                                    <Col sm={9}>
                                    <FormControl componentClass="input" placeholder="input the title of the swimLane..." onInput={this.titleOnChange} onKeyPress={this.handleKeyPress}/>
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col componentClass={Form.Label} sm={3}>
                                        WIP Limit:
                                    </Col>
                                    <Col sm={9}>
                                        <FormControl componentClass="input" type="text" maxLength="2" pattern="[0-9]*" onInput={this.wipLimitOnChange} onKeyPress={this.handleKeyPress}/>
                                    </Col>
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

export default SwimLaneAdder;
