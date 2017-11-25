import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { FormsModule }         from '@angular/forms';
//dolphinng
import {
  CommonModule as MyCommonModule,
  ModalModule,
  UploaderModule,
  DatePickerModule,
  DatetimePickerModule,
  FormsModule as MyFormsModule,
  PaginatorModule as MyPaginatorModule,
  GalleryModule,
  CurrencyFormatModule,
  DateFormatModule,
  NullReplaceModule,
}   from 'dolphinng';
//primeng
import {
  DataTableModule as PDataTableModule,
  SharedModule as PSharedModule,
  MultiSelectModule,
  SliderModule,
  DropdownModule,
  ContextMenuModule,
  PaginatorModule
} from 'primeng/primeng';
//local
import {DictionaryPipe} from '../../pipes/dictionary/dictionary.pipe';
import {ContentModelDirective} from '../../directives/contentModel/contentModel.directive';
import {MySrcDirective} from '../../directives/mySrc/mySrc.directive';
import {AreaPickerDirective} from '../../directives/areaPicker/areaPicker.directive';
import {ContractEditorComponent}   from '../../components/contract-editor/contract-editor.component';
import {SystemLogsComponent}   from '../../components/system-logs/system-logs.component';
import {PreviewOrDownloadButtonComponent}   from '../../components/preview-or-download-button/preview-or-download-button.component';
import {PreviewerComponent}   from '../../components/previewer/previewer.component';
@NgModule({
  imports:[
    //ng
    CommonModule,
    FormsModule,
    //dolphinng
    ModalModule,
    MyFormsModule,
    GalleryModule,
    CurrencyFormatModule,
    DateFormatModule,
    NullReplaceModule,
    MyPaginatorModule,
    MyCommonModule,
    DatePickerModule,
    DatetimePickerModule,
    UploaderModule,
    //primeng
    PDataTableModule,
    PSharedModule,
    MultiSelectModule,
    SliderModule,
    DropdownModule,
    ContextMenuModule,
    PaginatorModule
  ],
  declarations: [
    DictionaryPipe,
    ContentModelDirective,
    AreaPickerDirective,
    MySrcDirective,
    ContractEditorComponent,
    SystemLogsComponent,
    PreviewOrDownloadButtonComponent,
    PreviewerComponent
  ],
  exports:      [
    //ng
    FormsModule,
    CommonModule,
    //dolphinng
    ModalModule,
    MyFormsModule,
    GalleryModule,
    CurrencyFormatModule,
    DateFormatModule,
    NullReplaceModule,
    MyPaginatorModule,
    MyCommonModule,
    DatePickerModule,
    DatetimePickerModule,
    UploaderModule,
    //primeng
    PDataTableModule,
    PSharedModule,
    MultiSelectModule,
    SliderModule,
    DropdownModule,
    ContextMenuModule,
    PaginatorModule,
    //local
    DictionaryPipe,
    ContentModelDirective,
    AreaPickerDirective,
    MySrcDirective,
    ContractEditorComponent,
    SystemLogsComponent,
    PreviewOrDownloadButtonComponent,
    PreviewerComponent

  ]
})
export class SharedModule { }
