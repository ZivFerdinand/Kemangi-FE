import {
  Component,
  forwardRef,
  Output,
  ChangeDetectorRef,
  EventEmitter,
  ElementRef,
  ViewChild,
  input,
  computed,
} from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClient } from '@angular/common/http';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ClassicEditor } from 'ckeditor5';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { ckeditorConfig } from '../../data/config';
import { fontFamilies, fontSizes, headingOptions } from '../../data';
import { UploadAdapter } from '../../utils/ckeditor-upload-adapter.util';
import { FileProps } from '../../interfaces';

@Component({
  selector: 'app-custom-ckeditor',
  standalone: true,
  templateUrl: './custom-ckeditor.html',
  styleUrls: ['./custom-ckeditor.scss', '../../../shared/styles/index.scss'],
  imports: [CKEditorModule, NgSelectModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomCkeditor),
      multi: true,
    },
  ],
})
export class CustomCkeditor implements ControlValueAccessor {
  public Editor = ClassicEditor;

  uploadURL = input<string>('');

  value = '';

  @Output() change = new EventEmitter<string>();
  @Output() getImageData = new EventEmitter<FileProps>();

  fontFamilies = fontFamilies;
  fontSizes = fontSizes;
  headingOptions = headingOptions;

  savedSelection: any;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private http: HttpClient,
  ) {}

  config = computed(() => ({
    ...ckeditorConfig,
  }));

  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;

  private editorInstance: any;

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this.value = value || '';

    if (this.editorInstance) {
      this.editorInstance.setData(this.value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  handleChange({ editor }: any) {
    const data = editor.getData();

    this.value = data;
    this.onChange(data);
    this.change.emit(data);
  }

  // onReady(editor: any) {
  //   this.editorInstance = editor;

  //   const updateToolbarState = () => {
  //     const selection = editor.model.document.selection;
  //     const range = selection.getFirstRange();

  //     if (range) {
  //       this.savedSelection = range.clone();
  //     }

  //     this.changeDetector.markForCheck();
  //   };

  //   editor.model.document.selection.on('change:range', updateToolbarState);
  //   editor.model.document.selection.on('change:attribute', updateToolbarState);

  //   updateToolbarState();
  // }

  onReady(editor: any) {
    this.editorInstance = editor;

    editor.plugins.get('FileRepository').createUploadAdapter = (
      loader: any,
    ) => {
      return new UploadAdapter(loader, this.http, this.uploadURL());
    };

    const updateToolbarState = () => {
      const selection = editor.model.document.selection;
      const range = selection.getFirstRange();

      if (range) {
        this.savedSelection = range.clone();
      }

      this.changeDetector.markForCheck();
    };

    editor.model.document.selection.on('change:range', updateToolbarState);
    editor.model.document.selection.on('change:attribute', updateToolbarState);

    updateToolbarState();
  }

  restoreSelection(writer: any) {
    if (this.savedSelection) {
      writer.setSelection(this.savedSelection);
    }
  }

  executeCommand(command: string, value?: any) {
    const editor = this.editorInstance;
    if (!editor) return;

    editor.model.change((writer: any) => {
      this.restoreSelection(writer);

      if (value !== undefined) {
        editor.execute(command, { value });
      } else {
        editor.execute(command);
      }
    });

    editor.editing.view.focus();
  }

  onHeadingChange(value: string) {
    this.executeCommand('heading', value);
  }

  onFontChange(value: any) {
    this.executeCommand('fontFamily', value);
  }

  onFontSizeChange(size: any) {
    const value = typeof size === 'string' ? size : size?.value;
    this.executeCommand('fontSize', value);
  }

  uploadImage(event: any) {
    const file = event.target.files?.[0];
    if (!file || !this.editorInstance) return;

    const editor = this.editorInstance;

    const fileRepository = editor.plugins.get('FileRepository');
    const loader = fileRepository.createLoader(file);

    if (!loader) return;

    loader.upload().then((data: any) => {
      this.getImageData.emit({
        extension: data.extension,
        generatedName: data.generatedName,
        originalName: data.originalName,
      });
      editor.model.change((writer: any) => {
        const imageElement = writer.createElement('imageBlock', {
          src: data.default,
        });

        editor.model.insertContent(
          imageElement,
          editor.model.document.selection,
        );
      });
    });

    event.target.value = null;
  }

  openImageUpload() {
    this.imageInput.nativeElement.click();
  }

  isActive(command: string, value?: string) {
    if (!this.editorInstance) return false;

    const cmd = this.editorInstance.commands.get(command);
    if (!cmd) return false;

    if (value) return cmd.value === value;

    return !!cmd.value;
  }
}
