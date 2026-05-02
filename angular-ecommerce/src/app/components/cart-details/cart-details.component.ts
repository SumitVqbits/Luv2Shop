import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private castService: CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
    
  }
  listCartDetails() {

    // Get handle to the cart items
    this.cartItems = this.castService.cartItems;

    // Subscribe to the cart totalPrice
    this.castService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    // Subscribe to the cart totalQuantity
    this.castService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    // Compute cart total price and quantity
    this.castService.computeCartTotals();
  }

  incrementQuantity(theCartItem: CartItem) {
    this.castService.addToCart(theCartItem);
  }

  decrementQuantity(theCartItem: CartItem) {
    this.castService.decrementQuantity(theCartItem);
  }

  remove(theCartItem: CartItem) {
    this.castService.remove(theCartItem);
  }

}
