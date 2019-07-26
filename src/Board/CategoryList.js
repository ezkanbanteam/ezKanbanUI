import React from 'react';
import axios from 'axios';
import { Button, Modal, Form, FormControl, FormGroup, Col} from 'react-bootstrap';
import { CirclePicker } from 'react-color';
import Config from '../config.js';
import Category from '../Category/Category.js';
import DeleteCategory from '../Category/DeleteCategory.js';
import './CategoryList.css'

class CategoryList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            selectedCategoryId: '', 
            categoryName: '',
            color: '', 
            categories : [], 
            isEditOrDelete: false
        }
        this.categoryNameOnChange = this.categoryNameOnChange.bind(this);
        this.colorOnChange = this.colorOnChange.bind(this);
        this.getCategoriesByBoardId = this.getCategoriesByBoardId.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmitToAddCategory = this.handleSubmitToAddCategory.bind(this);
        this.handleSubmitToEditCategory = this.handleSubmitToEditCategory.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleChangeComplete = this.handleChangeComplete.bind(this);
        this.goToEditOrDeleteCategoryPage = this.goToEditOrDeleteCategoryPage.bind(this);
        this.goToCategoryListPage = this.goToCategoryListPage.bind(this);
    }

    categoryNameOnChange(e) {
        this.setState({
            categoryName: e.target.value
        });
    }

    colorOnChange(e) {
        this.setState({
            color: e.target.value
        });
    }

    getCategoriesByBoardId(){
        let self =this;
        axios.get(Config.host + Config.kanban_api + '/category/getCategoriesByBoardId/' + this.props.boardId)
        .then(function (response) {
            let categoryList = response.data.categoryList;
            let categories = [];
            categoryList.forEach(category => {
                categories.push(<Category key={category.categoryId} category={category} goToEditOrDeleteCategoryPage={self.goToEditOrDeleteCategoryPage}/>)
            })
            self.setState({categories : categories});
        })
        .catch(function (error){
            console.log(error);
        });
    }

    handleShow(){
        this.setState({
            show: true
        });
        this.getCategoriesByBoardId();
    }

    handleClose(){
        this.setState({
            show: false,
            categoryName: '',
            color: '', 
            isEditOrDelete: false
        });
        this.props.getBoardByBoardId();
    }

    handleChangeComplete = (color) => {
        this.setState({ color: color.hex });
      };

    handleSubmitToAddCategory() {
        if (this.state.categoryName === '') {
            return;
        }
        let self = this;
        let categoryName = this.state.categoryName;
        let color = this.state.color;
        axios.post(Config.host + Config.kanban_api + '/category/addCategory',{
            boardId : this.props.boardId,
            categoryName : categoryName,
            color : color
        }).then(function (response) {
            self.getCategoriesByBoardId();
            self.goToCategoryListPage();
        }).catch(function (error){
            console.log(error);
        });
    }

    handleSubmitToEditCategory() {
        if (this.state.categoryName === '') {
            return;
        }
        let self = this;
        let categoryId = this.state.selectedCategoryId;
        let categoryName = this.state.categoryName;
        let color = this.state.color;
        axios.post(Config.host + Config.kanban_api + '/category/editCategory',{
            categoryId : categoryId, 
            categoryName : categoryName,
            color : color
        }).then(function (response) {
            self.getCategoriesByBoardId();
            self.goToCategoryListPage();
        }).catch(function (error){
            console.log(error);
        });
    }

    handleKeyPress(e){
        if (e.key === 'Enter') {
            e.preventDefault();
            if(this.state.isEditOrDelete){
                this.handleSubmitToEditCategory();
            }else{
                this.handleSubmitToAddCategory();
            }
        }
    }

    goToEditOrDeleteCategoryPage(category){
        this.setState({
            isEditOrDelete: true, 
            selectedCategoryId: category.categoryId, 
            categoryName: category.categoryName, 
            color: category.color
        });
    }

    goToCategoryListPage(){
        this.setState({
            categoryName: '', 
            color: '', 
            isEditOrDelete: false
        });
    }

    render() {
        return (
            <div>
                <div style={{display : 'flex'}}>
                    <button type="button" class="btn btn-outline-secondary" onClick={this.handleShow}>Manage Category</button>
                    <Modal show={this.state.show} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            {/* {this.state.isEditOrDelete ? 
                            <Button bsStyle="success" onClick={this.goToCategoryListPage}>Cancel</Button> : ''} */}
                            {/* <Button bsStyle="success" onClick={this.goToCategoryListPage}>Cancel</Button> */}
                            <Modal.Title><center>{this.state.isEditOrDelete ? "Edit Or Delete Category" : "Add New Category"}</center></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form horizontal>
                                <div style = {{display : 'flex'}}>
                                <Col componentClass={Form.Label} sm={5}>
                                        *Category Name:
                                </Col>
                                <Col sm={6}>
                                    <FormControl componentClass="input" placeholder="input the category name..." onChange={this.categoryNameOnChange} onKeyPress={this.handleKeyPress} value={this.state.categoryName}/>
                                </Col>
                                  
                                </div>
                                <br/>
                                {this.state.isEditOrDelete ? 
                                <div className="editCategory">
                                    <Button bsStyle="success" onClick={this.handleSubmitToEditCategory}>Save</Button>
                                    &nbsp;<DeleteCategory selectedCategoryId={this.state.selectedCategoryId} getCategoriesByBoardId={this.getCategoriesByBoardId} goToCategoryListPage={this.goToCategoryListPage}></DeleteCategory>
                                    &nbsp;{this.state.isEditOrDelete ? <Button bsStyle="success" onClick={this.goToCategoryListPage}>Cancel</Button> : ''}
                                </div> : 
                                <Col>
                                    
                                </Col>
                                }
                                <br/>
                                <FormGroup >
                                    <Col componentClass={Form.Label} sm={3}>
                                        Color:
                                    </Col>
                                    <CirclePicker className="color-picker-position" color={ this.state.color } onChangeComplete={ this.handleChangeComplete }/>
                                </FormGroup>
                                <Col componentClass={Form.Label}>
                                    (Note: * denotes a required field)
                                </Col>
                                <hr/>
                                <Modal.Title>Category List</Modal.Title>
                                <br/>
                                {this.state.categories}
                                {this.state.categories.length > 0 ? <Col componentClass={Form.Label}>Click the name of the category to edit or delete the category.</Col> : ''}
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.handleSubmitToAddCategory}>Add Category</Button>
                        </Modal.Footer>
                    </Modal>
                </div> 
            </div>
        );
    }

}

export default CategoryList;
