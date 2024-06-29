import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrl: './tab-bar.component.css'
})
export class TabBarComponent {

  @Input() tabs: { label: string, route: string }[] = [];
  @Output() tabSelected = new EventEmitter<string>();

  @Input() forms: {label:string, input:string, type:string}[] = [];
  @Input() formControlName = 1;
  activeTab: { label: string, route: string } | null = null;

  crearSolicitudForm: FormGroup = new FormGroup({});


  onSubmit(): void {}
  selectTab(tab: { label: string, route: string }): void {
    this.activeTab = tab;
    this.tabSelected.emit(tab.route);
  }
  
}
