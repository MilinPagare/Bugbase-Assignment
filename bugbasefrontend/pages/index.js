import { useEffect, useState } from "react";
import styles from "./index.module.css";

const ip = "192.168.29.5";

const Index = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    status: false,
    edit: false,
  });
  const [todoList, setTodoList] = useState([]);
  const [search, setSearch] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [radioBtn, setRadioBtn] = useState("all");

  let tempTodoList = todoList.filter((item) => {
    const tempSearchKeyword = search.toLowerCase();
    if (item.title.toLowerCase().search(tempSearchKeyword) > -1) {
      return item;
    }
  });

  if (searchDate !== "") {
    tempTodoList = tempTodoList.filter((item) => {
      if (new Date(item.createdAt) >= new Date(searchDate)) {
        return item;
      }
    });
  }

  if (radioBtn === "complete") {
    tempTodoList = tempTodoList.filter((item) => item.status);
  }

  if (radioBtn === "incomplete") {
    tempTodoList = tempTodoList.filter((item) => !item.status);
  }

  const getTodoList = async () => {
    try {
      const response = await fetch(`http://${ip}:8082/todolist/all`);
      const result = await response.json();
      const data = result.map((item) => {
        return { ...item, edit: false };
      });
      setTodoList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const changeTitle = (event) => {
    setInput({ ...input, title: event.target.value });
  };

  const changeDescription = (event) => {
    setInput({ ...input, description: event.target.value });
  };

  const changeStatus = () => {
    setInput({ ...input, status: !input.status });
  };

  const handleClickAdd = async () => {
    // Post method
    if (input.title !== "" && input.description !== "") {
      try {
        const response = await fetch(`http://${ip}:8082/todolist/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: input.title,
            description: input.description,
            status: input.status,
          }),
        });
        const result = await response.json();
        const data = result.map((item) => {
          return { ...item, edit: false };
        });
        setTodoList(data);
        setInput({ title: "", description: "", status: false, edit: false });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleEdit = (id) => {
    const tempList = [...todoList];
    const temp = todoList.findIndex((item) => {
      return item._id === id;
    });
    tempList[temp].edit = !tempList[temp].edit;
    setTodoList(tempList);
  };

  const handleDelete = async (id) => {
    // Delete method
    try {
      const response = await fetch(`http://${ip}:8082/todolist/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: id,
        }),
      });
      const result = await response.json();
      const data = result.map((item) => {
        return { ...item, edit: false };
      });
      setTodoList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditTitle = (e, id) => {
    const tempList = [...todoList];
    const temp = todoList.findIndex((item) => {
      return item._id === id;
    });
    tempList[temp].title = e.target.value;
    setTodoList(tempList);
  };

  const handleEditDescription = (e, id) => {
    const tempList = [...todoList];
    const temp = todoList.findIndex((item) => {
      return item._id === id;
    });
    tempList[temp].description = e.target.value;
    setTodoList(tempList);
  };

  const handleEditStatus = (id) => {
    const tempList = [...todoList];
    const temp = todoList.findIndex((item) => {
      return item._id === id;
    });
    tempList[temp].status = !tempList[temp].status;
    setTodoList(tempList);
  };

  const handleSave = async (item) => {
    // Put Method
    try {
      const response = await fetch(`http://${ip}:8082/todolist/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: item._id,
          title: item.title,
          description: item.description,
          status: item.status,
        }),
      });
      const result = await response.json();
      const data = result.map((item) => {
        return { ...item, edit: false };
      });
      setTodoList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const searchByTitle = (e) => {
    setSearch(e.target.value);
  };

  const searchByDate = (e) => {
    setSearchDate(e.target.value);
  };

  const handleRadioBtns = (event) => {
    setRadioBtn(event.target.value);
  };

  useEffect(() => {
    getTodoList();
  }, []);

  return (
    <div className={styles.container}>
      <div>
        <h1>Todo List App</h1>
        <label htmlFor="title">Title : </label>
        <input
          id="title"
          type="text"
          value={input.title}
          onChange={changeTitle}
        />
        <label htmlFor="description">Description : </label>
        <input
          id="description"
          type="text"
          value={input.description}
          onChange={changeDescription}
        />
        <label htmlFor="status">Status : </label>
        <input
          id="status"
          checked={input.status}
          type="checkbox"
          onChange={changeStatus}
        />
        <button className={styles.btn} onClick={handleClickAdd}>
          Add
        </button>
      </div>
      <div>
        <h3>List :</h3>
        <div className={styles.filterContainer}>
          <div>
            Search by title:
            <input
              type="text"
              value={search}
              onChange={(e) => {
                searchByTitle(e);
              }}
            />
          </div>
          <div>
            Filter By Date:
            <input
              type="date"
              value={searchDate}
              onChange={(e) => {
                searchByDate(e);
              }}
            />
          </div>
          <div>
            Filter by Status :<label htmlFor="status">all</label>
            <input
              type="radio"
              value={"all"}
              checked={radioBtn === "all"}
              onChange={(e) => handleRadioBtns(e)}
            />
            <label htmlFor="status">complete</label>
            <input
              type="radio"
              value={"complete"}
              checked={radioBtn === "complete"}
              onChange={(e) => handleRadioBtns(e)}
            />
            <label htmlFor="status">incomplete</label>
            <input
              type="radio"
              value={"incomplete"}
              checked={radioBtn === "incomplete"}
              onChange={(e) => handleRadioBtns(e)}
            />
          </div>
        </div>
        <ul>
          {tempTodoList.map((item) => {
            return (
              <li key={item._id} className={styles.liEle}>
                {item.edit ? (
                  <>
                    <label htmlFor="title">Title : </label>
                    <input
                      type="text"
                      id="title"
                      value={item.title}
                      onChange={(e) => handleEditTitle(e, item._id)}
                    />
                    <label htmlFor="description">Description : </label>
                    <input
                      type="text"
                      id="description"
                      value={item.description}
                      onChange={(e) => handleEditDescription(e, item._id)}
                    />
                    <label htmlFor="status">Status : </label>
                    <input
                      id="status"
                      checked={item.status}
                      type="checkbox"
                      onChange={() => handleEditStatus(item._id)}
                    />
                    <button
                      className={styles.btn}
                      onClick={() => {
                        handleSave(item);
                      }}
                    >
                      save
                    </button>
                  </>
                ) : (
                  <>
                    <h4>Title : {item.title}</h4>
                    <p>Description : {item.description}</p>
                    <p>Created At : {item.createdAt}</p>
                    <p>Status : {item.status ? "Completed" : "Incomplete"}</p>
                    <button
                      className={styles.btn}
                      onClick={() => {
                        handleEdit(item._id);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.btn}
                      onClick={() => {
                        handleDelete(item._id);
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Index;
