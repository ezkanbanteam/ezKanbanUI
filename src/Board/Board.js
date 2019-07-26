import React from 'react';
import axios from 'axios';
import './Board.css';
import StageAdder from './StageAdder';
import CategoryList from './CategoryList';
import Stage from '../Stage/Stage.js';
import Config from '../config.js';
import eventProxy from '../eventProxy.js';
import BoardEditor from './BoardEditor';
import { Navbar, Nav, Badge } from 'react-bootstrap';
import CumulativeFlowDiagram from './CumulativeFlowDiagram';
import { isThursday } from 'date-fns/esm';

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            boardName:'',
            stages: [],
            swimLanes : [],
            miniStages : [],
            board:''
        }
        this.addStage = this.addStage.bind(this);
        this.getStagesByBoardId = this.getStagesByBoardId.bind(this);
        this.getBoardByBoardId = this.getBoardByBoardId.bind(this);
        this.changeBoardName = this.changeBoardName.bind(this);
        this.initialBoardName = this.initialBoardName.bind(this);
        this.initialBoard = this.initialBoard.bind(this);
        this.initialBoard(1);
        this.initialBoardName();
        this.getStagesByBoardId();
    }

    

    addStage(stage){
        let board;
        board = this.state.board;
        var stages = this.state.stages;
        stages.push(<Stage key={stage.stageId} stage={stage} getStagesByBoardId={this.getStagesByBoardId} getBoardByBoardId={this.getBoardByBoardId}
            beginningLeadTimeBoundaryByMiniStageId = {board.beginningLeadTimeBoundaryByMiniStageId}
            endingLeadTimeBoundaryByMiniStageId = {board.endingLeadTimeBoundaryByMiniStageId}
        />);
        this.setState({stages:stages});
    }

    getStagesByBoardId(){
        let board;
        board = this.state.board;
        let self =this;
        axios.get(Config.host + Config.kanban_api + '/stage/getStagesByBoardId/' + board.boardId)
        .then(function (response) {
            self.setState({
                stages: []
            });
            let stageList = response.data.stageList;
            for(let i = 0; i < stageList.length; i++){
                self.addStage(stageList[i]);
            }
        })
        .catch(function (error){
            console.log(error);
        });
    }

    initialBoard(fakeBoardId){
        let board;
        board = this.state.board;
        let self =this;
        axios.get(Config.host + Config.kanban_api + '/board/getBoardByBoardId/' + fakeBoardId)
        .then(function (response) {
            let board = response.data.board;
            self.setState({board : board});
            eventProxy.trigger('getStagesAfterBoardUpdate','end');
        })
        .catch(function (error){
            console.log(error);
        });
    }


    getBoardByBoardId(){
        let board;
        board = this.state.board;
        let self =this;
        axios.get(Config.host + Config.kanban_api + '/board/getBoardByBoardId/' + board.boardId)
        .then(function (response) {
            let board = response.data.board;
            self.setState({board : board});
            eventProxy.trigger('getStagesAfterBoardUpdate','end');
        })
        .catch(function (error){
            console.log(error);
        });
    }

    initialBoardName(){
        this.setState({
            boardName: this.state.board.name
        });
    }

    changeBoardName(name){
        let board;
        board = this.state.board; 
        this.setState({
            boardName: name
        });
    }

    

    render(){
        eventProxy.off('getStagesAfterBoardUpdate');
        var stages = [];
        this.state.stages.forEach(stage => {
            stages.push(stage);
        });
        eventProxy.on('getStagesAfterBoardUpdate' , (msg) => {
            this.getStagesByBoardId();
        });
    
        document.body.style = 'background: #DDDDDD;';

        let board;

        board = this.state.board;
        if(this.state.boardName!==board.name && this.state.boardName!==''){
            board.name = this.state.boardName;
        }

        return(
            
            <div>
                    <Navbar bg="primary" variant="dark" className="fixed-top">
                    <Navbar.Brand onClick={this.goBackToUser}>
                        ezKanban
                        <Badge pill variant="secondary" className="kanban-name">
                            <h5>
                                {board.name}
                            </h5>
                        </Badge>
                    </Navbar.Brand>
                    <Nav className="mr-auto">
                        {/* <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#features">Features</Nav.Link>
                        <Nav.Link href="#pricing">Pricing</Nav.Link> */}
                    </Nav>
                    
                    
                </Navbar>
                <br/><br/><br/><br/>
                <div className="button-position" style = {{display : 'flex'}}>
                    <StageAdder getBoardByBoardId={this.getBoardByBoardId} boardId={board.boardId}/>
                    &nbsp;<BoardEditor getBoardByBoardId={this.getBoardByBoardId} board={board} changeBoardName={this.changeBoardName}/>
                    &nbsp;<CategoryList getBoardByBoardId={this.getBoardByBoardId} boardId={board.boardId}/>
                    &nbsp;<CumulativeFlowDiagram boardId={board.boardId}/>
                </div>
                <div className="container-stages">
                    {stages}
                </div>
            </div>
        )
    }
}

export default Board;
