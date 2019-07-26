import React,{Component} from 'react';
import './Dropdown.css'

class Dropdown extends Component{


    render(){
        return(
            <div class="dropdown">
                <button class="dropbtn"></button>
                    <div class="dropdown-content">


                        {this.props.children}
                    </div>
            </div>
        );
    }
}
export default Dropdown;