import React, { Component } from 'react';
import axios from 'axios';
import {VictoryStack, VictoryArea, VictoryChart, VictoryLegend, VictoryAxis} from 'victory';
import {Modal, ModalBody } from 'react-bootstrap';
import Config from '../config.js';
import { conditionalExpression } from '@babel/types';
import CanvasJSReact from '../canvasjs.react';
import './CumulativeFlowDiagram.css'
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class CumulativeFlowDiagram extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            data: [],
            colorData: []
        }
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.getCumulativeFlowDiagram = this.getCumulativeFlowDiagram.bind(this);
        this.toggleDataSeries = this.toggleDataSeries.bind(this);
    }

    toggleDataSeries(e){
		if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		}
		else{
			e.dataSeries.visible = true;
		}
		this.chart.render();
	}

    getCumulativeFlowDiagram(){
        let self = this;
        axios.get(Config.host + Config.kanban_api + '/board/cumulativeFlowDiagram/' + this.props.boardId)
        .then(function (response) {
            let index = response.data.stagesTitle.entry;
            let CFDData =  response.data.CFDData;
            let array = [];
            let resultData = [];
            let colorData = [];
            for(let i = 0; i < index.length; i++){
                for(let j = 0; j < CFDData.length; j++){
                    for(let k = 0; k < index.length; k++){
                        if(index[i].key===CFDData[j].stages.entry[k].key){
                            array.push({
                                label:CFDData[j].date.substr(5,5).replace("-", "/"), y:CFDData[j].stages.entry[k].value})
                            
                            // array.push({x:"Day "+(j+1), y:CFDData[j].stages.entry[k].value});
                        }
                    }
                }  
            }

            for(let i = index.length-1; i >= 0 ; i--){
                colorData.push({name: index[i].value});
            }

            for(let i = 0; i < index.length; i++){
                let list = [];
                for(let j = 0; j < CFDData.length; j++){
                    list.push(array[i*CFDData.length+j]);
                }
                resultData.push(list);
            }
            self.setState({
                data : resultData,
                colorData : colorData
            });

        })
        .catch(function (error){
            console.log(error);
        });
    }

    handleShow(){
        this.getCumulativeFlowDiagram();
        this.setState({
            show: true
        });
    }

    handleClose(){
        this.setState({
            show: false
        });  
    }

    render() {
        // let victory = [];
        let list = [];

        let k = 0;
        for(let i = this.state.data.length-1; i >= 0 ; i--){
       
        // for(let i = 0; i < this.state.data.length; i++){
            let title = this.state.colorData[k++].name;

            list.push(
                {
                    legendMarkerType: "circle",
					type: "stackedArea",
					name: title,
					showInLegend: true,
					xValueFormatString: "YYYY",
                    dataPoints:this.state.data[i]
				}
            );
            // victory.push(
            //     <VictoryArea
            //         data={
            //             this.state.data[i]
            //         }
            //     />
            // )
        }


        const options = {
            theme: "light1",
            animationEnabled: true,
            exportEnabled: true,
            zoomEnabled: true,
            // title: {
            //     text: "Energy usage for Air Conditioning"
            // },
            axisY: {
                title: "WorkItems"
            },
            toolTip: {
                shared: true,
                reversed: true
            },
            legend: {
                // verticalAlign: "center",
                // horizontalAlign: "top",
                reversed: true,
                cursor: "pointer",
                itemclick: this.toggleDataSeries
            },
            width:900,
            height:500,
            data: list
      }


        return (
            
            <div>
                <div style={{display : 'flex'}}>
                    <button type="button" class="btn btn-outline-secondary" onClick={this.handleShow}>CumulativeFlowDiagram</button>
                    <Modal show={this.state.show} onHide={this.handleClose} size="xl">
                        <Modal.Header closeButton>
                            <Modal.Title>Cumulative Flow Diagram</Modal.Title>
                        </Modal.Header>
                        <ModalBody>
                            {/* <VictoryChart>
                                <VictoryLegend //x={125} y={10}
                                    orientation="horizontal"
                                    gutter={20}
                                    // style={{ border: { stroke: "black" } }}
                                    colorScale="warm"
                                    data={this.state.colorData}
                                    fixLabelOverlap
                                    />
                                
                                <VictoryStack colorScale="warm" animate={{
                                                                        duration: 1000,
                                                                        onLoad: { duration: 10 }
                                                                        }} fixLabelOverlap>
                                    
                                  
                                    {victory}

                                </VictoryStack>
                                
                            </VictoryChart> */}
                            <CanvasJSChart options = {options}
				 onRef={ref => this.chart = ref}
			/>
                        </ModalBody>
                    </Modal>
                </div>
            </div>
            
        );
    }
}

export default CumulativeFlowDiagram;