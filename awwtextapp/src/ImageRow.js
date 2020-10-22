import React from 'react';
import './ImageRow.css';
import './fonts/IndieFlower-Regular.ttf';
import cuteLogo from './jennifer-chen-aB3wYypke8M-unsplash.jpg';

const ImageRow = () => (
    <>  
        <div>
            <span></span>
            <span className="titleSpan">
                AwwText
            </span>
            <span></span>
        </div>
        <div>
            <span></span>
            <span>
            <img id="cuteLogo" src={cuteLogo} className="App-logo" alt="Brown bunny with tan plush bunny toy" />
            </span>
            <span></span>
        </div>
    </>
);

export default ImageRow;