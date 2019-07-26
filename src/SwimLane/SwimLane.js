import React,{Component} from 'react';
import axios from 'axios';
import Config from '../config.js';
import './SwimLane.css';
import WorkItem from '../WorkItem/WorkItem.js';
import { Card, Badge} from 'react-bootstrap';
import WorkItemAdder from './WorkItemAdder.js';
import SwimLaneEditor from './SwimLaneEditor.js';
import eventProxy from '../eventProxy.js';
import '../Button.css';
import DeleteSwimLane from './DeleteSwimLane.js';
import Dropdown from '../Dropdown/Dropdown.js'

class SwimLane extends Component {
    constructor(props) {
        super(props);
        this.state={
            show : false,
            workItems: []
        }
        this.addWorkItem = this.addWorkItem.bind(this);
        this.getWorkItemsOfSwimLane = this.getWorkItemsOfSwimLane.bind(this);
        this.getWorkItemsOfSwimLane(this.props.swimLane.swimLaneId);
    }

    addWorkItem(workItem){
        var workItems = this.state.workItems;
        workItems.push(<WorkItem key={workItem.workItemId} workItem={workItem} 
                                 miniStageId={this.props.swimLane.miniStageId}
                                 getNumberOfWorkItemsInMiniStage={this.props.getNumberOfWorkItemsInMiniStage}
                                 getNumberOfWorkItemsInStage={this.props.getNumberOfWorkItemsInStage}
                                 getWipLimitInStage={this.props.getWipLimitInStage}
                                 getWorkItemsOfSwimLane={this.getWorkItemsOfSwimLane}
                                 stage={this.props.stage}/>);
        this.setState({workItems:workItems});
    }

    getWorkItemsOfSwimLane(swimLaneId){
        let self = this;
        axios.get(Config.host + Config.kanban_api + '/workItem/getWorkItemsBySwimLaneId/' + swimLaneId)
        .then(function (response) {
            self.setState({
                workItems: []
            });
            let workItemList = response.data.workItemList;
            for(let i = 0; i < workItemList.length; i++){
                self.addWorkItem(workItemList[i]);
            }
        }).catch(function (error){
            console.log(error);
        });
    }

    onDragOver = (ev) => {
        ev.preventDefault();
    }

    onDrop = (ev, targetSwimLaneId) => {
        let workItemId = ev.dataTransfer.getData("workItemId");
        let originalStageId = ev.dataTransfer.getData("originalStageId");
        let originalSwimLaneId = ev.dataTransfer.getData("originalSwimLaneId");
        let self = this;
        axios.post(Config.host + Config.kanban_api + '/workItem/moveWorkItem',{
            boardId : self.props.stage.boardId,
            originalStageId: originalStageId,
            newStageId: self.props.stage.stageId,
            originalSwimLaneId: originalSwimLaneId,
            newSwimLaneId : targetSwimLaneId,
            workItemId : workItemId
        }).then(function (response) {
            eventProxy.trigger('updateWipLimitAfterMoveWorkItem','end');
            eventProxy.off('updateWipLimitAfterMoveWorkItem');
            self.getWorkItemsOfSwimLane(targetSwimLaneId);
            self.props.getNumberOfWorkItemsInMiniStage(self.props.swimLane.miniStageId);
            self.props.getNumberOfWorkItemsInStage(self.props.stage.stageId);
            self.props.getWipLimitInStage(self.props.stage.stageId);
        }).catch(function (error){
            console.log(error);
        });
    }
    
    render(){
        console.log('--------SwimLaneRender---------');

        var workItems = [];
        var numberOfWorkItems = this.state.workItems.length;
        for(var i = 0; i < numberOfWorkItems; i++)
        {
            workItems.push(this.state.workItems[i]);
        }
        var title = this.props.swimLane.title;
        var wipLimit = this.props.swimLane.wipLimit;
        var wipLimitStatement = "";
        if(wipLimit > -1)
        {
            var wipLimitColor = "black";
            if(numberOfWorkItems > wipLimit)
            {
                wipLimitColor = "red";
            }
            wipLimitStatement =  <Badge pill variant="primary">
                                <font color={wipLimitColor}>{wipLimit}</font>
                            </Badge>

            
        }
    
        return (
            <div className = "swim-lane" onDrop={(e)=>this.onDrop(e, this.props.swimLane.swimLaneId)}
                                         onDragOver={(e)=>this.onDragOver(e)}
                                         
            >
                
                <Card bg="light" className="swim-lane-card">
                <Card.Body>
                    <Card.Text>
                    <font color="black" size="5">
                    {title} {wipLimitStatement}
                    </font>
            
                    <div className="position-toggle-button-right">
                    <Dropdown>
                        <WorkItemAdder swimLaneId={this.props.swimLane.swimLaneId}
                                            getWorkItemsOfSwimLane={this.getWorkItemsOfSwimLane}
                                            miniStageId={this.props.swimLane.miniStageId}
                                            getNumberOfWorkItemsInMiniStage={this.props.getNumberOfWorkItemsInMiniStage}
                                            getNumberOfWorkItemsInStage={this.props.getNumberOfWorkItemsInStage}
                                            getWipLimitInStage={this.props.getWipLimitInStage}
                                            stageId={this.props.stage.stageId}
                                            boardId={this.props.stage.boardId}/>
                        <SwimLaneEditor swimLane={this.props.swimLane} getSwimLanesOfMiniStage={this.props.getSwimLanesOfMiniStage}
                                            getNumberOfWorkItemsInMiniStage={this.props.getNumberOfWorkItemsInMiniStage}
                                            getNumberOfWorkItemsInStage={this.props.getNumberOfWorkItemsInStage}
                                            getWipLimitInStage={this.props.getWipLimitInStage}
                                            stageId={this.props.stage.stageId}/>
                        <DeleteSwimLane swimLane={this.props.swimLane} getSwimLanesOfMiniStage={this.props.getSwimLanesOfMiniStage}
                                            getNumberOfWorkItemsInMiniStage={this.props.getNumberOfWorkItemsInMiniStage}
                                            getNumberOfWorkItemsInStage={this.props.getNumberOfWorkItemsInStage}
                                            getWipLimitInStage={this.props.getWipLimitInStage}
                                            stageId={this.props.stage.stageId}/>
                    </Dropdown>
                    </div>
                    </Card.Text>
                <div className = "container-work-items">
                        {workItems}
                </div>
                </Card.Body>
            </Card>
            </div>
        );
    }
}
export default SwimLane;
