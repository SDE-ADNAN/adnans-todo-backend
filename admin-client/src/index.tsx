import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import store from './ReduxStore/store';
import { BrowserRouter } from "react-router-dom";

const ReduxProvider = Provider

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <ReduxProvider store={store}>
                <App />
            </ReduxProvider>
        </BrowserRouter>
    </React.StrictMode>
    , document.getElementById('root'));

// Before
// ReactDOM.render(<App />, document.getElementById('root'));

// After
// createRoot(document.getElementById('root')).render(<App />);