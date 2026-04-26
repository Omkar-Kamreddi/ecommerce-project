import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
  });

  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("editProduct");

    if (stored) {
      const parsed = JSON.parse(stored);
      setProduct(parsed);
      setIsEdit(true);

      //clear immediately
      localStorage.removeItem("editProduct");
    } else {
      // ensure clean state
      setIsEdit(false);
      setProduct({
        name: "",
        price: "",
        description: "",
      });
    }
  }, []);

  const handleSubmit = async () => {
    try {
      if (isEdit && product.id) {
        // UPDATE
        await API.put(`/api/products/${product.id}`, product);
      } else {
        // ADD
        await API.post("/api/products", product);
      }

      navigate("/dashboard");

    } catch (err) {
      alert("Operation failed");
    }
  };

  return (
    <div className="flex justify-center pt-28">

      <Navbar />

      <div className="p-8 border backdrop-blur-xl bg-white/10 border-white/20 rounded-2xl w-96">

        <h2 className="mb-4 text-xl font-bold text-center">
          {isEdit ? "Edit Product" : "Add Product"}
        </h2>

        <input
          value={product.name}
          className="w-full p-3 mb-3 rounded bg-gray-800/60"
          placeholder="Name"
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
        />

        <input
          value={product.price}
          className="w-full p-3 mb-3 rounded bg-gray-800/60"
          placeholder="Price"
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
        />

        <input
          value={product.description}
          className="w-full p-3 mb-3 rounded bg-gray-800/60"
          placeholder="Description"
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
        />

        <button
          onClick={handleSubmit}
          className="w-full py-2 mt-3 bg-blue-500 rounded hover:bg-blue-600"
        >
          {isEdit ? "Update" : "Add"}
        </button>

      </div>
    </div>
  );
}

export default AddProduct;