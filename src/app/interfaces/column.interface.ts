export interface Column {
  showDefault(): void;
  showNotePad(): void;
  showScratchPad(): void;
  getScratchPadCount(): number;

  columnState: string;
}
