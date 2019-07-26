import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter, Route} from 'react-router-dom';
import Board from './Board/Board';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

ReactDOM.render(
    (
        <BrowserRouter>
            <Route exact path="/" component={Board}></Route>
        </BrowserRouter>
    ),
    document.getElementById('root')
);
serviceWorker.unregister();
