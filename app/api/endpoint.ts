const url = 'https://dummyjson.com';
export const endpoint = {
  getProduct: `${url}/products?limit=100`,
  getAllCategory: `${url}/products/categories`,
  getProductDetail: (id: any) => `${url}/products/${id}`,
  getProductDetailPagination: (id: any, limit: Int16Array, skip: any) =>
    `${url}/products/?limit=10&skip=10`,
};
