import React from 'react';
import axios from 'axios';
import { Button, Modal, Form, FormGroup, Col} from 'react-bootstrap';
import Select from 'react-select';
import Config from '../config.js';

class CycleTimeCalculator extends React.Component {
    constructor(props){
        super(props);
        this.state={
            show: false,
            stageOptions: [], 
            miniStageOptionsOfBeginningStage: [], 
            miniStageOptionsOfEndingStage: [], 
            beginningStageOption: null,
            beginningMiniStageOption: null,
            endingStageOption: null,
            endingMiniStageOption: null, 
            days: 0, 
            hours: 0
        }
        this.getStagesByBoardId = this.getStagesByBoardId.bind(this);
        this.getMiniStagesOfBeginningStage = this.getMiniStagesOfBeginningStage.bind(this);
        this.getMiniStagesOfEndingStage = this.getMiniStagesOfEndingStage.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getStagesByBoardId(){
        let self =this;
        let stageOptions = [];
        axios.get(Config.host + Config.kanban_api + '/stage/getStagesByBoardId/' + this.props.boardId)
        .then(function (response) {
            let stageList = response.data.stageList;
            stageList.forEach(stage => {
                stageOptions.push({value : stage.stageId, label : stage.title});
            });
            self.setState({
                stageOptions : stageOptions
            });
            if(stageOptions.length > 0){
              let firstStageOption = stageOptions[0];
              let lastStageOption = stageOptions[stageOptions.length - 1];
              self.setState({
                beginningStageOption: firstStageOption, 
                endingStageOption: lastStageOption
              });
              let beginningStageId = firstStageOption.value;
              let endingStageId = lastStageOption.value;
              self.getMiniStagesOfBeginningStage(beginningStageId);
              self.getMiniStagesOfEndingStage(endingStageId);
            }
        })
        .catch(function (error){
            console.log(error);
        });
    }

    getMiniStagesOfBeginningStage(stageId){
        let self =this;
        let miniStageOptionsOfBeginningStage = [];
        axios.get(Config.host + Config.kanban_api + '/miniStage/getMiniStagesByStageId/' + stageId)
        .then(function (response) {
            let miniStageList = response.data.miniStageList;
            miniStageList.forEach(miniStage => {
                miniStageOptionsOfBeginningStage.push({value : miniStage.miniStageId, label : miniStage.title});
            });
            self.setState({
                miniStageOptionsOfBeginningStage : miniStageOptionsOfBeginningStage
            });
            if(miniStageOptionsOfBeginningStage.length > 0){
              let firstMiniStageOption = miniStageOptionsOfBeginningStage[0];
              self.setState({
                beginningMiniStageOption: firstMiniStageOption
              });
            }
        })
        .catch(function (error){
            console.log(error);
        });
    }

    getMiniStagesOfEndingStage(stageId){
        let self =this;
        let miniStageOptionsOfEndingStage = [];
        axios.get(Config.host + Config.kanban_api + '/miniStage/getMiniStagesByStageId/' + stageId)
        .then(function (response) {
            let miniStageList = response.data.miniStageList;
            miniStageList.forEach(miniStage => {
                miniStageOptionsOfEndingStage.push({value : miniStage.miniStageId, label : miniStage.title});
            });
            self.setState({
                miniStageOptionsOfEndingStage : miniStageOptionsOfEndingStage
            });
            if(miniStageOptionsOfEndingStage.length > 0){
              let lastMiniStageOption = miniStageOptionsOfEndingStage[miniStageOptionsOfEndingStage.length - 1];
              self.setState({
                endingMiniStageOption: lastMiniStageOption
              });
            }
        })
        .catch(function (error){
            console.log(error);
        });
    }

    selectBeginningStageOnChange(selectedBeginningStageOption){
        this.setState({
            beginningStageOption : selectedBeginningStageOption
        });
        let selectedBeginningStageId = selectedBeginningStageOption.value;
        this.getMiniStagesOfBeginningStage(selectedBeginningStageId);
    }

    selectBeginningMiniStageOnChange(selectedBeginningMiniStageOption){
        this.setState({
            beginningMiniStageOption : selectedBeginningMiniStageOption
        });
    }

    selectEndingStageOnChange(selectedEndingStageOption){
        this.setState({
            endingStageOption : selectedEndingStageOption
        });
        let selectedEndingStageId = selectedEndingStageOption.value;
        this.getMiniStagesOfEndingStage(selectedEndingStageId);
    }

    selectEndingMiniStageOnChange(selectedEndingMiniStageOption){
        this.setState({
            endingMiniStageOption : selectedEndingMiniStageOption
        });
    }

    handleShow(){
        this.setState({
            show: true
        });
        this.getStagesByBoardId();
    }

    handleClose(){
        this.setState({
            show: false
        });  
    }

    handleSubmit() {
        let self = this;
        axios.post(Config.host + Config.kanban_api + '/workItem/calculateCycleTime',{
            workItemId: self.props.workItemId, 
            beginningStageId: self.state.beginningStageOption.value, 
            beginningMiniStageId: self.state.beginningMiniStageOption.value, 
            endingStageId: self.state.endingStageOption.value, 
            endingMiniStageId: self.state.endingMiniStageOption.value, 
            boardId: self.props.boardId
        }).then(function (response) {
            let cycleTime = response.data.cycleTime;
            self.setState({
                hours: Math.floor((cycleTime / 3600000) % 24), 
                days: Math.floor((cycleTime / 86400000))
            });
        }).catch(function (error){
            console.log(error);
        });
    }

    render(){
        
        return(
            <div>
                <div>
                    <a onClick={this.handleShow}>Calculate Cycle Time</a>
                    <Modal show={this.state.show} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Calculate Cycle Time</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form horizontal>
                                <FormGroup>
                                    <Col componentClass={Form.Label} sm={4}>
                                        Beginning Stage:
                                    </Col>
                                    <Col sm={8}>
                                        <Select name="form-field-name" value={this.state.beginningStageOption} onChange={this.selectBeginningStageOnChange.bind(this)} options={this.state.stageOptions} isClearable={false}/>
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col componentClass={Form.Label} sm={4}>
                                        Beginning Mini Stage:
                                    </Col>
                                    <Col sm={8}>
                                        <Select name="form-field-name" value={this.state.beginningMiniStageOption} onChange={this.selectBeginningMiniStageOnChange.bind(this)} options={this.state.miniStageOptionsOfBeginningStage} isClearable={false}/>
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col componentClass={Form.Label} sm={4}>
                                        Ending Stage:
                                    </Col>
                                    <Col sm={8}>
                                        <Select name="form-field-name" value={this.state.endingStageOption} onChange={this.selectEndingStageOnChange.bind(this)} options={this.state.stageOptions} isClearable={false}/>
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col componentClass={Form.Label} sm={4}>
                                        Ending Mini Stage:
                                    </Col>
                                    <Col sm={8}>
                                        <Select name="form-field-name" value={this.state.endingMiniStageOption} onChange={this.selectEndingMiniStageOnChange.bind(this)} options={this.state.miniStageOptionsOfEndingStage} isClearable={false}/>
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col componentClass={Form.Label} sm={3}>
                                        Cycle Time:
                                    </Col>
                                    <Col sm={9}>
                                        {this.state.days === 0 ? '' : this.state.days + ' days '} {this.state.hours + ' hours'}
                                    </Col>
                                </FormGroup>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.handleSubmit}>Calculate</Button>
                            <Button onClick={this.handleClose}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                </div> 
            </div>
        );
    }
}

export default CycleTimeCalculator;
