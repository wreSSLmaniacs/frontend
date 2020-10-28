import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RunService } from '../run.service';
import { RunInput } from '../run_input';
import { RunOutput } from '../run_output';

import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-ambiance';
import 'ace-builds/src-noconflict/theme-github';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})

export class EditorComponent implements AfterViewInit {

  @ViewChild('codeEditor') private editor: ElementRef<HTMLElement>;
  private aceEditor : ace.Ace.Editor;

  THEME : string = 'github';
  LANG : string = 'c_cpp';

  code : string = '';
  input : string = '';
  output : string = '';

  constructor(private runscript : RunService) { }

  ngAfterViewInit(): void {
    ace.config.set("fontSize", "16px");
    this.aceEditor = ace.edit(this.editor.nativeElement);
    this.aceEditor.setTheme('ace/theme/'+this.THEME);
    this.aceEditor.session.setMode('ace/mode/'+this.LANG);
    this.aceEditor.session.setValue("#include<bits/stdc++.h>");
  }

  public runCode() {
      this.code = this.aceEditor.session.getValue();
      const send : RunInput = {
        script : this.code,
        language : this.LANG,
        input : this.input
      };
      console.log(send);
      this.runscript.runScript(send).subscribe(receivied =>
        {
          if(receivied.success==true) {
            this.output = receivied.output;
          }   
          else {
            this.output = "Error: " + receivied.output;
          }
        });
  }

  public updateTheme() {
    this.aceEditor.setTheme('ace/theme/'+this.THEME);
  }

  public updateLang() {
    this.aceEditor.session.setMode('ace/mode/'+this.LANG);
    switch(this.LANG) {
      case 'c_cpp': {
        this.aceEditor.session.setValue("#include<bits/stdc++.h>");
        break;
      }
      case 'python': {
        this.aceEditor.session.setValue("import os");
        break;
      }
    }
  }

} 