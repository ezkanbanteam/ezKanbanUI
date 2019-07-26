import React from 'react';
import axios from 'axios';
import { Button, Modal, Form, FormGroup, Col} from 'react-bootstrap';
import Select from 'react-select';
import Config from '../config.js';
import './History.css';

class History extends React.Component {
    constructor(props){
        super(props);
        this.state={
            show : false,
            list:[]
        }
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.getHistoryByWorkItemId = this.getHistoryByWorkItemId.bind(this);
    }

    getHistoryByWorkItemId(){
        let self =this;
        axios.get(Config.host + Config.kanban_api + '/workItem/getHistoryByWorkItemId/' + this.props.workItemId)
        .then(function (response) {
            let historyList = [];
            historyList.push(<tr>
                                <td align="center">No.</td>
                                <td align="center">Workitem</td>
                                <td align="center">Event</td>
                                <td align="center">Swimlane</td>
                                <td align="center">Category</td>
                                <td align="center">Time</td>
                             </tr>);
            let eventList = response.data.historyList;
            for(let i = 0; i < eventList.length; i ++){
                let num = i+1;
                let workItemDescription = eventList[i].workItemDescription;
                let event = eventList[i].event;
                let swimLaneTitle = eventList[i].swimLaneTitle;
                let categoryName = eventList[i].categoryName;
                let time = eventList[i].time;
                if(swimLaneTitle===undefined){
                    swimLaneTitle = "";
                }
                if(categoryName===undefined){
                    categoryName="";
                }
                historyList.push(<tr>
                            <td align="center">{num}</td>
                            <td align="center">{workItemDescription}</td>
                            <td >{event}</td>
                            <td align="center">{swimLaneTitle}</td>
                            <td align="center">{categoryName}</td>
                            <td align="center">at&nbsp;{time}</td>
                                </tr>);
            }
            self.setState({list:historyList});
            console.log(response.data.historyList);
        })
        .catch(function (error){
            console.log(error);
        });
    }

    handleShow(){
        this.setState({
            show : true 
        });
        this.getHistoryByWorkItemId();
    }

    handleClose(){
        this.setState({
            show : false
        });
    }


    render(){
        
        return(
            <div>
                <a onClick={this.handleShow}>History</a>
                <Modal show={this.state.show} onHide={this.handleClose} size="xl">
                    <Modal.Header closeButton>
                        <Modal.Title>History</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form horizontal>
                            <font size="5">
                                <table className="table">
                                    <tr align="center">
                                    {this.state.list}
                                    </tr>
                                </table>
                            </font>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default History;
