import React from "react";
import "./css/CardContent.css";

export default function CardContent({title, body, state, createdAt}){
    return (<div className={"CardContent " + state}>
        <h3>{title}</h3>
        <p>{body}</p>
        <p className="created">Создано: {createdAt}</p>
    </div>)
}