import { Component, OnInit } from '@angular/core';
import { Employee } from '../../models/employee.interface';
import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort,Sort } from '@angular/material/sort';
import Swal from 'sweetalert2';

//Services
import { EmployeeService } from '../../services/employee.service';

//Dialogs
import { AddEmployeeComponent } from '../dialogs/add-employee/add-employee.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  dataSource: Employee[] = [];
  displayedColumns: any;

  constructor(
    public dialog: MatDialog,
    private employeeService: EmployeeService
  ) { }

  ngOnInit(): void {
    this.displayedColumns = ['id', 'firstName', 'secondName', 'firstLastName', 'secondLastName', 'email', 'state'];
    this.getEmployees();
  }

  getEmployees(){
    this.employeeService.getEmployess().subscribe((response) => {
      this.dataSource = response;
    });
  }

  showDialogAdd(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.id = 'dialog_add_employee';

    const dialogRef = this.dialog.open(AddEmployeeComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data) => {
        this.getEmployees();
    });
  }

  showDialogRemove(id: string){
    Swal.fire({
      title: 'Seguro desea remover el empleado?',
      text: "Esta acción no tiene reverso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, remover!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.removeEmployee(id);
      }
    })
  }

  removeEmployee(id: string){
    console.log(id);
    this.employeeService.removeEmployee(id).subscribe((response) => {
      this.getEmployees();
      Swal.fire(
        'Removido!',
        'El empleado ha sido removido exitosamente de los registros.',
        'success'
      );
    });
  }


}
