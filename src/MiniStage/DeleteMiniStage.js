import React from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';
import Config from '../config.js';
import '../Button.css';

class DeleteMiniStage extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            show : false
        };

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.submitMiniStage = this.submitMiniStage.bind(this);
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

    submitMiniStage(){
        let self = this;
        let miniStageId = this.props.miniStageId;
        let stageId = this.props.stageId;
        axios.delete(Config.host + Config.kanban_api + '/miniStage/deleteMiniStage',{
            data : {
                miniStageId : miniStageId, 
                stageId : stageId
            }
        }).then(function (response) {
            self.handleClose();
            self.props.getBoardByBoardId();
        }).catch(function (error){
            console.log(error);
        });
    }

    render(){
        return (
            <div>
                <a onClick={this.handleShow}>Delete Mini Stage</a>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Mini Stage</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form horizontal>
                            Do you want to delete mini stage?
                            <br/>
                            <font color="red">Warning: If you delete mini stage, work items in mini stage will also be deleted!</font>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.submitMiniStage}>Submit</Button>
                        <Button onClick={this.handleClose}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
export default DeleteMiniStage;
