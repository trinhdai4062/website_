import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  items: [],
  total: 0,
  quantityProduct: 0,
};
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addtoCart: (state, action) => {
      const { userId, item } = action.payload;
      if (!userId || !userId._id) {
        console.error("userId không hợp lệ hoặc không có _id", userId);
        return;
      }
      const existingCartIndex = state.items.findIndex(cartItem => {
        // Kiểm tra xem cartItem.userId có tồn tại và có _id không
        if (!cartItem.userId || !cartItem.userId._id) {
          return false;
        }
        return cartItem.userId._id === userId._id;
      });
      // console.log('ex',extenCartIndex) 

      if (existingCartIndex !== -1) {
        const existingCart = state.items[existingCartIndex];
        // console.log('existingCart',item)
        item.forEach((element) => {
          // console.log('element',element)
          const existingIndex = existingCart.item.findIndex(
            (i) => i.productId === element.productId
          );
          const existingSize = existingCart.item.findIndex(
            (i) => i.size === element.size
          );
          const existingColor = existingCart.item.findIndex(
            (i) => i.color === element.color
          );
          // console.log('existingIndex', existingIndex)
          // console.log('existingSize', existingSize)
          // console.log('existingColor', existingColor)
          // console.log('item.quantity',element.quantity)

          if (existingIndex !== -1) {
            if (existingSize !== -1 && existingColor !== -1) {
              existingCart.item[0].quantity += element.quantity;
            } else {
              const newItemSize = {
                ...element,
                quantity: element.quantity ? element.quantity : 1,
              };
              existingCart.item.push(newItemSize);
            }
          } else {
            const newItemSize = {
              ...element,
              quantity: element.quantity ? element.quantity : 1,
            };
            existingCart.item.unshift(newItemSize);
          }
        });

        existingCart.quantityProduct = existingCart.item.reduce(
          (acc, value) => acc + value.quantity,
          0
        );
        existingCart.total = existingCart.item.reduce(
          (acc, value) => acc + value.price * value.quantity,
          0
        );
      } else {
        const total = item.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        const newCart = {
          userId,
          item: item.map((i) => ({
            ...i,
            quantity: i.quantity ? i.quantity : 1,
          })),
          quantityProduct: item.length,
          total: total,
        };
        // console.log("newCart", newCart);
        state.items.unshift(newCart);
      }
      const total = state.items.reduce((acc, product) => acc + product.total, 0);
      const quantityProduct = state.items.reduce((acc, number) => acc + number.quantityProduct,0);
      state.total= total;
      state.quantityProduct=quantityProduct;
    },
  },
});

export const { addtoCart } = cartSlice.actions;
export const cartSelector = (state) => state.cart;
export const cartReducer = cartSlice.reducer;
