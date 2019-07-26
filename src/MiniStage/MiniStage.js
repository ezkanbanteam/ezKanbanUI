import React,{Component} from 'react';
import axios from 'axios';
import Config from '../config.js';
import './MiniStage.css';
import '../Stage/Stage.css';
import { Card, Badge} from 'react-bootstrap';
import SwimLane from '../SwimLane/SwimLane';
import SwimLaneAdder from './SwimLaneAdder.js';
import MiniStageEditor from './MiniStageEditor.js';
import '../Button.css';
import eventProxy from '../eventProxy.js';
import DeleteMiniStage from './DeleteMiniStage.js';
import Dropdown from '../Dropdown/Dropdown'
class MiniStage extends Component {
    constructor(props) {
        super(props);
        this.state={
            show : false,
            numberOfWorkItemsInMiniStage : 0,
            wipLimit : '',
            swimLanes: [],
            isMiniStageWipLimitVisible : true
        }
        this.getWipLimitInMiniStage = this.getWipLimitInMiniStage.bind(this);
        this.getNumberOfWorkItemsInMiniStage = this.getNumberOfWorkItemsInMiniStage.bind(this);
        this.addSwimLane = this.addSwimLane.bind(this);
        this.getSwimLanesOfMiniStage = this.getSwimLanesOfMiniStage.bind(this);
        this.setBeginningLeadTimeBoundary = this.setBeginningLeadTimeBoundary.bind(this);
        this.setEndingLeadTimeBoundary = this.setEndingLeadTimeBoundary.bind(this);
        this.getNumberOfWorkItemsInMiniStage(this.props.miniStage.miniStageId);
        this.getSwimLanesOfMiniStage(this.props.miniStage.miniStageId);
    }

    getNumberOfWorkItemsInMiniStage(miniStageId){
        let self = this;
        axios.get(Config.host + Config.kanban_api +'/miniStage/getNumberOfWorkItemsInMiniStage/' + miniStageId + '/' + self.props.stage.stageId)
        .then(function (response) {
            self.setState({
                numberOfWorkItemsInMiniStage : response.data.numberOfWorkItemsInMiniStage
            });
        }).catch(function (error){
            console.log(error);
        });
    }

    addSwimLane(swimLane){
        var swimLanes = this.state.swimLanes;
        swimLanes.push(<SwimLane key={swimLane.swimLaneId} swimLane={swimLane}
                                 getNumberOfWorkItemsInMiniStage={this.getNumberOfWorkItemsInMiniStage}
                                 getNumberOfWorkItemsInStage={this.props.getNumberOfWorkItemsInStage}
                                 getWipLimitInStage={this.props.getWipLimitInStage}
                                 getSwimLanesOfMiniStage={this.getSwimLanesOfMiniStage}
                                 stage={this.props.stage}/>);
        this.setState({swimLanes:swimLanes});
    }

    getWipLimitInMiniStage(miniStageId){
        let self = this;
        axios.get(Config.host + Config.kanban_api +'/miniStage/getWipLimitInMiniStage/' + miniStageId + '/' + self.props.stage.stageId)
        .then(function (response) {
            self.setState({
                wipLimit : response.data.wipLimit,
                isMiniStageWipLimitVisible : response.data.miniStageWipLimitVisible
            });
        }).catch(function (error){
            console.log(error);
        });
    }
    
    getSwimLanesOfMiniStage(miniStageId){
        let self = this;
        axios.get(Config.host + Config.kanban_api +'/swimLane/getSwimLanesByMiniStageId/' + miniStageId + '/' + self.props.stage.stageId)
        .then(function (response) {
            self.setState({
                swimLanes: [],
                isMiniStageWipLimitVisible : true
            });
            let swimLaneList = response.data.swimLaneList;
            for(let i = 0; i < swimLaneList.length; i++){
                self.addSwimLane(swimLaneList[i]);
                if(swimLaneList[i].wipLimit === -1){
                    self.setState({
                        isMiniStageWipLimitVisible : false
                    });
                }
            }
            self.getWipLimitInMiniStage(miniStageId);
        }).catch(function (error){
            console.log(error);
        });
    }

    setBeginningLeadTimeBoundary(){
        var self = this;
        axios.post(Config.host + Config.kanban_api +'/board/setBeginningLeadTimeBoundary',{
            boardId : this.props.stage.boardId,
            miniStageId : this.props.miniStage.miniStageId
        }).then(function (response) {
            self.props.getBoardByBoardId();
        }).catch(function (error){
            console.log(error);
        });
    }

    setEndingLeadTimeBoundary(){
        var self = this;
        axios.post(Config.host + Config.kanban_api +'/board/setEndingLeadTimeBoundary',{
            boardId : this.props.stage.boardId,
            miniStageId : this.props.miniStage.miniStageId
        }).then(function (response) {
            self.props.getBoardByBoardId();
        }).catch(function (error){
            console.log(error);
        });
    }

    render(){
        console.log('--------MiniStageRender---------');

        var swimLanes = [];
        for(var i = 0; i < this.state.swimLanes.length; i++)
        {
            swimLanes.push(this.state.swimLanes[i]);
            if(i < this.state.swimLanes.length - 1)
            {
                var swimLineKey = this.props.miniStage.miniStageId + "-swim-line-" + i;
                swimLanes.push(<div key = {swimLineKey} ></div>);
            }
        }
        var title = this.props.miniStage.title;
        var numberOfWorkItemsInMiniStage = this.state.numberOfWorkItemsInMiniStage;
        var wipLimit = this.state.wipLimit;
        var wipLimitStatement = "";
        if(this.state.isMiniStageWipLimitVisible)
        {
            var wipLimitColor = "black";
            if(numberOfWorkItemsInMiniStage > wipLimit)
            {
                wipLimitColor = "red";
            }
            wipLimitStatement =  <Badge pill variant="primary">
                                <font color={wipLimitColor}>{wipLimit}</font>
                            </Badge>
        }

        if(title === ''){
            title = <span>&nbsp;</span>
        }

        eventProxy.on(this.props.miniStage.miniStageId, (msg) => {
            this.getWipLimitInMiniStage(this.props.miniStage.miniStageId);
        });

        return (
            <div className = "mini-stage">
                <Card bg="info" className="mini-stage-card">
                    <Card.Body>
                        <Card.Text className="mini-stage-card-text">
                            <font color="white" size="6">
                                {title} {wipLimitStatement}
                            </font>

                        <div className="position-toggle-button-right">
                            <Dropdown>
                                <SwimLaneAdder miniStageId={this.props.miniStage.miniStageId} 
                                                                                getSwimLanesOfMiniStage={this.getSwimLanesOfMiniStage}
                                                                                stageId={this.props.stage.stageId} />
                                <MiniStageEditor stageId = {this.props.stage.stageId} miniStage={this.props.miniStage} getMiniStagesOfStage={this.props.getMiniStagesOfStage}/>
                                <DeleteMiniStage stageId = {this.props.stage.stageId} miniStageId={this.props.miniStage.miniStageId} getBoardByBoardId={this.props.getBoardByBoardId}/>
                            </Dropdown>
                        </div>
                        </Card.Text>
                        

                        <div className = "container-swim-lanes">
                        {swimLanes}
                    </div>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}
export default MiniStage;
