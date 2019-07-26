import React,{Component} from 'react';
import axios from 'axios';
import './WorkItem.css';
import Config from '../config.js';
import eventProxy from '../eventProxy';
import { Card, Badge} from 'react-bootstrap';
import CycleTimeCalculator from './CycleTimeCalculator';
import TaskList from './TaskList';
import DeleteWorkItem from './DeleteWorkItem';
import WorkItemEditor from './WorkItemEditor';
import History from './History';
import Dropdown from '../Dropdown/Dropdown'

class WorkItem extends Component{ 
    constructor(props){
        super(props);
        this.state={
            category: undefined
        }
        this.getCategoryByCategoryId = this.getCategoryByCategoryId.bind(this);
        this.getCategoryByCategoryId(this.props.workItem.categoryId);
    }

    onDragStart = (ev) => {
        ev.dataTransfer.setData("workItemId", this.props.workItem.workItemId);
        ev.dataTransfer.setData("originalStageId", this.props.stage.stageId);
        ev.dataTransfer.setData("originalSwimLaneId", this.props.workItem.swimLaneId);
     }

     onDragEnd = (ev) => {
        eventProxy.on('updateWipLimitAfterMoveWorkItem',(msg) => {
            this.props.getWorkItemsOfSwimLane(this.props.workItem.swimLaneId);
            this.props.getNumberOfWorkItemsInMiniStage(this.props.miniStageId);
            this.props.getNumberOfWorkItemsInStage(this.props.stage.stageId);
            this.props.getWipLimitInStage(this.props.stage.stageId);
        });
    }

    getCategoryByCategoryId(categoryId){
        let self =this;
        axios.get(Config.host + Config.kanban_api + '/category/getCategoriesByBoardId/' + this.props.stage.boardId)
        .then(function (response) {
            let categoryList = response.data.categoryList;
            for(let i = 0; i < categoryList.length; i++){
                if(categoryId === categoryList[i].categoryId) {
                    self.setState({category: categoryList[i]});
                }
            }
        })
        .catch(function (error){
            console.log(error);
        });
    }

    render(){
        const style = {
            backgroundColor: this.state.category === undefined ? '' : this.state.category.color
        };
          
        return(
            <div>
             <Card className="work-item-card" bg='warning' draggable
                onDragStart = {(e)=>this.onDragStart(e)}
                onDragEnd = {(e) => this.onDragEnd(e)}>
                <Card.Body>
                    {/* <Card.Title> */}
                        <Badge pill style={style}>
                             &nbsp; &nbsp; &nbsp; &nbsp;
                        </Badge>
                            <div className="position-toggle-button-right">
                                <Dropdown>
                                    <WorkItemEditor workItem={this.props.workItem} boardId={this.props.stage.boardId} getWorkItemsOfSwimLane={this.props.getWorkItemsOfSwimLane} category={this.state.category}/>
                                    <DeleteWorkItem workItem={this.props.workItem} miniStageId={this.props.miniStageId} stageId={this.props.stage.stageId} 
                                                getNumberOfWorkItemsInMiniStage={this.props.getNumberOfWorkItemsInMiniStage}
                                                getNumberOfWorkItemsInStage={this.props.getNumberOfWorkItemsInStage}
                                                getWipLimitInStage={this.props.getWipLimitInStage}
                                                getWorkItemsOfSwimLane={this.props.getWorkItemsOfSwimLane}/>
                                    <CycleTimeCalculator workItemId={this.props.workItem.workItemId} boardId={this.props.stage.boardId}/>

                                    <TaskList workItemId={this.props.workItem.workItemId}/>
                                    <History workItemId={this.props.workItem.workItemId}/>
                                </Dropdown>

                            </div>

                    {/* </Card.Title> */}
                    <Card.Text>
                    
                        <strong>{this.props.workItem.description}</strong>
                        
                        
                    </Card.Text>
                </Card.Body>
            </Card>

                
                
            </div>
            

        )
    }
}

export default WorkItem;
