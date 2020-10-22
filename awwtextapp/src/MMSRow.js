import React from 'react';
import './MMSRow.css'
import MMSForm from './MMSForm';

const MMSRow = () => (
    <>
        <div>
            <div id="mmsForm">
                <span></span>
                <span>
                    <MMSForm />
                </span>
                <span></span>
            </div>
            <div id="aboutText">
                Send /r/aww's top picture of the day to your chosen number.
            </div>
        </div>
    </>
);

export default MMSRow;