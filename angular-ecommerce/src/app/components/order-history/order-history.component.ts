import { Component, OnInit } from '@angular/core';
import { OrderHistory } from '../../common/order-history';
import { OrderHistoryService } from '../../services/order-history.service';
import { CommonModule, CurrencyPipe, DatePipe, NgForOf} from '@angular/common';



@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, NgForOf, CommonModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService) { }

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  handleOrderHistory() {
  const theUsername = JSON.parse(this.storage.getItem('username')!);

  this.orderHistoryService.getOrderHistory(theUsername).subscribe(
    data => {
      this.orderHistoryList = data._embedded.orders;
    }
  );
}

   
  }

