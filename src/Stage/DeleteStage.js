import React from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';
import Config from '../config.js';
import '../Button.css';

class DeleteStage extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            show : false
        };

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.submitStage = this.submitStage.bind(this);
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

    submitStage(){
        let self = this;
        axios.delete(Config.host + Config.kanban_api + '/stage/deleteStage',{
            data : {
                stageId : this.props.stage.stageId
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
                <a onClick={this.handleShow}>Delete Stage</a>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Stage</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form horizontal>
                            Do you want to delete stage?
                            <br/>
                            <font color="red">Warning: If you delete stage, work items in stage will also be deleted!</font>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.submitStage}>Submit</Button>
                        <Button onClick={this.handleClose}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
export default DeleteStage;
