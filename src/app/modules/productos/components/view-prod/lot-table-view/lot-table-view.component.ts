import { Component, OnInit, Inject, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Lot } from '../../../../../core/models/lot.model';

@Component({
  selector: 'app-lot-table-view',
  templateUrl: './lot-table-view.component.html',
  styleUrl: './lot-table-view.component.css'
})
export class LotTableViewComponent implements OnInit, OnChanges {
  displayedColumns: string[] = ['code', 'operativeStatus', 'disponibilityState', 'securityState', 'stock', 'expiredDate'];
  dataSource: MatTableDataSource<Lot>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dialogRef: MatDialogRef<LotTableViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Lot[]
  ) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && changes['data'].currentValue) {
      this.dataSource.data = changes['data'].currentValue;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
