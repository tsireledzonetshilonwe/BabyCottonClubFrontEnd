import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Product = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/product/read/${id}`)
         .then((res) => setProduct(res.data))
         .catch((err) => console.error("Error fetching product:", err));
    }, [id]);

    if (!product) return <p>Loading...</p>;

    return (
     <div className="product-details">
         <img
          src={`http://localhost:8080/product/image/${product.productId}`}
          alt={product.name}
          width="300"
          height="300"
         />
         <h2>{product.name}</h2>
         <p>{product.brand}</p>
         <p>{product.description}</p>
         <p>Price: R{product.price}</p>
         <p>Category: {product.category}</p>
         <p>Stock: {product.stockQuantity}</p>
         <p>Release Date: {product.releaseDate}</p>
         <p>{product.productAvailable ? "Available" : "Not Available"}</p>
     </div>
    );
};

export default Product;
