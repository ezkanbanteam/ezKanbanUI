import React from 'react';
import axios from 'axios';
import { Button, Modal, Form, FormControl, FormGroup, Col} from 'react-bootstrap';
import Config from '../config.js';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

class WorkItemAdder extends React.Component {
    constructor(props){
        super(props);
        this.state={
            show: false,
            description: '',
            categoryId: '',
            userId: '',
            estimate: '',
            notes: '',
            deadline: undefined, 
            options: [],
            selectedOptionValue: '',
            selectedOptionLabel: ''
        }
        this.descriptionOnChange = this.descriptionOnChange.bind(this);
        this.estimateOnChange = this.estimateOnChange.bind(this);
        this.deadlineOnChange = this.deadlineOnChange.bind(this);
        this.notesOnChange = this.notesOnChange.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this._onSelect = this._onSelect.bind(this);
        this.getAllCategories = this.getAllCategories.bind(this);
        this.getAllCategories();
    }

    descriptionOnChange(e) {
        this.setState({
            description: e.target.value
        });
    }

    estimateOnChange(e) {
        const estimate = (e.target.validity.valid) ? e.target.value : this.state.estimate;

        this.setState({estimate});
    }

    deadlineOnChange(deadline){
        this.setState({
            deadline: deadline
        });
    }

    notesOnChange(e) {
        this.setState({
            notes: e.target.value
        });
    }

    handleShow(){
        this.setState({
            show: true
        });
    }

    handleClose(){
        this.setState({
            show: false,
            description: '',
            categoryId: '',
            userId: '',
            estimate: '',
            notes: '',
            deadline: undefined
        });  
    }

    getAllCategories(){
        let self =this;
        axios.get(Config.host + Config.kanban_api + '/category/getCategoriesByBoardId/' + this.props.boardId)
        .then(function (response) {
            let categoryList = response.data.categoryList;
            for(let i = 0; i < categoryList.length; i++){
                self.state.options.push({value:categoryList[i].categoryId, label: categoryList[i].categoryName});
            }
        })
        .catch(function (error){
            console.log(error);
        });
    }

    handleSubmit() {
        if (this.state.description === '') {
            return;
        }
        let self = this;
        let description = this.state.description;
        let swimLaneId = this.props.swimLaneId;
        let estimate = this.state.estimate;
        let deadline =  '';
        let miniStageId = this.props.miniStageId;
        let stageId = this.props.stageId;
        let categoryId = this.state.selectedOptionValue;
        if(this.state.deadline){
            deadline = moment(this.state.deadline).format('YYYY-MM-DD');
        }
        if(estimate === ''){
            estimate = 0;
        }
        let notes = this.state.notes;
        axios.post(Config.host + Config.kanban_api + '/workItem/addWorkItem',{
            swimLaneId : swimLaneId,
            description : description,
            categoryId : categoryId,
            userId : '' ,
            estimate : estimate,
            notes : notes,
            deadline: deadline, 
            miniStageId: miniStageId, 
            stageId: stageId
        }).then(function (response) {
            self.props.getWorkItemsOfSwimLane(swimLaneId);
            self.props.getNumberOfWorkItemsInMiniStage(self.props.miniStageId);
            self.props.getNumberOfWorkItemsInStage(self.props.stageId);
            self.props.getWipLimitInStage(self.props.stageId);
            self.handleClose();
        }).catch(function (error){
            console.log(error);
        });
    }

    _onSelect (option) {
        this.setState({selectedOptionValue: option.value})
        this.setState({selectedOptionLabel: option.label})
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
                    <a onClick={this.handleShow}>Add Work Item</a>
                    <Modal show={this.state.show} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add New Work Item</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form horizontal>
                                <FormGroup>
                                    <Col componentClass={Form.Label} sm={3}>
                                        *Description:
                                    </Col>
                                    <Col sm={9}>
                                    <FormControl componentClass="input" placeholder="input the description of the work item..." onInput={this.descriptionOnChange} onKeyPress={this.handleKeyPress}/>
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col componentClass={Form.Label} sm={3}>
                                        Estimate:
                                    </Col>
                                    <Col sm={9}>
                                        <FormControl componentClass="input" type="text" maxLength="2" pattern="[0-9]*" onInput={this.estimateOnChange} onKeyPress={this.handleKeyPress}/>
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col componentClass={Form.Label} sm={3}>
                                        Deadline:
                                    </Col>
                                    <Col sm={9}>
                                        <DatePicker selected={this.state.deadline} dateFormat="yyyy/MM/dd" onChange={this.deadlineOnChange} isClearable={true}
                                        todayButton={"Today"} showYearDropdown scrollableYearDropdown yearDropdownItemNumber={10}/>
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col componentClass={Form.Label} sm={3}>
                                        Notes:
                                    </Col>
                                    <Col sm={9}>
                                        <FormControl componentClass="textarea" placeholder="input the notes of the work item..." onInput={this.notesOnChange} onKeyPress={this.handleKeyPress}/>
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col componentClass={Form.Label} sm={3}>
                                        Category:
                                    </Col>
                                    <Col sm={9}>
                                        <Dropdown options={this.state.options} onChange={this._onSelect} value={this.state.selectedOptionLabel} placeholder="Select an option" />
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

export default WorkItemAdder;
