import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// *** Действия после перетаскивания**
import { onDragEnd } from "./logic/dragAndDrop";

// **Модуль для fetch-запросов**
import { loadIssues, updateIssues } from "./requests/requests";

import { dataMapper } from "./logic/dataMapping";
// **Содержимое каждой карточки**
import CardContent from "./components/CardContent";

import "./App.css";


// Заготовка для колонок
const columnsFromBackend = {
  open: {
    name: "Надо бы сделать",
    items: [],
  },
  closed: {
    // Заменить "close" на "closed" для соотвтествия полю state!
    name: "Готовенько!",
    items: [],
  },
};

export default function App() {
  // **Состояние для котображения колонок**
  const [columns, setColumns] = useState(columnsFromBackend);
  // **Состояние для  Issues**
  const [issues, setIssues] = useState([]);

  // **Загрузка данных при монтировнии (аналогично componentDidMount)**
  useEffect(() => {
    loadIssues(setIssues);
  }, []);

  // **Изменение состояния колонок при изменении issues**
  useEffect(() => {
    // console.log(issues, columns)
    if (!issues.length) return;

    // **Распределяем по колонкам содержимое issues**
    const newColumns = dataMapper(issues, columns);

    console.log(issues);
    // Устанавиливаем состояние колонок
    setColumns(newColumns);
  }, [issues]); // срабатывание только при изменении issues / columns (?)

  return (
    <div className="App">
      <h1>Гибкий асинхронный канбан! </h1>
      <p>
        {" "}
        Изменения синхронизированы с:{" "}
        <a
          href="https://github.com/Maxxxnech/l10_t10_test_authorization/issues"
          target="_blank"
          rel="noreferrer"
        >
          github.com/Maxxxnech/l10_t10_test_authorization/issues
        </a>
      </p>
      <div
        style={{ display: "flex", justifyContent: "center", height: "100%" }}
      >
        <DragDropContext
          onDragEnd={(result) =>
            onDragEnd(
              result,
              columns,
              setColumns,
              //**************После перетаскивания - обновляем удаленный репозиторий ***/
              updateIssues(
                result.destination.droppableId,
                result.draggableId,
                //***После обновления репозитория - подтягиваем данные в приложение*** */
                () => loadIssues(setIssues)
              )
            )
          }
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                key={columnId}
              >
                <h2>{column.name}</h2>
                <div style={{ margin: 8 }}>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "lightblue"
                              : "lightgrey",
                            padding: 4,
                            width: 250,
                            minHeight: 500,
                          }}
                        >
                          {column.items.map((item, index) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        userSelect: "none",
                                        padding: 16,
                                        margin: "0 0 8px 0",
                                        minHeight: "50px",
                                        backgroundColor: snapshot.isDragging
                                          ? "#263B4A"
                                          : "#456C86",
                                        color: "white",
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      {item.content}
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
}
