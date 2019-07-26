import React from 'react';
import { FormGroup, Col, Badge } from 'react-bootstrap';
class Category extends React.Component {
    constructor(props) {
        super(props);
        this.handleCategorySelect = this.handleCategorySelect.bind(this);
    }

    handleCategorySelect(){
        this.props.goToEditOrDeleteCategoryPage(this.props.category);
    }

    render(){
        const style = {
            backgroundColor: this.props.category.color
        };
        // bootstrapUtils.addStyle(Button, this.props.category.categoryId);
        return(
            <FormGroup>
                <Col sm={2} >
                <style type="text/css">
                    {`
                        .btn-` + this.props.category.categoryId + ` {
                            background-color: `+ this.props.category.color + `;
                            color: black;
                        }
                    `}
                </style>
                <Badge pill style={style} onClick={this.handleCategorySelect}>
                            <h5>
                            &nbsp;&nbsp;{this.props.category.categoryName}&nbsp;&nbsp;
                            </h5>
                        </Badge>
                
                
                
                </Col>
            </FormGroup>
        )
    }
}

export default Category;