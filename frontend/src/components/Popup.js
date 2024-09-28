import React from "react";
import './style/style.css'

function Popup(props) {
    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <div className="botaoFechar">
                    <button className="close-btn" onClick={() => props.setTrigger(false)}>X</button>
                </div>
                
                {props.children}
            </div>
        </div>
    ) : "";
}

export default Popup