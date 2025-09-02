import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/product/getall")
         .then((res) => setProducts(res.data))
         .catch((err) => console.error("Error fetching products:", err));
    }, []);

    return (
     <div className="home">
         <h2>Available Products</h2>
         <div className="product-list">
             {products.map((product) => (
              <div className="product-card" key={product.productId}>
                  <img
                   src={`http://localhost:8080/product/image/${product.productId}`}
                   alt={product.name}
                   width="200"
                   height="200"
                  />
                  <h3>{product.name}</h3>
                  <p>{product.brand}</p>
                  <p>{product.description}</p>
                  <p>Price: R{product.price}</p>
                  <p>Category: {product.category}</p>
                  <p>Stock: {product.stockQuantity}</p>
                  <p>Release Date: {product.releaseDate}</p>
                  <p>{product.productAvailable ? "Available" : "Not Available"}</p>
              </div>
             ))}
         </div>
     </div>
    );
};

export default Home;
