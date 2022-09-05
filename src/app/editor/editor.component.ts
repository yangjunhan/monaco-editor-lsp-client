import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from "@angular/forms";
import * as monaco from 'monaco-editor';
import { EditorService, languageName } from "../editor.service";
import { ExecuteCommandRequest } from "monaco-languageclient";

@Component({
  selector: 'app-editor',
  standalone: true,
  templateUrl: './editor.component.html',
  imports: [
    FormsModule
  ],
  styleUrls: ['./editor.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorComponent implements OnInit {
  @ViewChild('editor', { static: true }) editorRef!: ElementRef<HTMLElement>;
  readonly editorOption = { language: languageName };
  readonly content = `select max(data) from table_A;`;

  constructor(private editorService: EditorService) {}

  ngOnInit(): void {
    const editor = monaco.editor.create(this.editorRef.nativeElement, {
      model: monaco.editor.createModel(this.content, languageName, monaco.Uri.parse('test://test.sql'))
    });
    // wait for documents connection
    setTimeout(() => {
      this.extractSQLStructure(editor.getModel()!.uri.toString());
    }, 500);
  }

  private extractSQLStructure(uri: string): void {
    this.editorService.languageClient!.sendRequest(ExecuteCommandRequest.type, {
      command: 'extension.flinkSQL.extractStructure',
      arguments: [uri]
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.error(err);
    });
  }
}
