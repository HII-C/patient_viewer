export interface Column {
  showDefault(): void;
  showNotePad(): void;
  showScratchPad(): void;
  
  columnState: string;
}
