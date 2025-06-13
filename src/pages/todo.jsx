import { useEffect, useState } from "react";
import { supabase } from "../services/auth-service";
import { useNavigate, Link } from "react-router";
import { AuthError } from "@supabase/supabase-js";
import TodoItem from "../components/todo-item";
import TodoUpdateModal from "../components/todo-update-modal";

export default function Todo({ session }) {
  const [loading, setLoading] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { user } = session;

  // Conseguir los items y categorías de la base de datos según el id de usuario
  // Arriba hay una entrada para crear nuevos items
  // Cada item tiene la opción de actualizarse y de eliminarse
  // Los items todo pueden tickearse como completados sin hacer confirmaciones, es decir,
  // solo poner o quitar la palomita hará una actualización a la base de datos
  // Sin embargo, el resto de elementos (título, descripción, categoría y fecha límite) requieren
  // hacer click en una confirmación para mandar la actualización a la base de datos

  async function createItem(event) {
    event.preventDefault();
    setLoading(true);

    const newItem = {
      title: "New Item",
      description: "Description of the new item",
      category_fk: null, // No category selected
      creation_date: new Date(),
      user_id: user.id,
    };

    const { data, error } = await supabase
      .from("todos")
      .insert([newItem])
      .single();

    if (error) {
      console.warn(error);
    } else if (data) {
      setItemList((prev) => [...prev, data]);
    }
    setLoading(false);
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
  }, [user.id]);

  return (
    <div className="row flex flex-center">
      <div className="col-6 form-widget">
        <h1 className="header">Todo List</h1>
        <Link to={"/categories"}>
        Categories
        </Link>
        <p className="description">
          This is a placeholder for your Todo application.
        </p>
        <form onSubmit={createItem}>
          <button className="button block primary" disabled={loading}>
            {loading ? "Creating Item..." : "Create New Item"}
          </button>
        </form>
        {itemList.map((item) => (
          <TodoItem
            key={item.id}
            item={item}
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
      </div>
    </div>
  );
}
