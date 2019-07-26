import React from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';
import Config from '../config.js';
import eventProxy from '../eventProxy.js';
import '../Button.css';

class DeleteSwimLane extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            show : false
        };

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.submitSwimLane = this.submitSwimLane.bind(this);
    }
    handleShow(){
        this.setState({
            show : true
        });
    }

    handleClose(){
        this.setState({
            show : false
        });
    }

    submitSwimLane(){
        let self = this;
        let swimLaneId = this.props.swimLane.swimLaneId;
        let miniStageId = this.props.swimLane.miniStageId;
        let stageId = this.props.stageId;
        axios.delete(Config.host + Config.kanban_api + '/swimLane/deleteSwimLane',{
            data : {
                swimLaneId : swimLaneId, 
                miniStageId : miniStageId, 
                stageId : stageId
            }
        }).then(function (response) {
            eventProxy.trigger(self.props.stageId,'test');
            eventProxy.trigger(miniStageId,'test');
            eventProxy.off(self.props.stageId);
            eventProxy.off(miniStageId);
            self.props.getSwimLanesOfMiniStage(miniStageId);
            self.props.getNumberOfWorkItemsInMiniStage(miniStageId);
            self.props.getNumberOfWorkItemsInStage(self.props.stageId);
            self.props.getWipLimitInStage(self.props.stageId);
            self.handleClose();
        }).catch(function (error){
            console.log(error);
        });
    }

    render(){
        return (
            <div>
                <a onClick={this.handleShow}>Delete Swim Lane</a>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Swim Lane</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form horizontal>
                            Do you want to delete swim lane?
                            <br/>
                            <font color="red">Warning: If you delete swim lane, work items in swim lane will also be deleted!</font>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.submitSwimLane}>Submit</Button>
                        <Button onClick={this.handleClose}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
export default DeleteSwimLane;
