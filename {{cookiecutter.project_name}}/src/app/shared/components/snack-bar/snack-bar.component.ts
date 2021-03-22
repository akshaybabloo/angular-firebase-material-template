import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string, private snackBar: MatSnackBar) {
  }

  dismiss(): void {
    this.snackBar.dismiss();
  }
}
