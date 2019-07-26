import React from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';
import Config from '../config.js';
import '../Button.css';

class DeleteWorkItem extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            show : false
        };

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.submitWorkItem = this.submitWorkItem.bind(this);
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

    submitWorkItem(){
        let self = this;
        axios.delete(Config.host + Config.kanban_api + '/workItem/deleteWorkItem',{
            data : {
                workItemId : this.props.workItem.workItemId,
                swimLaneId : this.props.workItem.swimLaneId,
                miniStageId : this.props.miniStageId,
                stageId : this.props.stageId
            }
        }).then(function (response) {
            self.handleClose();
            self.props.getWorkItemsOfSwimLane(self.props.workItem.swimLaneId);
            self.props.getNumberOfWorkItemsInMiniStage(self.props.miniStageId);
            self.props.getNumberOfWorkItemsInStage(self.props.stageId);
            self.props.getWipLimitInStage(self.props.stageId);
        }).catch(function (error){
            console.log(error);
        });
    }

    render(){
        return (
            <div>
                <a onClick={this.handleShow}>Delete WorkItem</a>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete WorkItem</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form horizontal>
                            Do you want to delete WorkItem?
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.submitWorkItem}>Submit</Button>
                        <Button onClick={this.handleClose}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
export default DeleteWorkItem;
