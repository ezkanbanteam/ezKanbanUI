import React from 'react';
import axios from 'axios';
import { Button, Modal, Form, FormControl, Col} from 'react-bootstrap';
import Config from '../config.js';
import Task from '../Task/Task.js';
import '../Button.css';

class TaskList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            description: '', 
            tasks: []
        }
        this.descriptionOnChange = this.descriptionOnChange.bind(this);
        this.addTask = this.addTask.bind(this);
        this.getTasksByWorkItemId = this.getTasksByWorkItemId.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    descriptionOnChange(e) {
        this.setState({
            description: e.target.value
        });
    }

    addTask(task){
        var tasks = this.state.tasks;
        tasks.push(<Task key={task.taskId} task={task} getTasksByWorkItemId={this.getTasksByWorkItemId}/>);
        this.setState({tasks: tasks});
    }

    getTasksByWorkItemId(workItemId) {
        let self = this;
        axios.get(Config.host + Config.kanban_api + '/task/getTasksByWorkItemId/' + workItemId)
        .then(function (response) {
            self.setState({
                tasks: []
            });
            let taskList = response.data.taskList;
            for(let i = 0; i < taskList.length; i++){
                self.addTask(taskList[i]);
            }
        }).catch(function (error){
            console.log(error);
        });
    }

    handleShow(){
        this.setState({
            show: true
        });
        this.getTasksByWorkItemId(this.props.workItemId);
    }

    handleClose(){
        this.setState({
            show: false,
            description: ''
        });  
    }

    handleSubmit() {
        if (this.state.description === '') {
            return;
        }
        let self = this;
        let description = this.state.description;
        let workItemId = this.props.workItemId;
        axios.post(Config.host + Config.kanban_api + '/task/addTask',{
            description: description, 
            workItemId: workItemId
        }).then(function (response) {
            self.getTasksByWorkItemId(workItemId);
            self.setState({
                description: ''
            });
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
        var tasks = [];
        this.state.tasks.forEach(task => {
            tasks.push(task);
        });
        return (
            <div>
                <div>
                    <a onClick={this.handleShow}>Manage Task</a>
                    <Modal show={this.state.show} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Task List</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form horizontal>
                                <div style = {{display : 'flex'}}>
                                    <Col componentClass={Form.Label} sm={3}>
                                        *Description:
                                    </Col>
                                    <Col sm={6}>
                                        <FormControl componentClass="input" placeholder="input the description of the task..." onChange={this.descriptionOnChange} onKeyPress={this.handleKeyPress} value={this.state.description}/>
                                    </Col>
                                    <Button onClick={this.handleSubmit}>Add Task</Button>
                                </div>
                                <Col componentClass={Form.Label}>
                                    (Note: * denotes a required field)
                                </Col>
                                <hr/>
                                <Modal.Title>Task List</Modal.Title>
                                <br/>
                                {tasks}
                                {tasks.length > 0 ? <Col componentClass={Form.Label}>Click the description of the task to edit the task.</Col> : ''}
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.handleClose}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                </div> 
            </div>
        );
    }
}

export default TaskList;
