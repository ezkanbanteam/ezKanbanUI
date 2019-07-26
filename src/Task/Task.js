import React from 'react';
import axios from 'axios';
import { FormControl, Col} from 'react-bootstrap';
import Config from '../config.js';
import DeleteTask from './DeleteTask.js';

class Task extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false, 
            description: ''
        }
        this.descriptionOnChange = this.descriptionOnChange.bind(this);
        this.onFinishedChange = this.onFinishedChange.bind(this);
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

    onFinishedChange(e){
        let self = this;
        let workItemId = this.props.task.workItemId;
        let taskId = this.props.task.taskId;
        let finished = e.target.checked;
        
        axios.post(Config.host + Config.kanban_api + '/task/changeStatusOfTask',{
            finished: finished,
            taskId: taskId
        }).then(function (response) {
            self.props.getTasksByWorkItemId(workItemId);
        }).catch(function (error){
            console.log(error);
        });
    }

    handleShow(){
        this.setState({
            show: true, 
            description: this.props.task.description
        })
    }

    handleClose(){
        this.setState({
            show: false
        });  
    }

    handleSubmit() {
        if (this.state.description === '') {
            return;
        }
        let self = this;
        let taskId = this.props.task.taskId;
        let description = this.state.description;
        let workItemId = this.props.task.workItemId;
        axios.post(Config.host + Config.kanban_api + '/task/editTask',{
            taskId: taskId, 
            description: description
        }).then(function (response) {
            self.props.getTasksByWorkItemId(workItemId);
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
        var taskKey = 'checkbox-' + this.props.task.taskId;
        var description = this.props.task.description;
        var finished = this.props.task.finished;
        var normalText = (
            <div onClick={this.handleShow}>{description}</div>
        );
        var form = (
            <div>
                
                <div style = {{display : 'flex'}}>
                <Col>
                    <FormControl componentClass="input" placeholder="input the description of the task..." onChange={this.descriptionOnChange} onKeyPress={this.handleKeyPress} value={this.state.description}/>
                </Col>
                    <button type="button" class="btn btn-primary" onClick={this.handleSubmit}>Save</button>
                    &nbsp;<DeleteTask task={this.props.task} getTasksByWorkItemId={this.props.getTasksByWorkItemId}/>
                    &nbsp;<button type="button" class="btn btn-primary" onClick={this.handleClose}>Cancel</button>
                </div>
            </div>
            
        );
        return(
            <div className="form-check">
            <input className="form-check-input" type="checkbox" checked={finished} onChange={this.onFinishedChange} id={taskKey}></input>
            <label className="form-check-label" for="defaultCheck1">
            {this.state.show ? form : normalText}
            </label>
            </div>
        )
    }
}

export default Task;
