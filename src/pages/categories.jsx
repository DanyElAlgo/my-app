import { useEffect, useState } from "react";
import { supabase } from "../services/auth-service";
import { useNavigate, Link } from "react-router";
import { AuthError } from "@supabase/supabase-js";
import CategoryItem from "../components/category-item";

export default function Categories({ session }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = session;

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

  async function createCategory(name) {
    setLoading(true);
    const newCategory = {
      name: name,
      user_id: user.id,
    };
    const { data, error } = await supabase
      .from("categories")
      .insert([newCategory])
      .single();
    if (error) {
      console.warn(error);
    } else if (data) {
      setCategories((prev) => [...prev, data]);
    }
    await fetchCategories();
    setLoading(false);
  }

  async function handleSubmit(event){
    event.preventDefault();
    const name = event.target.elements.name.value;
    if (name) {
      await createCategory(name);
      event.target.reset();
    }
  }

  async function handleDelete(id){
    setLoading(true);
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) {
      console.warn(error);
    } else {
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    }
    setLoading(false);
  }

  async function handleUpdate(id, name){
    setLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .update({ name: name })
      .eq("id", id)
      .eq("user_id", user.id)
      .single();
    if (error) {
      console.warn(error);
    } else if (data) {
      setCategories((prev) => prev.map((cat) => cat.id === id ? data : cat));
    }
    setLoading(false);
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      await fetchCategories();
      setLoading(false);
    }
    fetchData();
  }, [user.id]);

  return <div className="row flex flex-center">
    <div className="col-6 form-widget">
      <h1 className="header">Categories</h1>
      <p className="description">Create and manage your categories here, then use them for your todos.</p>
      <div className="form-widget">
        <h2>Create Category</h2>
        <form
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="name"
            placeholder="Category Name"
            required
          />
          <button type="submit" className="button primary">
            Create Category
          </button>
        </form>
        <h2>Categories List</h2>
        <div className="categories-list">
          {loading ? (
            <p>Loading...</p>
          ) : (
            categories.map((category) => (
              <CategoryItem
                key={category.id}
                item={category}
                deleteItem={handleDelete}/>
            ))
          )}
          </div>
      </div>
    </div>
  </div>;
}
