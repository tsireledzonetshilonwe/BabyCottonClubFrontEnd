import { fetchProducts as apiFetchProducts } from '../api/api';

export const fetchProducts = async () => {
  return await apiFetchProducts();
};