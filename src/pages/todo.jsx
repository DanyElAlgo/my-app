import { useEffect, useState } from "react";
import { supabase } from "../services/auth-service";
import { useNavigate } from "react-router";
import TodoItem from "../components/todo-item";

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
      is_completed: false,
      creation_date: new Date(),
      user_id: user.id,
    };

    const { data, error } = await supabase
      .from("todos")
      .insert([newItem])
      .select("*")
      .single();

    if (error) {
      console.warn(error);
    } else if (data) {
      data.category =
        categories.find((cat) => cat.id === data.category_fk)?.name ||
        "Uncategorized";
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
      <div className="col-9 form-widget">
        <h1 className="text-3xl font-bold">Todo List</h1>
        <p className="description text-xl">
          Create here your tasks pending to do.
        </p>

        {loading ? (
          <p>Loading items...</p>
        ) : (
          <>
            {ready ? (
              <form className="flex flex-col gap-4" onSubmit={createItem}>
                <label>Task title (required):</label>
                <input
                  className="form-input block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Task title"
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
                  className="form-input block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Optional description"
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
                  className="form-select block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                <div className="flex flex-row justify-between">
                  <input
                    type="submit"
                    value="Submit"
                    className="m-4 button block bg-green-200 hover:bg-green-500 text-white py-2 px-4 rounded dark:bg-green-800 dark:hover:bg-green-650"
                  />
                  <button
                    className="m-4 button block bg-red-200 hover:bg-red-500 text-white py-2 px-4 rounded dark:bg-red-800 dark:hover:bg-red-650"
                    onClick={() => {
                      setReady(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <button
                  className="button block bg-blue-200 hover:bg-blue-500 text-white py-2 px-4 rounded dark:bg-blue-800 dark:hover:bg-blue-650"
                  onClick={() => {
                    setReady(true);
                  }}
                >
                  Create new todo
                </button>
              </>
            )}
            <div className="flex flex-row flex-wrap justify-center">
              {itemList.map((item) => (
                <TodoItem
                  key={item.id}
                  item={item}
                  categories={categories}
                  updateItem={async (updatedItem) => {
                    const { category, ...itemToUpdate } = updatedItem;
                    const { data, error } = await supabase
                      .from("todos")
                      .update(itemToUpdate)
                      .eq("id", updatedItem.id)
                      .select("*")
                      .single();

                    if (error) {
                      console.warn(error);
                    } else if (data) {
                      data.category =
                        categories.find((cat) => cat.id === data.category_fk)
                          ?.name || "Uncategorized";
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
          </>
        )}
      </div>
    </div>
  );
}
