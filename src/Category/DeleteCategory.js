import React from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';
import Config from '../config.js';
import '../Button.css';

class DeleteCategory extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            show : false
        };

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleShow(){
        this.setState({
            show : true
        });
    }

    handleClose(){
        this.setState({
            show : false
        });
    }

    handleSubmit(){
        let self = this;
        let categoryId = this.props.selectedCategoryId;
        axios.delete(Config.host + Config.kanban_api + '/category/deleteCategory',{
            data : {
                categoryId : categoryId
            }
        }).then(function (response) {
            self.props.getCategoriesByBoardId();
            self.props.goToCategoryListPage();
        }).catch(function (error){
            console.log(error);
        });
    }

    render(){
        return (
            <div>
                {/* <Button bsStyle="danger" onClick={this.handleShow}>
                    Delete
                </Button> */}
                <button type="button" class="btn btn-outline-danger" onClick={this.handleShow}>Delete</button>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Category</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form horizontal>
                            Do you want to delete category?
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleSubmit}>Submit</Button>
                        <Button onClick={this.handleClose}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
export default DeleteCategory;
