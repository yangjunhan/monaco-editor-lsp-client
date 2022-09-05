import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { EditorService } from "./editor.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'monaco-editor-lsp-client';

  constructor(private editorService: EditorService) {}

  ngOnInit(): void {
    this.editorService.initLanguages();
  }
}
