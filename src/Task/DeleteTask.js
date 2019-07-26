import React from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';
import Config from '../config.js';
import '../Button.css';

class DeleteTask extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            show : false
        };

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

    handleSubmit(){
        let self = this;
        let taskId = this.props.task.taskId;
        let workItemId = this.props.task.workItemId;
        axios.delete(Config.host + Config.kanban_api + '/task/deleteTask',{
            data : {
                taskId : taskId
            }
        }).then(function (response) {
            self.props.getTasksByWorkItemId(workItemId);
            self.handleClose();
        }).catch(function (error){
            console.log(error);
        });
    }

    render(){
        return (
            <div>
                <button type="button" class="btn btn-danger" onClick={this.handleSubmit}>Delete</button>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Task</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form horizontal>
                            Do you want to delete task?
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleSubmit}>Submit</Button>
                        <Button onClick={this.handleClose}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
export default DeleteTask;
