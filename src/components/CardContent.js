import React from "react";
import "./css/CardContent.css";

export default function CardContent({title, body, state, createdAt, closedAt}){
    return (<div className={"CardContent " + state}>
        <h3>{title}</h3>
        <p className="body">{body}</p>
        <p className="dates">Создано: {createdAt}</p>
        {closedAt && <p className="dates">Закрыто: {closedAt}</p>}
    </div>)
}