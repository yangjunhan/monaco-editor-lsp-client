import { Injectable } from '@angular/core';
import * as monaco from 'monaco-editor';
import {
  CloseAction,
  ErrorAction,
  MonacoLanguageClient,
  MonacoServices,
  MessageTransports
} from "monaco-languageclient";
import { StandaloneServices } from 'vscode/services';
import getMessageServiceOverride from 'vscode/service-override/messages';
import { BrowserMessageReader, BrowserMessageWriter } from 'vscode-languageserver-protocol/browser';

export const languageName = 'flinkSql';

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  languageClient?: MonacoLanguageClient;

  initLanguages(): void {
    StandaloneServices.initialize({
      ...getMessageServiceOverride(document.body)
    });

    monaco.languages.register({
      id: languageName,
      aliases: ['SQL', 'sql', 'FLINK_SQL', 'flink_sql'],
      mimetypes: ['text/plain', 'text/sql', 'text/x-sql']
    });

    // install Monaco language client services
    MonacoServices.install();

    const worker = new Worker(new URL('/assets/flink-sql-language-server/server-worker.js', window.location.href).href, { type: 'module' });
    const reader = new BrowserMessageReader(worker);
    const writer = new BrowserMessageWriter(worker);
    this.languageClient = this.createLanguageClient({ reader, writer });
    this.languageClient.start().catch(err => console.error(err));
    reader.onClose(() => this.languageClient!.stop());
  }

  private createLanguageClient(transports: MessageTransports): MonacoLanguageClient {
    return new MonacoLanguageClient({
      name: 'Sample Language Client',
      clientOptions: {
        // use a language id as a document selector
        documentSelector: [{ language: languageName }],
        // disable the default error handler
        errorHandler: {
          error: (err) => {
            console.error(err);
            return { action: ErrorAction.Continue };
          },
          closed: () => ({ action: CloseAction.DoNotRestart })
        }
      },
      // create a language client connection to the server running in the web worker
      connectionProvider: {
        get: () => {
          return Promise.resolve(transports);
        }
      }
    });
  }
}
