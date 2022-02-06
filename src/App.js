import React, { PureComponent, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// **Модуль для fetch-запросов**
import { loadIssues, updateIssues } from "./components/requests";
// **Содержимое каждой карточки**
import CardContent from "./components/CardContent";
import "./App.css";
// a little function to help us with reordering the result
// const reorder = (list, startIndex, endIndex) => {
//   const result = Array.from(list);
//   const [removed] = result.splice(startIndex, 1);
//   result.splice(endIndex, 0, removed);

//   return result;
// };

// const grid = 8;

// const getItemStyle = (isDragging, draggableStyle) => ({
//   // some basic styles to make the items look a bit nicer
//   userSelect: "none",
//   padding: grid * 2,
//   margin: `0 0 ${grid}px 0`,

//   // change background colour if dragging
//   background: isDragging ? "lightgreen" : "grey",

//   // styles we need to apply on draggables
//   ...draggableStyle,
// });

// const getListStyle = (isDraggingOver) => ({
//   background: isDraggingOver ? "lightblue" : "lightgrey",
//   padding: grid,
//   width: 250,
// });

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

const onDragEnd = (result, columns, setColumns, cbk) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);

    //**Состояние issue будет соотвтетствовать droppableId колонки, в которую перенесли карточку*/
    // result.draggableId - id issue в репозитории
    cbk && cbk();

    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
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
    let newColumns = { ...columns };

    // Создаем элементы для каждого issue
    const mappedIssues = issues.map((el) => ({
      id: `${el.number}`,
      state: el.state, // для упрощения фильтрации
      content: (
        <CardContent
          title={el.title}
          body={el.body}
          state={el.state}
          createdAt={el.created_at}
        />
      ),
    }));

    // **Распределяем issue по колонкам Open / Close в зависимости от статуса выполнения**
    for (let key in newColumns) {
      let filtered = mappedIssues.filter(
        (el) => el.state.toLowerCase() === key.toLowerCase()
      );
      newColumns[key].items = filtered;
      console.log(key, filtered);
    }
    console.log(issues);
    // Устанавиливаем состояние колонок
    setColumns(newColumns);
  }, [issues]); // срабатывание только при изменении issues

  return (
    <div className="App">
      <h1>Гибкий асинхронный канбан! </h1>
      <p>
        {" "}
        Изменения синхронизированы с:{" "}
        <a
          href="https://github.com/Maxxxnech/l10_t10_test_authorization/issues"
          target="_blank"
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
              updateIssues(
                result.destination.droppableId,
                result.draggableId,
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
