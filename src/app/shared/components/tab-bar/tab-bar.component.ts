import { Component, EventEmitter, Input, OnChanges, SimpleChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrl: './tab-bar.component.css'
})
export class TabBarComponent implements OnChanges {

  @Input() tabs: { label: string, route: string }[] = [];
  @Output() tabSelected = new EventEmitter<string>();

  @Input() forms: { label: string, input: string, type: string }[] = [];
  @Input() formControlName = 1;
  activeTab: { label: string, route: string } | null = null;

  crearSolicitudForm: FormGroup = new FormGroup({});

  @Input() tabForaneo: { label: string, route: string };

  onSubmit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tabForaneo'] && changes['tabForaneo'].currentValue) {
      this.activeTab = this.tabs.find(tab => tab.label === this.tabForaneo?.label && tab.route === this.tabForaneo?.route) || null;
    }
  }

  selectTab(tab: { label: string, route: string }): void {
    this.activeTab = tab;
    this.tabSelected.emit(tab.route);
  }

}
