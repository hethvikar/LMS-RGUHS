import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent, RowClickedEvent, SelectionChangedEvent } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface GridAction {
  label: string;
  icon?: string;
  action: string;
  color?: 'primary' | 'accent' | 'warn';
  visible?: (data: any) => boolean;
}

export interface GridColumn extends ColDef {
  field: string;
  headerName?: string;
  sortable?: boolean;
  filter?: boolean;
  resizable?: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  cellRenderer?: string | Function;
  valueFormatter?: (params: any) => string;
}

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [
    CommonModule,
    AgGridAngular,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.scss']
})
export class DataGridComponent implements OnInit, OnChanges {
  @Input() rowData: any[] = [];
  @Input() columnDefs: GridColumn[] = [];
  @Input() actions: GridAction[] = [];
  @Input() pagination = true;
  @Input() paginationPageSize = 20;
  @Input() paginationPageSizeSelector = [10, 20, 50, 100];
  @Input() rowSelection: 'single' | 'multiple' = 'multiple';
  @Input() enableAdd = false;
  @Input() enableDelete = false;
  @Input() enableExport = false;
  @Input() showToolbar = true;

  @Output() rowClicked = new EventEmitter<any>();
  @Output() selectionChanged = new EventEmitter<any[]>();
  @Output() addNew = new EventEmitter<void>();
  @Output() deleteSelected = new EventEmitter<any[]>();
  @Output() export = new EventEmitter<void>();
  @Output() actionClicked = new EventEmitter<{ action: string; data: any }>();

  private gridApi!: GridApi;
  selectedRows: any[] = [];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 100,
    flex: 1
  };

  ngOnInit() {
    this.setupActionColumns();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['actions'] && this.gridApi) {
      this.setupActionColumns();
      // Note: setColumnDefs might not be available in this version, refresh the grid instead
      this.gridApi.refreshCells();
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  onRowClicked(event: RowClickedEvent) {
    this.rowClicked.emit(event.data);
  }

  onSelectionChanged(event: SelectionChangedEvent) {
    this.selectedRows = event.api.getSelectedRows();
    this.selectionChanged.emit(this.selectedRows);
  }

  onAddNew() {
    this.addNew.emit();
  }

  onDeleteSelected() {
    this.deleteSelected.emit(this.selectedRows);
  }

  onExport() {
    this.export.emit();
  }

  onQuickFilterChanged(event: any) {
    // For ag-Grid, use setGridOption or update the filter model
    if (this.gridApi && event.target) {
      this.gridApi.setGridOption('quickFilterText', event.target.value);
    }
  }

  private setupActionColumns() {
    if (this.actions.length > 0) {
      const actionColumn: GridColumn = {
        field: 'actions',
        headerName: 'Actions',
        width: 150,
        cellRenderer: this.actionCellRenderer.bind(this),
        sortable: false,
        filter: false,
        pinned: 'right'
      };
      this.columnDefs = [...this.columnDefs, actionColumn];
    }
  }

  private actionCellRenderer(params: any): string {
    const actionsHtml = this.actions
      .filter(action => !action.visible || action.visible(params.data))
      .map(action => `
        <button class="action-btn ${action.color || 'primary'}"
                title="${action.label}"
                data-action="${action.action}"
                data-row="${JSON.stringify(params.data).replace(/"/g, '"')}">
          ${action.icon ? `<mat-icon>${action.icon}</mat-icon>` : action.label}
        </button>
      `)
      .join('');

    return `<div class="action-buttons">${actionsHtml}</div>`;
  }

  refreshData() {
    if (this.gridApi) {
      this.gridApi.refreshCells();
    }
  }

  exportToCsv() {
    if (this.gridApi) {
      this.gridApi.exportDataAsCsv();
    }
  }

  exportToExcel() {
    if (this.gridApi) {
      // Implement Excel export
      console.log('Excel export not implemented yet');
    }
  }
}