import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableDataSourcePageEvent, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IUser } from 'src/app/interfaces/user';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Route, RouterModule } from '@angular/router';
import { DialogModule } from '@angular/cdk/dialog';
import { UserService } from 'src/app/services/user.service';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe } from '@angular/common';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'list-component',
  styleUrls: ['./list.component.css'],
  templateUrl: './list.component.html',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatIconModule, MatTooltipModule, RouterModule, DialogModule, MatProgressSpinnerModule, DatePipe],
})
export class ListComponent implements AfterViewInit {
  displayedColumns: string[] = ['nombre', 'email', 'rol', 'acciones'];
  dataSource: MatTableDataSource<IUser>;
  users?: IUser[];
  currentPage?: number;
  pageSize?: number;
  pages: number = 1;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  data: IUser[] = [];
  backUpData: IUser[] = [];
  constructor(private userService: UserService) {
    this.dataSource = new MatTableDataSource(this.users);
  }


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit() {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.userService.get(`http://localhost:8080/users?page=${this.paginator.pageIndex + 1}&pageSize=${this.paginator.pageSize}`).pipe(catchError(() => observableOf(null)));
        }),
        map((data: any) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.resultsLength = data.totalPages;
          return data.data;
        }),
      )
      .subscribe(data => {
        this.data = data
        this.backUpData = data
      });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log(filterValue)
    const users = this.data.filter(data => data.nombre.toLowerCase().includes(filterValue.toLowerCase()) || data.email.toLowerCase().includes(filterValue.toLowerCase()));
    if (!users || filterValue == '') {
      console.log('0')
      this.data = this.backUpData
    } else {
      this.data = users;
    }
  }
  calculateNumberOfPages(): number {
    if (!this.paginator || !this.dataSource.data) {
      return 0;
    }
    return Math.ceil(this.dataSource.data.length / this.paginator.pageSize);
  }
  delete(id: string): void {
    this.userService.delete('http://localhost:8080/users/' + id).subscribe((data: any) => {
      console.log(data);
      this.data = this.data.filter((i: IUser) => i.id !== id)
    });
  }
}