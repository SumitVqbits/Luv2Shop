import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from '../../common/country';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { PaymentInfo } from '../../common/payment-info';
import { Purchase } from '../../common/purchase';
import { State } from '../../common/state';
import { CartService } from '../../services/cart.service';
import { CheckoutcService } from '../../services/checkoutc.service';
import { Luv2ShopFormService } from '../../services/luv2-shop-form.service';
import { Luv2ShopValidators } from '../../validators/luv2-shop-validators';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  countries: any[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  totalQuantity: any;
  totalPrice: any;

  storage: Storage = sessionStorage;

  // Initialize the Stripe API
  stripe = Stripe(environment.stripePublishableKey);

  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";

  isDisabled: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private luv2ShopFormService: Luv2ShopFormService,
    private cartService: CartService,
    private checkoutcService: CheckoutcService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.setupStripePaymentForm();
    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace]),

        lastName: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace]),

        email: new FormControl('',
          [Validators.required, Validators.email])
      }),

      shippingAddress: this.formBuilder.group({
        street: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace]),
        city: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace]),
      }),

      billingAddress: this.formBuilder.group({
        street: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace]),
        city: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace]),
      }),

      creditCard: this.formBuilder.group({})
    });

    // Populate countries
    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );
  }

  setupStripePaymentForm() {
    var elements = this.stripe.elements();
    this.cardElement = elements.create('card', { hidePostalCode: true });
    this.cardElement.mount('#card-element');

    this.cardElement.on('change', (event: any) => {
      this.displayError = document.getElementById('card-errors');
      if (event.complete) {
        this.displayError.textContent = "";
      } else if (event.error) {
        this.displayError.textContent = event.error.message;
      }
    });
  }

  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }

  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      this.checkoutFormGroup.get('billingAddress')?.setValue(
        this.checkoutFormGroup.get('shippingAddress')?.value
      );
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }
  }

  onSubmit() {
    console.log("Handling the submit button");

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // Set up order
    let order = new Order();
    order.totalPrice = (typeof this.totalPrice === 'string') ? parseFloat(this.totalPrice) : this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // Get cart items
    const cartItems = this.cartService.cartItems;

    // Create orderItems from cartItems
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    // Set up purchase
    let purchase = new Purchase();

    // Populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // Populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = this.checkoutFormGroup.get('shippingAddress')?.value.state;
    const shippingCountry: Country = this.checkoutFormGroup.get('shippingAddress')?.value.country;
    purchase.shippingAddress!.state = shippingState ? shippingState.name : "";
    purchase.shippingAddress!.country = shippingCountry ? shippingCountry.name : "";

    // Populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = this.checkoutFormGroup.controls['billingAddress'].value.state;
    const billingCountry: Country = this.checkoutFormGroup.controls['billingAddress'].value.country;
    purchase.billingAddress!.state = billingState ? billingState.name : "";
    purchase.billingAddress!.country = billingCountry ? billingCountry.name : "";

    // Populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // Compute payment info
    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = "INR";
    this.paymentInfo.receiptEmail = purchase.customer?.email || '';

    // Get billing country code for Stripe
    const billingCountryCode = this.checkoutFormGroup.get('billingAddress.country')?.value?.code;

    console.log(`paymentInfo.amount: ${this.paymentInfo.amount}`);
    console.log('receiptEmail:', this.paymentInfo.receiptEmail);
    console.log('country code:', billingCountryCode);

    if (!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {

      // Disable the 'Purchase' button while the transaction is 'Processing' to prevent duplicate requests
      this.isDisabled = true;

      this.checkoutcService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse: { client_secret: string }) => {

          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
            {
              payment_method: {
                card: this.cardElement,
                billing_details: {
                  email: purchase.customer?.email,
                  name: `${purchase.customer?.firstName} ${purchase.customer?.lastName}`,
                  address: {
                    line1: purchase.billingAddress?.street,
                    city: purchase.billingAddress?.city,
                    state: purchase.billingAddress?.state || null,
                    postal_code: purchase.billingAddress?.zipCode,
                    country: billingCountryCode
                  }
                }
              }
            }, { handleActions: true })
            .then((result: any) => {
              if (result.error) {
                let errorMessage = `Payment failed: ${result.error.message}`;
                
                if (result.error.type === 'card_error' || result.error.code === 'card_declined' || result.error.decline_code === 'generic_decline') {
                   errorMessage += `\n\nFor Indian accounts, RBI mandates 3D Secure (AFA).`;
                   errorMessage += `\nPlease use India-specific test cards that trigger 3DS:\n- Visa: 4000 0000 0000 3063\n- Mastercard: 5200 0000 0000 3184`;
                }

                alert(errorMessage);
                this.isDisabled = false; // Re-enable to allow user to try again
              } else if (result.paymentIntent && result.paymentIntent.status === 'requires_action') {
                // Explicitly handle requires_action if handleActions wasn't sufficient
                this.stripe.handleCardAction(result.paymentIntent.client_secret).then((actionResult: any) => {
                  if (actionResult.error) {
                    alert(`Authentication failed: ${actionResult.error.message}`);
                    this.isDisabled = false;
                  } else {
                    this.placeOrder(purchase);
                  }
                });
              } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
                // Payment was successful
                this.placeOrder(purchase);
              } else {
                 alert(`Unexpected payment status: ${result.paymentIntent?.status}`);
                 this.isDisabled = false;
              }
            }).catch((err: any) => {
                alert(`Error confirming payment: ${err.message}`);
                this.isDisabled = false;
            });
        },
        (error: any) => {
            alert(`Error creating payment intent: ${error.message}`);
            this.isDisabled = false;
        }
      );

    } else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
  }

  placeOrder(purchase: Purchase) {
    this.checkoutcService.placeOrder(purchase).subscribe({
      next: (response: any) => {
        console.log("Full Response from Backend:", response);
        const trackingNumber = response.orderTrackingNumber || response.trackingNumber;
        alert(`Your order has been received.\nOrder tracking number: ${trackingNumber}`);
        this.resetCart();
        this.isDisabled = false;
      },
      error: (err: any) => {
        alert(`There was an error placing order: ${err.message}`);
        this.isDisabled = false;
      }
    });
  }

  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();
    this.checkoutFormGroup.reset();
    this.router.navigateByUrl("/products");
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }
        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.get('expirationYear')?.value);
    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }
}