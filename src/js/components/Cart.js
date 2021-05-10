import {settings, select, classNames, templates} from '../settings.js';
import utils from '../utils.js';
import CartProduct from './CartProduct.js';

class Cart{
  constructor(element){
    const thisCart = this;
    thisCart.products = [];
    thisCart.getElements(element);
    thisCart.initActions();
  }
  getElements(element){
    const thisCart = this;
    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
    thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
    thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(select.cart.totalPrice);
    thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
  }
  initActions(){
    const thisCart = this;
    thisCart.dom.toggleTrigger.addEventListener('click', function(event) {
      event.preventDefault();
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });
    thisCart.dom.productList.addEventListener('updated', function() {
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function() {
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', function(event) {
      event.preventDefault();
      thisCart.sendOrder();
    });
  }
  add(menuProduct){
    const thisCart = this;
    const generatedHTML = templates.cartProduct(menuProduct);
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    thisCart.dom.productList.appendChild(generatedDOM);
    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    thisCart.update();
  }
  update(){
    const thisCart = this;
    let deliveryFee = settings.cart.defaultDeliveryFee;
    let totalNumber = 0;
    let subTotalPrice = 0;
    for(let product of thisCart.products){
      totalNumber += product.amount;
      subTotalPrice += product.price;
    }
    if(totalNumber){
      thisCart.totalPrice = subTotalPrice + deliveryFee;
    } else {
      thisCart.totalPrice = subTotalPrice;
      deliveryFee = 0;
    }
    thisCart.dom.deliveryFee.innerHTML = deliveryFee;
    thisCart.deliveryFee = deliveryFee;
    thisCart.dom.subtotalPrice.innerHTML = subTotalPrice;
    thisCart.subTotalPrice = subTotalPrice;
    thisCart.dom.totalPrice.innerHTML = thisCart.totalPrice;
    for(let totalPrice of thisCart.dom.totalPrice){
      totalPrice.innerHTML = thisCart.totalPrice;
    }
    thisCart.dom.totalNumber.innerHTML = totalNumber;
    thisCart.totalNumber = totalNumber;
  }
  remove(product){
    const thisCart = this;
    product.dom.wrapper.remove();
    thisCart.products.splice(thisCart.products.indexOf(product), 1);
    thisCart.update();
  }
  sendOrder(){
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.orders;
    const payload = {};
    payload.address = thisCart.dom.address.value;
    payload.phone = thisCart.dom.phone.value;
    payload.totalPrice = thisCart.totalPrice;
    payload.subTotalPrice = thisCart.subTotalPrice;
    payload.totalNumber = thisCart.totalNumber;
    payload.deliveryFee = thisCart.deliveryFee;
    payload.products = [];
    for(let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    fetch(url, options);
  }
}
export default Cart;
