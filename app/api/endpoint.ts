const url = 'https://dummyjson.com';
export const endpoint = {
  getProduct: (limit: number = 100) => `${url}/products?limit=${limit}`,
  getAllCategory: `${url}/products/categories`,
  getProductDetail: (id: number | string) => `${url}/products/${id}`,
  getProductPagination: (limit: number, skip: number) =>
    `${url}/products?limit=${limit}&skip=${skip}`,
  getProductByCategory: (category: string, limit: number, skip: number) =>
    `${url}/products/category/${category}?limit=${limit}&skip=${skip}`,
};
