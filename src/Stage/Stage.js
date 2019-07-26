import React,{Component} from 'react';
import './Stage.css';
import axios from 'axios';
import Config from '../config.js';
import MiniStage from '../MiniStage/MiniStage.js';
import { Card, Badge} from 'react-bootstrap';
import MiniStageAdder from './MiniStageAdder.js';
import StageEditor from './StageEditor';
import DeleteStage from './DeleteStage';
import '../Button.css';
import eventProxy from '../eventProxy.js';
import Dropdown from '../Dropdown/Dropdown'

class Stage extends Component{ 
   constructor(props){
       super(props);
       this.state={
            show : false,
            numberOfWorkItemsInStage : 0,
            wipLimit : '',
            miniStages : [],
            isStageWipLimitVisible : true
        }
        this.getNumberOfWorkItemsInStage = this.getNumberOfWorkItemsInStage.bind(this);
        this.getWipLimitInStage = this.getWipLimitInStage.bind(this);
        this.addMiniStage = this.addMiniStage.bind(this);
        this.getMiniStagesOfStage = this.getMiniStagesOfStage.bind(this);
        this.getNumberOfWorkItemsInStage(this.props.stage.stageId);
        this.getMiniStagesOfStage(this.props.stage.stageId);
    }

    getNumberOfWorkItemsInStage(stageId){
        let self = this;
        axios.get(Config.host + Config.kanban_api + '/stage/getNumberOfWorkItemsInStage/' + stageId)
        .then(function (response) {
            self.setState({
                numberOfWorkItemsInStage : response.data.numberOfWorkItemsInStage
            });
        }).catch(function (error){
            console.log(error);
        });
    }

    getWipLimitInStage(stageId){
        let self = this;
        axios.get(Config.host + Config.kanban_api + '/stage/getWipLimitInStage/' + stageId)
        .then(function (response) {
            self.setState({
                wipLimit : response.data.wipLimit,
                isStageWipLimitVisible : response.data.stageWipLimitVisible
            });
        }).catch(function (error){
            console.log(error);
        });
    }

    addMiniStage(miniStage){
        var miniStages = this.state.miniStages;
        miniStages.push(<MiniStage key={miniStage.miniStageId} miniStage={miniStage} 
                                   getBoardByBoardId={this.props.getBoardByBoardId}
                                   getNumberOfWorkItemsInStage={this.getNumberOfWorkItemsInStage}
                                   getWipLimitInStage={this.getWipLimitInStage}
                                   getMiniStagesOfStage={this.getMiniStagesOfStage}
                                   stage={this.props.stage}/>);
        this.setState({miniStages:miniStages});
    }

    getMiniStagesOfStage(stageId){
        let self = this;
        axios.get(Config.host + Config.kanban_api + '/miniStage/getMiniStagesByStageId/' + stageId)
        .then(function (response) {
            self.setState({
                miniStages: [],
                isStageWipLimitVisible : true
            });
            let miniStageList = response.data.miniStageList;
            for(let i = 0; i < miniStageList.length; i++){
                self.addMiniStage(miniStageList[i]);
            }
            self.getWipLimitInStage(stageId);
        }).catch(function (error){
            console.log(error);
        });
    }

    render(){
        console.log('--------StageRender---------');
        var miniStages = [];
        for(var i = 0; i < this.state.miniStages.length; i++)
        {
            // if(this.state.miniStages[i].props.miniStage.miniStageId === this.props.beginningLeadTimeBoundaryByMiniStageId){
            //     var beginningLeadTimeBoundaryLineKey = this.props.stage.stageId + "-beginning-lead-time-boundary-line";
            //     miniStages.push(<div key={beginningLeadTimeBoundaryLineKey} className = "beginning-lead-time-boundary-line"></div>);
            // }
            miniStages.push(this.state.miniStages[i]);
            if(i < this.state.miniStages.length - 1)
            {
                var miniStageLineKey = this.props.stage.stageId + "-mini-stage-line-" + i;
                miniStages.push(<div key={miniStageLineKey}></div>);
            }
            // if(this.state.miniStages[i].props.miniStage.miniStageId === this.props.endingLeadTimeBoundaryByMiniStageId){
            //     var endingLeadTimeBoundaryLineKey = this.props.stage.stageId + "-ending-lead-time-boundary-line";
            //     miniStages.push(<div key={endingLeadTimeBoundaryLineKey} className = "ending-lead-time-boundary-line"></div>);
            // }
        }
        var title = this.props.stage.title;
        var numberOfWorkItemsInStage = this.state.numberOfWorkItemsInStage;
        var wipLimit = this.state.wipLimit;
        var wipLimitStatement = "";
        if(this.state.isStageWipLimitVisible)
        {
            var wipLimitColor = "black";
            if(numberOfWorkItemsInStage > wipLimit)
            {
                wipLimitColor = "red";
            }
            wipLimitStatement =  <Badge pill variant="primary">
                                <font color={wipLimitColor}>{wipLimit}</font>
                            </Badge>
        }
        eventProxy.on(this.props.stage.stageId, (msg) => {
            this.getWipLimitInStage(this.props.stage.stageId);
        });
        return( 
            <div className = "stage">
                <div>
                    <div >
                    <Card bg="primary" className="stage-card">
                <Card.Body>
                    <Card.Text>
                        <font color="white" size="8">
                            {title} {wipLimitStatement}
                        </font>
                        <div className="position-toggle-button-right">
                            <Dropdown>
                                <MiniStageAdder stageId={this.props.stage.stageId} 
                                                            getBoardByBoardId={this.props.getBoardByBoardId} />

                                <StageEditor stage={this.props.stage} getStagesByBoardId={this.props.getStagesByBoardId}/>

                                <DeleteStage stage={this.props.stage} getBoardByBoardId={this.props.getBoardByBoardId}/>

                            </Dropdown>
                        </div>
                    </Card.Text>
                    
                    <div className = "container-mini-stages">
                        {miniStages}
                    </div>
                </Card.Body>
            </Card>
                        
                        
                    </div>
                    
                </div>
            </div>
        );
    }
} 
export default Stage;

