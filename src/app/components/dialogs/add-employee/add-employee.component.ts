import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TypeId } from '../../../models/type-id.interface';
import { Area } from '../../../models/area.interface';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

//Services
import { TypesIdService } from '../../../services/types-id.service';
import { AreaService } from '../../../services/area.service';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from 'src/app/models/employee.interface';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {

  //formEmployee: FormGroup;

  typesId: TypeId[] =  [];
  areas: Area [] = [];
  possibleEmail: string = '';
  domain = '@cidenet.com.co';
  emailOk: boolean = true;
  employeeFinded:any;

  formEmployee: FormGroup;



  constructor(
    private formBuilder: FormBuilder,
    private typeIdService: TypesIdService,
    private areaService: AreaService,
    private employeeService: EmployeeService,
    private matDialog: MatDialog
  ) {
    this.formEmployee = this.formBuilder.group({
      id: ['',[Validators.required, Validators.maxLength(20), Validators.pattern('[a-zA-Z0-9]*')]],
      firstName: ['', [Validators.required, Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*')]],
      secondName: ['', [Validators.maxLength(50), Validators.pattern('[a-zA-Z ]*')]],
      firstLastName: ['', [Validators.required, Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*')]],
      secondLastName: ['', [Validators.required, Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*')]],
      email: [''],
      entryDate: [new Date()],
      registerDate: [new Date()],
      state: ['Activo'],
      typeId: [1],
      areaId: [1],
      countryId: [1,[Validators.required]]
    });
   }

  ngOnInit(): void {
    this.getTypesId();
    this.getAreas();

    this.formEmployee.valueChanges.subscribe((changes) => {
      if(changes.firstName != '' && changes.firstLastName != ''){
        this.possibleEmail = changes.firstName.toLowerCase() + '.' + changes.firstLastName.toLowerCase();
        this.findByEmail();
      }
      if(changes.countryId == 2){
        this.domain = '@cidenet.com.us';
      } else {
        this.domain = '@cidenet.com.co';
      }
    });
  }

  //Get the all types of Id
  getTypesId(){
    this.typeIdService.getTypesId().subscribe((response) => {
      this.typesId = response;
    });
  }
  //Get the all areas of the company
  getAreas(){
    this.areaService.getAreas().subscribe((response) => {
      this.areas = response;
    });
  }

  /**
   * Method to find all coincidences to check if a possible email is avaliable
   */
  findByEmail(){
    this.employeeService.findByEmail(this.possibleEmail+this.domain).subscribe((response)=> {
      if(response != null){
        this.emailOk = false;
        this.employeeFinded =  response;
      }else {
        this.emailOk = true;
      }
    });
  }

  /**
   * Method to resolve the wrong email by a available email
   */

  resolveEmail(){
    let emailOccuped: string = this.employeeFinded.email;
    let changeEmail: string = this.possibleEmail;
    let num: string = '';

    if(!this.hasNumbers(emailOccuped)){
      this.possibleEmail = this.possibleEmail + '1';
    } else {
      for (let i = 1; i < 10; i++) {
        if(emailOccuped.includes(i.toString())){
          num = (i+1).toString();
          changeEmail = changeEmail.replace(i.toString(),num);
          this.possibleEmail = changeEmail;
          break;
        }
      }
    }
    this.findByEmail();
  }

  hasNumbers(cadena: string){
    for (let i = 1; i < 10; i++) {
      if(cadena.includes(i.toString())){
        return true;
      }
    }
    return false;
  }

  get formControls (){
    return this.formEmployee.controls;
  }

  onSubmit(){
    this.formControls['email'].setValue(this.possibleEmail+this.domain);

    this.employeeService.addEmployee(this.formEmployee.value).subscribe((response) => {
      if(response){
        Swal.fire({
          icon: 'success',
          title: 'Felicidades',
          text: 'Empleado registrado correctamente!'
        }).then(() => {
          this.matDialog.getDialogById('dialog_add_employee')?.close();
        })
      }
    });
  }

}
