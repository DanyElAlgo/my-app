import { useEffect, useState } from "react";
import { supabase } from "../services/auth-service";
import { useNavigate, Link } from "react-router";
import { AuthError } from "@supabase/supabase-js";
import TodoItem from "../components/todo-item";
import TodoUpdateModal from "../components/todo-update-modal";

export default function Todo({ session }) {
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_fk: null,
  });
  const navigate = useNavigate();
  const { user } = session;

  // Los items todo pueden tickearse como completados sin hacer confirmaciones, es decir,
  // solo poner o quitar la palomita hará una actualización a la base de datos

    async function createItem(event) {
    event.preventDefault();
    setLoading(true);

    const newItem = {
      title: formData.title,
      description: formData.description || null,
      category_fk: formData.category_fk || null,
      creation_date: new Date(),
      user_id: user.id,
    };

    const { data, error } = await supabase
      .from("todos")
      .insert([newItem])
      .select('*')
      .single();

    if (error) {
      console.warn(error);
    } else if (data) {
      data.category = categories.find((cat) => cat.id === data.category_fk)?.name || "Uncategorized";
      setItemList((prev) => [...prev, data]);
    }
    
    setLoading(false);
    setReady(false);
    setFormData({
      title: "",
      description: "",
      category_fk: null,
    });
  }

  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.warn(error);
      } else if (data) {
        data.forEach((element) => {
          element.category =
            categories.find((cat) => cat.id === element.category_fk)?.name ||
            "Uncategorized";
        });

        setItemList(data);
      }
      setLoading(false);
    }

    async function fetchCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.warn(error);
      } else if (data) {
        setCategories(data);
      }
    }

    fetchItems();
    fetchCategories();
    setReady(false);
  }, [user.id]);

  return (
    <div className="row flex flex-center">
      <div className="col-6 form-widget">
        <h1 className="header">Todo List</h1>
        <Link to={"/categories"}>Categories</Link>
        <p className="description">Create here your tasks pending to do.</p>

        {loading ? (
          <p>Loading items...</p>
        ) : (
          <>
            {ready ? (
              <form onSubmit={createItem}>
                <label>Task title (required):</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      title: e.target.value,
                    });
                  }}
                />
                <label>Description:</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    });
                  }}
                />
                <label>Category:</label>
                <select
                  name="category_fk"
                  id="category_fk"
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      category_fk: e.target.value || null,
                    });
                  }}
                >
                  <option value="">Uncategorized</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <input
                  type="submit"
                  value="Submit"
                />
              </form>
            ) : (
              <button onClick={()=>{setReady(true)}}>Create new todo</button>
            )}
            {itemList.map((item) => (
              <TodoItem
                key={item.id}
                item={item}
                categories={categories}
                updateItem={async (updatedItem) => {
                  const { data, error } = await supabase
                    .from("todos")
                    .update(updatedItem)
                    .eq("id", updatedItem.id)
                    .single();

                  if (error) {
                    console.warn(error);
                  } else if (data) {
                    setItemList((prev) =>
                      prev.map((i) => (i.id === updatedItem.id ? data : i))
                    );
                  }
                }}
                deleteItem={async (id) => {
                  const { error } = await supabase
                    .from("todos")
                    .delete()
                    .eq("id", id);
                  if (error) {
                    console.warn(error);
                  } else {
                    setItemList((prev) => prev.filter((i) => i.id !== id));
                  }
                }}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
